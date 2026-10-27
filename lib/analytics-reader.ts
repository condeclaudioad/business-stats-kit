import type { PoolClient } from "pg";
import { assessCoverage } from "./coverage";

/** Caller owns a repeatable-read transaction so metadata and counts share one snapshot. */
export async function readEventMetrics(db: Pick<PoolClient,"query">, source: "product" | "email", from: string, to: string, now = new Date()) {
  const imported = await db.query(
    "SELECT imported_at FROM stats.imports WHERE source=$1",
    [source],
  );
  if (!imported.rowCount) return null;
  const intervals = await db.query(
    "SELECT covered_from,covered_to FROM stats.coverage_intervals WHERE source=$1 ORDER BY covered_from",
    [source],
  );
  const coverage = assessCoverage(
    intervals.rows.map((row) => ({
      from: row.covered_from.toISOString(),
      to: row.covered_to.toISOString(),
    })),
    from,
    to,
    now,
  );
  if (!coverage.complete || !coverage.asOf)
    return {
      active: 0,
      actions: 0,
      failed: 0,
      delivered: 0,
      clicked: 0,
      at: imported.rows[0].imported_at.toISOString(),
      coverage,
    };
  const params = [from, coverage.asOf];
  if (source === "product") {
    const { rows } = await db.query(
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
      coverage,
    };
  }
  const { rows } = await db.query(
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
    coverage,
  };
}
