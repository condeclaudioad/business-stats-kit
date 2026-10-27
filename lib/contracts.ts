import { DateTime } from "luxon";
export type SourceState = "ready" | "missing" | "error";
export type Source = {
  name: string;
  state: SourceState;
  updatedAt: string | null;
  detail: string;
};
export type Metric = {
  label: string;
  value: number | null;
  unit: "money" | "number" | "percent";
  definition: string;
};
export type SeriesPoint = { day: string; revenue: number; spend: number };
export type Dashboard = {
  business: string;
  currency: string;
  timezone: string;
  demo: boolean;
  from: string;
  to: string;
  sources: Source[];
  sales: Metric[];
  marketing: Metric[];
  product: Metric[];
  email: Metric[];
  series: SeriesPoint[];
};
export const metric = (
  label: string,
  value: number | null,
  unit: Metric["unit"],
  definition: string,
): Metric => ({ label, value, unit, definition });
export const ratio = (a: number, b: number): number | null =>
  b > 0 ? (a / b) * 100 : null;
export function scopedProducts(ids: string[], allow: string[]): boolean {
  return (
    ids.length > 0 && allow.length > 0 && ids.every((id) => allow.includes(id))
  );
}
export function assertCurrency(actual: string, expected: string) {
  if (actual.toUpperCase() !== expected.toUpperCase())
    throw new Error(
      "Monedas distintas: configurá una única moneda o un adaptador de conversión explícito.",
    );
}
export function rangeForDays(days: number, now = new Date(), timezone = "UTC") {
  if (![7, 30, 90].includes(days)) throw new Error("Período inválido");
  const today = DateTime.fromJSDate(now, { zone: timezone });
  if (!today.isValid) throw new Error("Zona horaria inválida");
  const to = today.startOf("day").plus({ days: 1 }),
    from = to.minus({ days });
  return {
    from: from.toISODate()!,
    to: to.toISODate()!,
    start: from.toSeconds(),
    end: to.toSeconds(),
  };
}
export function dayAt(timestamp: number, timezone: string) {
  return DateTime.fromSeconds(timestamp, { zone: timezone }).toISODate()!;
}
export function daysInRange(from: string, count: number) {
  return Array.from(
    { length: count },
    (_, i) =>
      DateTime.fromISO(from, { zone: "UTC" }).plus({ days: i }).toISODate()!,
  );
}
export function assertSupportedCurrency(currency: string) {
  if (
    ![
      "USD",
      "EUR",
      "ARS",
      "BRL",
      "MXN",
      "COP",
      "PEN",
      "GBP",
      "CAD",
      "AUD",
    ].includes(currency.toUpperCase())
  )
    throw new Error(
      "Moneda no soportada: este starter solo admite las monedas de dos decimales enumeradas en la guía.",
    );
}
