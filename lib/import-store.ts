import pg from "pg";
import type { Event } from "./import-validation";
export async function storeEvents(
  connectionString: string,
  data: { source: "product" | "email"; events: Event[] },
) {
  const client = new pg.Client({
    connectionString,
    connectionTimeoutMillis: 10000,
    query_timeout: 15000,
  });
  await client.connect();
  try {
    await client.query("BEGIN");
    for (const e of data.events) {
      const result = await client.query(
        `INSERT INTO stats.events (id,kind,subject_id,occurred_at) VALUES ($1,$2,$3,$4)
        ON CONFLICT (id) DO UPDATE SET id=EXCLUDED.id
        WHERE stats.events.kind=EXCLUDED.kind AND stats.events.subject_id=EXCLUDED.subject_id AND stats.events.occurred_at=EXCLUDED.occurred_at
        RETURNING id`,
        [e.id, e.kind, e.subject_id, e.occurred_at],
      );
      if (result.rowCount !== 1)
        throw new Error(
          "ID existente con contenido distinto. Usá IDs estables con namespace y revisá el origen.",
        );
    }
    await client.query(
      "INSERT INTO stats.imports(source) VALUES ($1) ON CONFLICT (source) DO UPDATE SET imported_at=now()",
      [data.source],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}
