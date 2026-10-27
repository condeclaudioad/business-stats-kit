import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import pg from "pg";
import { hashToken, newToken } from "../lib/auth/crypto";
// Isolated disposable database only. Never point this test at a dashboard database.
const url = process.env.AUTH_TEST_DATABASE_URL;
test(
  "Postgres: concurrent throttle, session expiry and reset revocation",
  { skip: !url },
  async () => {
    const parsed = new URL(url!);
    assert.match(
      parsed.pathname,
      /_auth_test$/,
      "Use a disposable database ending _auth_test",
    );
    process.env.DATABASE_URL = url;
    const { pool, reserveAttempt, validSession } = await import(
      "../lib/auth/store"
    );
    const db = new pg.Client({ connectionString: url });
    await db.connect();
    try {
      await db.query(
        await readFile(new URL("../sql/auth.sql", import.meta.url), "utf8"),
      );
      await db.query(
        "TRUNCATE stats_auth.owner,stats_auth.passkeys,stats_auth.flows,stats_auth.sessions,stats_auth.rate_limits",
      );
      const outcomes = await Promise.all(
        Array.from({ length: 40 }, () => reserveAttempt()),
      );
      assert.equal(
        outcomes.filter(Boolean).length,
        20,
        "Concurrent attempts must not race past the global budget",
      );
      const token = newToken(),
        expired = newToken(),
        version = randomUUID();
      await db.query(
        "INSERT INTO stats_auth.owner(username,password_hash,version) VALUES($1,$2,$3)",
        ["test", "unused", version],
      );
      await db.query(
        "INSERT INTO stats_auth.sessions(token_hash,owner_version,expires) VALUES($1,$2,now()+interval '1 hour'),($3,$2,now()-interval '1 second')",
        [hashToken(token), version, hashToken(expired)],
      );
      assert.equal(await validSession(token), true);
      assert.equal(await validSession(expired), false);
      assert.equal(await validSession(newToken()), false);
      await db.query("UPDATE stats_auth.owner SET version=$1", [randomUUID()]);
      assert.equal(
        await validSession(token),
        false,
        "Changing owner generation revokes all old sessions",
      );
      const acl = await db.query(
        "SELECT has_schema_privilege('stats_auth','USAGE') AS owner_access, nspacl::text AS acl FROM pg_namespace WHERE nspname='stats_auth'",
      );
      assert.equal(acl.rows[0].owner_access, true);
      assert.equal(
        /(^|[,\{])=/.test(acl.rows[0].acl),
        false,
        "PUBLIC must have no schema privileges",
      );
    } finally {
      await db.query("DROP SCHEMA stats_auth CASCADE");
      await db.end();
      await pool().end();
    }
  },
);
