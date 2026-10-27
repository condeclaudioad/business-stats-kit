import test from "node:test";
import assert from "node:assert/strict";
import { readPostHogWindow } from "../scripts/sync-posthog";
const start = Date.parse("2020-01-01T00:00:00Z") / 1000,
  end = start + 86400;
const config = {
  host: "https://us.posthog.com",
  project: "123",
  key: "synthetic-test",
  secret: "synthetic-test-secret-at-least-32-characters",
  start,
  end,
};
const row = (n: number) => [
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`,
  "product.activated",
  "private-id@example.invalid",
  "2020-01-01T12:00:00Z",
];
const response = (body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
  });
test("PostHog keyset pages retain declared window, hash IDs and use read-only queries", async () => {
  const first = Array.from({ length: 5000 }, (_, i) => row(i + 1));
  let requests = 0;
  const mock: typeof fetch = async (url, init) => {
    assert.equal(url, "https://us.posthog.com/api/projects/123/query/");
    assert.equal(init?.method, "POST");
    const query = JSON.parse(String(init?.body)).query.query;
    assert.doesNotMatch(query, /OFFSET|INSERT|DELETE/);
    if (requests++ === 0) {
      assert.doesNotMatch(query, /AND toString/);
      return response({ results: first });
    }
    assert.match(
      query,
      /AND toString\(uuid\) > '00000000-0000-4000-8000-000000005000'/,
    );
    return response({ results: [row(5001)] });
  };
  const result = await readPostHogWindow(config, mock);
  assert.equal(result.events.length, 5001);
  assert.equal(requests, 2);
  assert.equal(result.coverage.from, new Date(start * 1000).toISOString());
  assert.equal(result.coverage.to, new Date(end * 1000).toISOString());
  assert.match(result.events[0].subject_id, /^[a-f0-9]{64}$/);
  assert.equal(
    JSON.stringify(result).includes("private-id@example.invalid"),
    false,
  );
});
test("PostHog rejects incomplete, truncated, out-of-window or reordered pages", async () => {
  for (const body of [
    { results: [], query_status: { complete: false } },
    { results: [row(1)], hasMore: true },
    { results: [row(2), row(1)] },
    { results: [[...row(1).slice(0, 3), "2020-01-02T00:00:00Z"]] },
    { error: "failure", results: [] },
  ]) {
    await assert.rejects(() =>
      readPostHogWindow(config, async () => response(body)),
    );
  }
});
test("PostHog complete empty export preserves zero coverage and duplicate payload conflicts reject", async () => {
  const empty = await readPostHogWindow(config, async () =>
    response({ results: [] }),
  );
  assert.equal(empty.events.length, 0);
  assert.equal(empty.coverage.to, new Date(end * 1000).toISOString());
  const repeated = await readPostHogWindow(config, async () =>
    response({ results: [row(1), row(1)] }),
  );
  assert.equal(repeated.events.length, 1);
  const different = row(1);
  different[2] = "another-subject";
  await assert.rejects(() =>
    readPostHogWindow(config, async () =>
      response({ results: [row(1), different] }),
    ),
  );
});
