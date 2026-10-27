export type CoverageInterval = { from: string; to: string };
export type Coverage = {
  complete: boolean;
  stale: boolean;
  asOf: string | null;
  from: string | null;
  to: string | null;
  reason: string;
};
/** Completeness concerns the declared event stream, not proof that instrumentation captures every real action. */
export function assessCoverage(
  intervals: CoverageInterval[],
  requestedFrom: string,
  requestedTo: string,
  now = new Date(),
): Coverage {
  const start = Date.parse(requestedFrom),
    end = Math.min(Date.parse(requestedTo), now.getTime());
  const merged: [number, number][] = [];
  for (const interval of intervals
    .map(
      (i) =>
        [Date.parse(i.from), Math.min(Date.parse(i.to), now.getTime())] as [
          number,
          number,
        ],
    )
    .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && a < b)
    .sort((a, b) => a[0] - b[0])) {
    const last = merged.at(-1);
    if (last && interval[0] <= last[1])
      last[1] = Math.max(last[1], interval[1]);
    else merged.push([...interval]);
  }
  const relevant = merged.filter(([a, b]) => a < end && b > start);
  if (!relevant.length)
    return {
      complete: false,
      stale: false,
      asOf: null,
      from: null,
      to: null,
      reason:
        "Sin cobertura declarada para este período. Importá una ventana completa; los registros anteriores no acreditan cobertura.",
    };
  const latest = relevant.at(-1)!;
  const asOf = Math.min(end, latest[1]);
  const complete = relevant.some(([a, b]) => a <= start && b >= asOf);
  const stale = now.getTime() - asOf > 24 * 60 * 60 * 1000;
  return {
    complete,
    stale,
    asOf: new Date(asOf).toISOString(),
    from: new Date(relevant[0][0]).toISOString(),
    to: new Date(latest[1]).toISOString(),
    reason: !complete
      ? "Cobertura parcial: falta el inicio del período o hay huecos entre cargas. No se muestran totales del período."
      : stale
        ? "Cobertura continua hasta el corte indicado, pero el corte tiene más de 24 horas. Sincronizá para actualizar."
        : "Cobertura declarada continua desde el inicio del período hasta el corte indicado; no equivale a datos en vivo.",
  };
}
