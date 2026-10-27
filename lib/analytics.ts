import "server-only";
import pg from "pg";
import { business } from "../business.config";
import { rangeForDays } from "./contracts";
import { readEventMetrics } from "./analytics-reader";
const globalPool = globalThis as typeof globalThis & {
  analyticsPool?: pg.Pool;
};
function pool() {
  if (!process.env.DATABASE_URL) throw new Error("Base sin configurar");
  return (globalPool.analyticsPool ??= new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    connectionTimeoutMillis: 10000,
    query_timeout: 15000,
    statement_timeout: 15000,
    idle_in_transaction_session_timeout: 20000,
  }));
}
export async function eventMetrics(days: number, source: "product" | "email") {
  if (!process.env.DATABASE_URL) return null;
  const p = pool(),
    r = rangeForDays(days, new Date(), business.timezone);
  const db = await p.connect();
  try {
    await db.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
    const result = await readEventMetrics(db, source,
      new Date(r.start * 1000).toISOString(), new Date(r.end * 1000).toISOString());
    await db.query("COMMIT");
    return result;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  } finally {
    db.release();
  }
}
