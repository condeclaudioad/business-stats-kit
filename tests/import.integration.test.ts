import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import pg from "pg";
import { storeEvents } from "../lib/import-store";
import { assessCoverage } from "../lib/coverage";
import { readEventMetrics } from "../lib/analytics-reader";
const url = process.env.TEST_DATABASE_URL;
test(
  "Postgres imports: legacy migration, coverage union, zero exports and collision rollback",
  { skip: !url },
  async () => {
    if (!new URL(url!).pathname.endsWith("_import_test"))
      throw new Error(
        "TEST_DATABASE_URL must end in _import_test; disposable database only",
      );
    const client = new pg.Client({ connectionString: url });
    await client.connect();
    const now = new Date("2026-10-27T16:00:00Z"),
      from = "2020-01-01T00:00:00Z",
      to = "2020-02-01T00:00:00Z";
    const coverage = { from, to: "2020-01-08T00:00:00Z" };
    async function readCoverage() {
      const r = await client.query(
        "SELECT covered_from,covered_to FROM stats.coverage_intervals WHERE source='product'",
      );
      return assessCoverage(
        r.rows.map((i) => ({
          from: i.covered_from.toISOString(),
          to: i.covered_to.toISOString(),
        })),
        from,
        to,
        now,
      );
    }
    try {
      await client.query("DROP SCHEMA IF EXISTS stats CASCADE");
      await client.query(
        "CREATE SCHEMA stats; CREATE TABLE stats.imports(source text PRIMARY KEY,imported_at timestamptz NOT NULL DEFAULT now()); INSERT INTO stats.imports(source) VALUES('product')",
      );
      await client.query(
        await readFile(new URL("../db/analytics.sql", import.meta.url), "utf8"),
      );
      assert.equal(
        (await readCoverage()).complete,
        false,
        "legacy import is not assumed complete",
      );
      const event = {
        id: "integration:evt",
        kind: "product.activated" as const,
        subject_id: "synthetic-user",
        occurred_at: "2020-01-02T12:00:00Z",
      };
      await storeEvents(url!, { source: "product", coverage, events: [event] });
      await storeEvents(url!, { source: "product", coverage, events: [event] });
      assert.equal(
        (await client.query("SELECT count(*)::int n FROM stats.events")).rows[0]
          .n,
        1,
      );
      assert.equal(
        (
          await client.query(
            "SELECT count(*)::int n FROM stats.coverage_intervals",
          )
        ).rows[0].n,
        1,
      );
      const before = (
        await client.query(
          "SELECT imported_at::text t FROM stats.imports WHERE source='product'",
        )
      ).rows[0].t;
      await assert.rejects(() =>
        storeEvents(url!, {
          source: "product",
          coverage: { from, to },
          events: [
            { ...event, id: "integration:other" },
            { ...event, subject_id: "different" },
          ],
        }),
      );
      assert.equal(
        (await client.query("SELECT count(*)::int n FROM stats.events")).rows[0]
          .n,
        1,
      );
      assert.equal(
        (
          await client.query(
            "SELECT imported_at::text t FROM stats.imports WHERE source='product'",
          )
        ).rows[0].t,
        before,
      );
      assert.equal(
        (
          await client.query(
            "SELECT count(*)::int n FROM stats.coverage_intervals",
          )
        ).rows[0].n,
        1,
        "rollback includes coverage",
      );
      await storeEvents(url!, {
        source: "product",
        coverage: { from: "2020-01-20T00:00:00Z", to },
        events: [],
      });
      assert.equal(
        (await readCoverage()).complete,
        false,
        "gap cannot be hidden by latest successful empty import",
      );
      await storeEvents(url!, {
        source: "product",
        coverage: { from: coverage.to, to: "2020-01-20T00:00:00Z" },
        events: [],
      });
      assert.equal(
        (await readCoverage()).complete,
        true,
        "contiguous verified empty windows fill gap",
      );
      assert.equal((await readCoverage()).stale, true);
      assert.equal((await readCoverage()).asOf, "2020-02-01T00:00:00.000Z");
      // A concurrent importer must not move the coverage/counts ahead of the metadata read.
      await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
      await client.query("SELECT imported_at FROM stats.imports WHERE source='product'");
      await storeEvents(url!, { source: "product", coverage: {from,to}, events: [
        {...event,id:"integration:late",subject_id:"second-synthetic-user"}
      ] });
      const snapshot = await readEventMetrics(client,"product",from,to,now);
      assert.equal(snapshot?.actions,1,"ongoing read keeps the original event snapshot");
      await client.query("COMMIT");
      assert.equal((await readEventMetrics(client,"product",from,to,now))?.actions,2);

      // Email counts unique message cohorts, not raw deliveries/clicks or unmatched clicks.
      const mail = (id:string,kind:"email.delivered"|"email.clicked",subject_id:string,occurred_at:string)=>({id,kind,subject_id,occurred_at});
      await storeEvents(url!,{source:"email",coverage:{from:"2019-12-01T00:00:00Z",to},events:[
        mail("mail:old","email.delivered","old-message","2019-12-30T00:00:00Z"),
        mail("mail:old-repeat","email.delivered","old-message","2020-01-02T00:00:00Z"),
        mail("mail:old-click","email.clicked","old-message","2020-01-03T00:00:00Z"),
        mail("mail:new","email.delivered","new-message","2020-01-02T00:00:00Z"),
        mail("mail:new-repeat","email.delivered","new-message","2020-01-03T00:00:00Z"),
        mail("mail:new-click","email.clicked","new-message","2020-01-04T00:00:00Z"),
        mail("mail:new-click-again","email.clicked","new-message","2020-01-05T00:00:00Z"),
        mail("mail:other","email.delivered","other-message","2020-01-03T00:00:00Z"),
        mail("mail:premature","email.clicked","other-message","2020-01-02T00:00:00Z"),
        mail("mail:orphan","email.clicked","unknown-message","2020-01-02T00:00:00Z")
      ]});
      const email = await readEventMetrics(client,"email",from,to,now);
      assert.equal(email?.delivered,2);
      assert.equal(email?.clicked,1);

    } finally {
      await client.query("DROP SCHEMA IF EXISTS stats CASCADE");
      await client.end();
    }
  },
);
