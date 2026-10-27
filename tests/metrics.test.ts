import test from "node:test";
import assert from "node:assert/strict";
import {
  scopedProducts,
  assertCurrency,
  assertSupportedCurrency,
  rangeForDays,
  ratio,
  daysInRange,
} from "../lib/contracts";
import { validateImport } from "../lib/import-validation";
import { demoDashboard } from "../lib/demo";
test("shared account: rejects mixed, unknown and empty products instead of inferring from amounts", () => {
  assert.equal(scopedProducts(["own"], ["own"]), true);
  assert.equal(scopedProducts(["own", "other"], ["own"]), false);
  assert.equal(scopedProducts([], ["own"]), false);
  assert.equal(scopedProducts([""], ["own"]), false);
});
test("currency mismatch and unsupported exponent fail closed", () => {
  assert.doesNotThrow(() => assertCurrency("usd", "USD"));
  assert.throws(() => assertCurrency("EUR", "USD"));
  assert.throws(() => assertSupportedCurrency("JPY"));
  assert.throws(() => assertSupportedCurrency("CLP"));
});
test("local date boundaries preserve DST days and Argentina midnight", () => {
  const art = rangeForDays(
    7,
    new Date("2026-10-27T02:00:00Z"),
    "America/Argentina/Buenos_Aires",
  );
  assert.equal(art.to, "2026-10-27");
  assert.equal(
    new Date(art.end * 1000).toISOString(),
    "2026-10-27T03:00:00.000Z",
  );
  const ny = rangeForDays(
    7,
    new Date("2026-03-10T12:00:00Z"),
    "America/New_York",
  );
  assert.equal(ny.end - ny.start, 7 * 86400 - 3600);
  assert.equal(daysInRange(ny.from, 7).length, 7);
  assert.throws(() => rangeForDays(8));
});
test("missing denominator is unavailable, never fabricated zero", () => {
  assert.equal(ratio(0, 0), null);
  assert.equal(ratio(3, 10), 30);
});
const event = {
  id: "evt-1",
  kind: "product.activated",
  subject_id: "pseudonymous-1",
  occurred_at: "2026-10-27T12:00:00Z",
};
test("imports reject wrong source, unknown personal fields, duplicate IDs and missing timezone", () => {
  assert.equal(
    validateImport({ source: "product", events: [event] }).events.length,
    1,
  );
  assert.throws(() => validateImport({ source: "email", events: [event] }));
  assert.throws(() =>
    validateImport({
      source: "product",
      events: [{ ...event, email: "private@example.invalid" }],
    }),
  );
  assert.throws(() =>
    validateImport({ source: "product", events: [event, event] }),
  );
  assert.throws(() =>
    validateImport({
      source: "product",
      events: [{ ...event, occurred_at: "2026-10-27T12:00:00" }],
    }),
  );
});
test("demo is explicit synthetic dataset and selectable windows reconcile chart totals", () => {
  for (const days of [7, 30, 90]) {
    const data = demoDashboard(days);
    assert.equal(data.demo, true);
    assert.equal(data.series.length, days);
    assert.equal(
      data.sales[0].value,
      data.series.reduce((sum, p) => sum + p.revenue, 0),
    );
  }
});
