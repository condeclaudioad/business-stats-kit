import test from "node:test";
import assert from "node:assert/strict";
import { assessCoverage } from "../lib/coverage";
import { validateImport } from "../lib/import-validation";
const now = new Date("2026-10-27T16:00:00Z");
const from = "2026-10-01T00:00:00Z",
  to = "2026-10-28T00:00:00Z";
test("seven days of data cannot claim a complete month or unknown legacy coverage", () => {
  assert.equal(
    assessCoverage(
      [{ from: "2026-10-20T00:00:00Z", to: now.toISOString() }],
      from,
      to,
      now,
    ).complete,
    false,
  );
  const legacy = assessCoverage([], from, to, now);
  assert.equal(legacy.complete, false);
  assert.equal(legacy.asOf, null);
});
test("overlap, exact repetition and contiguous windows merge, but gaps remain incomplete", () => {
  const intervals = [
    { from, to: "2026-10-10T00:00:00Z" },
    { from: "2026-10-10T00:00:00Z", to: "2026-10-20T00:00:00Z" },
    { from: "2026-10-19T00:00:00Z", to: now.toISOString() },
  ];
  const full = assessCoverage([...intervals, intervals[0]], from, to, now);
  assert.equal(full.complete, true);
  assert.equal(full.asOf, now.toISOString());
  assert.equal(full.stale, false);
  const gap = assessCoverage([intervals[0], intervals[2]], from, to, now);
  assert.equal(gap.complete, false);
});
test("historic cutoff remains explicit, stale does not masquerade as fresh and future is capped", () => {
  const old = assessCoverage(
    [{ from, to: "2026-10-25T00:00:00Z" }],
    from,
    to,
    now,
  );
  assert.equal(old.complete, true);
  assert.equal(old.stale, true);
  assert.equal(old.asOf, "2026-10-25T00:00:00.000Z");
  const future = assessCoverage(
    [{ from, to: "2026-12-01T00:00:00Z" }],
    from,
    to,
    now,
  );
  assert.equal(future.asOf, now.toISOString());
});
test("empty complete exports are valid zero; missing coverage, future, impossible dates and outside events reject", () => {
  const data = {
    source: "product",
    coverage: { from, to: now.toISOString() },
    events: [],
  };
  assert.equal(validateImport(data, { now }).events.length, 0);
  assert.throws(() =>
    validateImport({ source: "product", events: [] }, { now }),
  );
  assert.throws(() =>
    validateImport({ ...data, coverage: { from, to } }, { now }),
  );
  assert.throws(() =>
    validateImport(
      {
        ...data,
        coverage: { from: "2026-02-30T00:00:00Z", to: now.toISOString() },
      },
      { now },
    ),
  );
  const event = {
    id: "test",
    kind: "product.activated",
    subject_id: "test",
    occurred_at: "2026-09-30T00:00:00Z",
  };
  assert.throws(() => validateImport({ ...data, events: [event] }, { now }));
  assert.throws(() =>
    validateImport(
      { ...data, events: [{ ...event, occurred_at: now.toISOString() }] },
      { now },
    ),
  );
});
