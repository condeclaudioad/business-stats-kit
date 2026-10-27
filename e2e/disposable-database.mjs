/** Reject libpq URL overrides before any destructive fixture setup. */
export function validateDisposableDatabase(value) {
  const u = new URL(value);
  if (!['postgres:', 'postgresql:'].includes(u.protocol) ||
      !['localhost', '127.0.0.1'].includes(u.hostname) ||
      u.search || u.hash || !/^\/[a-zA-Z0-9_]+_e2e_test$/.test(u.pathname)) {
    throw new Error('E2E requires a local Postgres URL without query overrides and a disposable database ending _e2e_test');
  }
  return value;
}
