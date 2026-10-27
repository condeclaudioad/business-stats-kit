-- Run on your OWN PostgreSQL database, with the same server role as DATABASE_URL.
-- Dedicated schema is not exposed through the public Data API.
CREATE SCHEMA IF NOT EXISTS stats;
REVOKE ALL ON SCHEMA stats FROM PUBLIC;
CREATE TABLE IF NOT EXISTS stats.events (
  id text PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('product.activated','product.failed','email.delivered','email.clicked')),
  subject_id text NOT NULL,
  occurred_at timestamptz NOT NULL,
  CHECK (length(id) BETWEEN 1 AND 200),
  CHECK (length(subject_id) BETWEEN 1 AND 200)
);
CREATE INDEX IF NOT EXISTS events_kind_at ON stats.events(kind,occurred_at);
CREATE TABLE IF NOT EXISTS stats.imports (
  source text PRIMARY KEY CHECK (source IN ('product','email')),
  imported_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON ALL TABLES IN SCHEMA stats FROM PUBLIC;
