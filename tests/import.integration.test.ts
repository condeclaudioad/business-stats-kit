import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import pg from "pg";
import { storeEvents } from "../lib/import-store";
const url = process.env.TEST_DATABASE_URL;
test(
  "Postgres imports: exact replay is idempotent; conflicting ID rolls back whole batch and freshness",
  { skip: !url },
  async () => {
    if (!new URL(url!).pathname.endsWith("_import_test"))
      throw new Error(
        "TEST_DATABASE_URL debe apuntar a una base dedicada terminada en _import_test",
      );
    const client = new pg.Client({ connectionString: url });
    await client.connect();
    const id = `integration:${randomUUID()}`,
      other = `integration:${randomUUID()}`;
    try {
      await client.query(
        await readFile(new URL("../db/analytics.sql", import.meta.url), "utf8"),
      );
      const event = {
        id,
        kind: "product.activated" as const,
        subject_id: "synthetic-user",
        occurred_at: "2026-10-01T12:00:00Z",
      };
      await storeEvents(url!, { source: "product", events: [event] });
      await storeEvents(url!, { source: "product", events: [event] });
      assert.equal(
        (
          await client.query(
            "SELECT count(*)::int AS n FROM stats.events WHERE id=$1",
            [id],
          )
        ).rows[0].n,
        1,
      );
      const before = (
        await client.query(
          "SELECT imported_at::text AS t FROM stats.imports WHERE source='product'",
        )
      ).rows[0].t;
      await assert.rejects(() =>
        storeEvents(url!, {
          source: "product",
          events: [
            { ...event, id: other },
            { ...event, subject_id: "different-user" },
          ],
        }),
      );
      assert.equal(
        (
          await client.query(
            "SELECT count(*)::int AS n FROM stats.events WHERE id=$1",
            [other],
          )
        ).rows[0].n,
        0,
      );
      assert.equal(
        (
          await client.query(
            "SELECT subject_id FROM stats.events WHERE id=$1",
            [id],
          )
        ).rows[0].subject_id,
        "synthetic-user",
      );
      assert.equal(
        (
          await client.query(
            "SELECT imported_at::text AS t FROM stats.imports WHERE source='product'",
          )
        ).rows[0].t,
        before,
      );
    } finally {
      await client.query("DELETE FROM stats.events WHERE id=ANY($1::text[])", [
        [id, other],
      ]);
      await client.end();
    }
  },
);
