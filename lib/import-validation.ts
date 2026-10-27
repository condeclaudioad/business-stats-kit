import { DateTime } from "luxon";
import type { CoverageInterval } from "./coverage";
export type Event = {
  id: string;
  kind:
    | "product.activated"
    | "product.failed"
    | "email.delivered"
    | "email.clicked";
  subject_id: string;
  occurred_at: string;
};
export type ImportData = {
  source: "product" | "email";
  coverage: CoverageInterval;
  events: Event[];
};
function timestamp(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(value)
  )
    throw new Error("Fecha ISO con zona requerida");
  const parsed = DateTime.fromISO(value, { setZone: true });
  if (!parsed.isValid) throw new Error("Fecha inválida");
  return parsed.toUTC().toISO()!;
}
export function validateImport(
  value: unknown,
  options: { now?: Date; maxEvents?: number } = {},
): ImportData {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Esperaba un objeto");
  const input = value as Record<string, unknown>;
  if (input.source !== "product" && input.source !== "email")
    throw new Error("source debe ser product o email");
  if (
    Object.keys(input).some(
      (k) => !["source", "coverage", "events"].includes(k),
    )
  )
    throw new Error("Campos de importación desconocidos");
  const coverage = input.coverage as Record<string, unknown> | undefined;
  if (
    !coverage ||
    typeof coverage !== "object" ||
    Array.isArray(coverage) ||
    Object.keys(coverage).some((k) => !["from", "to"].includes(k))
  )
    throw new Error(
      "coverage {from,to} debe declarar la ventana completa exportada",
    );
  const from = timestamp(coverage.from),
    to = timestamp(coverage.to),
    start = Date.parse(from),
    end = Date.parse(to);
  if (start >= end || end > (options.now ?? new Date()).getTime())
    throw new Error("La cobertura debe ser [from,to), ordenada y no futura");
  if (
    !Array.isArray(input.events) ||
    input.events.length > (options.maxEvents ?? 10000)
  )
    throw new Error("Demasiados eventos por importación");
  const ids = new Set<string>();
  const allowed =
    input.source === "product"
      ? ["product.activated", "product.failed"]
      : ["email.delivered", "email.clicked"];
  const events: Event[] = [];
  for (const e of input.events) {
    if (
      !e ||
      typeof e !== "object" ||
      Array.isArray(e) ||
      !allowed.includes(e.kind)
    )
      throw new Error("Evento incompatible con source");
    for (const field of ["id", "subject_id"])
      if (
        typeof e[field] !== "string" ||
        e[field].length < 1 ||
        e[field].length > 200
      )
        throw new Error(`${field} inválido`);
    const occurred_at = timestamp(e.occurred_at),
      at = Date.parse(occurred_at);
    if (at < start || at >= end)
      throw new Error("Evento fuera de la cobertura declarada");
    if (ids.has(e.id)) throw new Error("ID duplicado dentro del archivo");
    ids.add(e.id);
    if (
      Object.keys(e).some(
        (k) => !["id", "kind", "subject_id", "occurred_at"].includes(k),
      )
    )
      throw new Error("No importar payloads o datos personales extra");
    events.push({
      id: e.id,
      kind: e.kind,
      subject_id: e.subject_id,
      occurred_at,
    });
  }
  return { source: input.source, coverage: { from, to }, events };
}
