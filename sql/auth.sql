-- Private schema: never expose through a public REST API. Run with the app DB role.
CREATE SCHEMA IF NOT EXISTS stats_auth;
REVOKE ALL ON SCHEMA stats_auth FROM PUBLIC;
CREATE TABLE IF NOT EXISTS stats_auth.owner (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  username text NOT NULL, password_hash text NOT NULL, version uuid NOT NULL,
  bootstrap_hash text, bootstrap_expires timestamptz
);
CREATE TABLE IF NOT EXISTS stats_auth.passkeys (
  id text PRIMARY KEY, public_key text NOT NULL, counter bigint NOT NULL,
  transports jsonb NOT NULL DEFAULT '[]', owner_version uuid NOT NULL
);
CREATE TABLE IF NOT EXISTS stats_auth.flows (
  token_hash text PRIMARY KEY, owner_version uuid NOT NULL,
  kind text NOT NULL CHECK(kind IN ('register','authenticate')),
  challenge text, expires timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS stats_auth.sessions (
  token_hash text PRIMARY KEY, owner_version uuid NOT NULL, expires timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS stats_auth.rate_limits (
  bucket bigint PRIMARY KEY, attempts integer NOT NULL
);
REVOKE ALL ON ALL TABLES IN SCHEMA stats_auth FROM PUBLIC;
-- Hosted Postgres installations may have default grants to API roles.
DO $$
DECLARE role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon','authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname=role_name) THEN
      EXECUTE format('REVOKE ALL ON SCHEMA stats_auth FROM %I', role_name);
      EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA stats_auth FROM %I', role_name);
    END IF;
  END LOOP;
END $$;
