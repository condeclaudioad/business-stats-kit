#!/usr/bin/env node
import { randomBytes, randomUUID, scrypt, createHash } from "node:crypto";
import { readFile, writeFile, chmod } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { createInterface } from "node:readline/promises";
import { emitKeypressEvents } from "node:readline";
import pg from "pg";
try {
  loadEnvFile(".env.local");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const args = new Set(process.argv.slice(2));
const reset = args.has("--reset");
if (!process.env.DATABASE_URL)
  throw new Error("Configurá DATABASE_URL en .env.local (base dedicada).");
async function hidden(label) {
  process.stdout.write(label);
  process.stdin.resume();
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  return new Promise((resolve, reject) => {
    let value = "";
    const cleanup = () => {
      process.stdin.off("keypress", key);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
    };
    function key(text, k = {}) {
      if (k.ctrl && k.name === "c") {
        cleanup();
        reject(new Error("Cancelado."));
        return;
      }
      if (k.name === "return") {
        cleanup();
        resolve(value);
        return;
      }
      if (k.name === "backspace") {
        value = value.slice(0, -1);
        return;
      }
      if (text && !k.ctrl && !k.meta && !/[\x00-\x1f\x7f]/.test(text))
        value += text;
    }
    process.stdin.on("keypress", key);
  });
}
let username, password;
if (args.has("--password-stdin")) {
  if (process.stdin.isTTY)
    throw new Error(
      "--password-stdin requiere pipe; para uso humano ejecutá sin flags.",
    );
  username = [...args].find((a) => a.startsWith("--username="))?.slice(11);
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
    if (input.length > 4096) throw new Error("Entrada demasiado larga.");
  }
  password = input.replace(/\r?\n$/, "");
} else {
  if (!process.stdin.isTTY)
    throw new Error(
      "Usá terminal interactiva. CI admite --password-stdin --username=owner.",
    );
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  username = (await rl.question("Usuario del único dueño: ")).trim();
  rl.close();
  password = await hidden("Contraseña (mínimo 14 caracteres, no se muestra): ");
  if (password !== (await hidden("Repetí la contraseña: ")))
    throw new Error("Las contraseñas no coinciden.");
}
if (!username || username.length > 200 || /[\x00-\x1f]/.test(username))
  throw new Error("Usuario inválido.");
if (!password || password.length < 14 || password.length > 1024)
  throw new Error("La contraseña debe tener entre 14 y 1024 caracteres.");
const salt = randomBytes(16),
  digest = await new Promise((resolve, reject) =>
    scrypt(
      password,
      salt,
      32,
      { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    ),
  );
password = "";
const hash = `scrypt-v1$${salt.toString("hex")}$${digest.toString("hex")}`;
const token = randomBytes(32).toString("base64url");
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});
await db.connect();
try {
  await db.query("BEGIN");
  await db.query("SELECT pg_advisory_xact_lock(731062719)");
  await db.query(
    await readFile(new URL("../sql/auth.sql", import.meta.url), "utf8"),
  );
  const { rows } = await db.query("SELECT 1 FROM stats_auth.owner FOR UPDATE");
  if (rows.length && !reset)
    throw new Error(
      "Ya existe un dueño. Para recuperar acceso usá --reset: revoca TODAS las sesiones y passkeys.",
    );
  await db.query("DELETE FROM stats_auth.sessions");
  await db.query("DELETE FROM stats_auth.flows");
  await db.query("DELETE FROM stats_auth.passkeys");
  await db.query("DELETE FROM stats_auth.owner");
  await db.query(
    "INSERT INTO stats_auth.owner(username,password_hash,version,bootstrap_hash,bootstrap_expires) VALUES($1,$2,$3,$4,now()+interval '30 minutes')",
    [
      username,
      hash,
      randomUUID(),
      createHash("sha256").update(token).digest("hex"),
    ],
  );
  // Exclusive permissions; never print the bootstrap token to terminal logs.
  await writeFile(".auth-bootstrap", token + "\n", { mode: 0o600, flag: "w" });
  await chmod(".auth-bootstrap", 0o600);
  await db.query("COMMIT");
  console.log(
    "Acceso preparado. Abrí .auth-bootstrap de forma privada y usá su token en /login. Vence en 30 minutos; borrá el archivo después del alta. No lo pegues en chats ni commits.",
  );
  if (reset)
    console.log(
      "Todas las sesiones y passkeys anteriores quedaron revocadas. Volvé a registrar tu dispositivo.",
    );
} catch (error) {
  await db.query("ROLLBACK");
  throw error;
} finally {
  await db.end();
}
