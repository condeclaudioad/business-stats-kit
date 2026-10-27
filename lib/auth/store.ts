import { Pool, type PoolClient } from "pg";
import { hashToken } from "./crypto";
const globalDb = globalThis as unknown as { statsAuthPool?: Pool };
export function pool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
  return (globalDb.statsAuthPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 4,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    query_timeout: 10000,
    statement_timeout: 10000,
  }));
}
export async function transaction<T>(
  work: (db: PoolClient) => Promise<T>,
): Promise<T> {
  const db = await pool().connect();
  try {
    await db.query("BEGIN");
    const result = await work(db);
    await db.query("COMMIT");
    return result;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  } finally {
    db.release();
  }
}
export async function validSession(
  token: string | undefined,
): Promise<boolean> {
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const { rows } = await pool().query(
    "SELECT 1 FROM stats_auth.sessions s JOIN stats_auth.owner o ON o.version=s.owner_version WHERE token_hash=$1 AND expires>now()",
    [hashToken(token)],
  );
  return rows.length === 1;
}
// One owner: global atomic limit cannot be evaded with spoofed proxy headers.
// Trade-off: an attacker can temporarily deny login; upstream throttling is also recommended.
export async function reserveAttempt(): Promise<boolean> {
  const { rows } = await pool()
    .query(`INSERT INTO stats_auth.rate_limits(bucket,attempts) VALUES(floor(extract(epoch FROM now())/900)::bigint,1)
  ON CONFLICT(bucket) DO UPDATE SET attempts=stats_auth.rate_limits.attempts+1 RETURNING attempts`);
  await pool().query(
    "DELETE FROM stats_auth.rate_limits WHERE bucket < floor(extract(epoch FROM now())/900)::bigint-2",
  );
  return rows[0].attempts <= 20;
}
