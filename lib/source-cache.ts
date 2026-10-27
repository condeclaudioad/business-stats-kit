/** Bounded, process-local cache. No stale fallback after failure; promises coalesce callers. */
export function createSourceCache(ttlMs = 60_000, failureMs = 5_000, now = Date.now) {
  const entries = new Map<string, { expires: number; pending: boolean; promise: Promise<{ value: unknown; readAt: string }> }>();
  return async function read<T>(key: string, loader: () => Promise<T>): Promise<{ value: T; readAt: string }> {
    const existing = entries.get(key);
    if (existing && (existing.pending || existing.expires > now())) return existing.promise as Promise<{ value: T; readAt: string }>;
    if (entries.size >= 128) {
      for (const [k, v] of entries) { if (!v.pending) entries.delete(k); if (entries.size < 96) break; }
      if (entries.size >= 128) throw new Error('Demasiadas consultas concurrentes. Esperá y volvé a intentar.');
    }
    const entry = { expires: 0, pending: true, promise: null as unknown as Promise<{value:T;readAt:string}> };
    entry.promise = Promise.resolve().then(loader).then(value => {
      entry.pending = false; entry.expires = now() + ttlMs;
      return { value, readAt: new Date(now()).toISOString() };
    }, error => { entry.pending = false; entry.expires = now() + failureMs; throw error; });
    entries.set(key, entry);
    return entry.promise;
  };
}
