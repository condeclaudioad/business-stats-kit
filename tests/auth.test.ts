import { test } from "node:test";
import assert from "node:assert/strict";
import { scrypt, randomBytes } from "node:crypto";
import { verifyPassword, hashToken, newToken } from "../lib/auth/crypto";
import { authConfig, cookieOptions, isDemo } from "../lib/auth/config";
import { requireSession, checkOrigin } from "../lib/auth/guard";
import { login, registerVerify } from "../lib/auth/handlers";
const previous = { ...process.env };
function live() {
  process.env.APP_MODE = "live";
  process.env.APP_ORIGIN = "https://stats.example.test";
  process.env.DATABASE_URL = "postgresql://unused:unused@127.0.0.1:1/unused";
}
test("password verifies only the correct input and rejects malformed hashes", async () => {
  const salt = randomBytes(16),
    password = "synthetic-test-password-918";
  const digest = await new Promise<Buffer>((resolve, reject) =>
    scrypt(
      password,
      salt,
      32,
      { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 },
      (err, key) => (err ? reject(err) : resolve(key)),
    ),
  );
  const stored = `scrypt-v1$${salt.toString("hex")}$${digest.toString("hex")}`;
  assert.equal(await verifyPassword(password, stored), true);
  assert.equal(await verifyPassword(password + "x", stored), false);
  assert.equal(await verifyPassword(password, "scrypt-v1$bad$bad"), false);
  assert.equal(await verifyPassword("x".repeat(1025), stored), false);
});
test("tokens are independent 256-bit secrets stored by hash", () => {
  const a = newToken(),
    b = newToken();
  assert.match(a, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(a, b);
  assert.notEqual(hashToken(a), a);
  assert.equal(hashToken(a).length, 64);
});
test("demo requires explicit mode and invalid modes fail closed", async () => {
  try {
    delete process.env.APP_MODE;
    assert.equal(isDemo(), false);
    assert.equal(
      (await requireSession(new Request("http://localhost/api/dashboard")))
        ?.status,
      503,
    );
    process.env.APP_MODE = "anything";
    assert.throws(authConfig);
    process.env.APP_MODE = "demo";
    assert.equal(isDemo(), true);
    assert.equal(
      await requireSession(new Request("http://localhost/api/dashboard")),
      null,
    );
  } finally {
    process.env = { ...previous };
  }
});
test("live authorization never bypasses for localhost, forged cookies or proxy headers", async () => {
  try {
    live();
    for (const cookie of [
      "",
      "stats_session=fake",
      "__Host-stats_session=bad",
    ]) {
      const res = await requireSession(
        new Request("http://localhost/api/dashboard", {
          headers: { cookie, "x-forwarded-host": "localhost" },
        }),
      );
      assert.equal(res?.status, 401);
      assert.equal(res?.headers.get("cache-control"), "no-store");
    }
  } finally {
    process.env = { ...previous };
  }
});
test("HTTPS origin is exact and cookies are secure, httpOnly, strict", () => {
  try {
    live();
    assert.equal(
      checkOrigin(
        new Request("https://stats.example.test", {
          headers: { origin: "https://evil.example.test" },
        }),
      ),
      false,
    );
    assert.equal(
      checkOrigin(
        new Request("https://stats.example.test", {
          headers: {
            origin: "https://stats.example.test",
            "sec-fetch-site": "cross-site",
          },
        }),
      ),
      false,
    );
    assert.equal(
      checkOrigin(
        new Request("https://stats.example.test", {
          headers: { origin: "https://stats.example.test" },
        }),
      ),
      true,
    );
    assert.deepEqual(cookieOptions(300), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 300,
    });
    for (const origin of [
      "http://stats.example.test",
      "https://stats.example.test/",
      "https://stats.example.test/path",
      "https://u:p@stats.example.test",
    ]) {
      process.env.APP_ORIGIN = origin;
      assert.throws(authConfig);
    }
    process.env.APP_ORIGIN = "http://localhost:4321";
    assert.equal(authConfig().secure, false);
  } finally {
    process.env = { ...previous };
  }
});
test("auth mutations reject absent and hostile Origin before touching DB", async () => {
  try {
    live();
    for (const handler of [login, registerVerify])
      for (const origin of ["", "https://evil.example.test"]) {
        const res = await handler(
          new Request("https://stats.example.test/api/auth/login", {
            method: "POST",
            headers: origin ? { origin } : {},
          }),
        );
        assert.equal(res.status, 403);
      }
    process.env.APP_MODE = "demo";
    assert.equal(
      (
        await login(
          new Request("http://localhost/api/auth/login", { method: "POST" }),
        )
      ).status,
      503,
    );
  } finally {
    process.env = { ...previous };
  }
});
