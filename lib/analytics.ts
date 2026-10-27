import "server-only";
import pg from "pg";
import { business } from "../business.config";
import { rangeForDays } from "./contracts";
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
  }));
}
export async function eventMetrics(days: number, source: "product" | "email") {
  if (!process.env.DATABASE_URL) return null;
  const p = pool(),
    r = rangeForDays(days, new Date(), business.timezone);
  const imported = await p.query(
    "SELECT imported_at FROM stats.imports WHERE source=$1",
    [source],
  );
  if (!imported.rowCount) return null;
  const params = [
    new Date(r.start * 1000).toISOString(),
    new Date(r.end * 1000).toISOString(),
  ];
  if (source === "product") {
    const { rows } = await p.query(
      `SELECT COUNT(DISTINCT subject_id) FILTER (WHERE kind='product.activated') AS active, COUNT(*) FILTER (WHERE kind='product.activated') AS actions, COUNT(*) FILTER (WHERE kind='product.failed') AS failed FROM stats.events WHERE occurred_at >= $1 AND occurred_at < $2`,
      params,
    );
    return {
      active: Number(rows[0].active),
      actions: Number(rows[0].actions),
      failed: Number(rows[0].failed),
      delivered: 0,
      clicked: 0,
      at: imported.rows[0].imported_at.toISOString(),
    };
  }
  const { rows } = await p.query(
    `WITH delivered AS (SELECT subject_id,MIN(occurred_at) AS at FROM stats.events WHERE kind='email.delivered' GROUP BY subject_id), cohort AS (SELECT * FROM delivered WHERE at >= $1 AND at < $2) SELECT count(*) AS delivered, count(*) FILTER (WHERE EXISTS (SELECT 1 FROM stats.events c WHERE c.kind='email.clicked' AND c.subject_id=cohort.subject_id AND c.occurred_at>=cohort.at AND c.occurred_at<$2)) AS clicked FROM cohort`,
    params,
  );
  return {
    active: 0,
    actions: 0,
    failed: 0,
    delivered: Number(rows[0].delivered),
    clicked: Number(rows[0].clicked),
    at: imported.rows[0].imported_at.toISOString(),
  };
}
