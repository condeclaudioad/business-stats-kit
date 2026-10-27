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
export function validateImport(value: unknown): {
  source: "product" | "email";
  events: Event[];
} {
  if (!value || typeof value !== "object")
    throw new Error("Esperaba un objeto");
  const input = value as Record<string, unknown>;
  if (input.source !== "product" && input.source !== "email")
    throw new Error("source debe ser product o email");
  if (!Array.isArray(input.events) || input.events.length > 10000)
    throw new Error("Máximo 10.000 eventos por importación");
  const ids = new Set<string>();
  const allowed =
    input.source === "product"
      ? ["product.activated", "product.failed"]
      : ["email.delivered", "email.clicked"];
  for (const e of input.events) {
    if (!e || typeof e !== "object" || !allowed.includes(e.kind))
      throw new Error("Evento incompatible con source");
    for (const field of ["id", "subject_id"])
      if (
        typeof e[field] !== "string" ||
        e[field].length < 1 ||
        e[field].length > 200
      )
        throw new Error(`${field} inválido`);
    if (
      !/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(e.occurred_at) ||
      !Number.isFinite(Date.parse(e.occurred_at))
    )
      throw new Error("occurred_at requiere ISO con zona");
    if (ids.has(e.id)) throw new Error("ID duplicado dentro del archivo");
    ids.add(e.id);
    if (
      Object.keys(e).some(
        (k) => !["id", "kind", "subject_id", "occurred_at"].includes(k),
      )
    )
      throw new Error("No importar payloads o datos personales extra");
  }
  return input as { source: "product" | "email"; events: Event[] };
}
