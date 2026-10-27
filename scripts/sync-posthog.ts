/** Read-only PostHog query -> own Postgres. No remote events are created. */
import { createHmac } from "node:crypto";
import { pathToFileURL } from "node:url";
import { storeEvents } from "../lib/import-store";
import { validateImport, type Event } from "../lib/import-validation";
type QueryConfig = {
  host: string;
  project: string;
  key: string;
  secret: string;
  start: number;
  end: number;
};
export async function readPostHogWindow(
  config: QueryConfig,
  request: typeof fetch = fetch,
) {
  const { host, project, key, secret, start, end } = config;
  if (
    !["https://us.posthog.com", "https://eu.posthog.com"].includes(host) ||
    !/^\d+$/.test(project) ||
    !key ||
    secret.length < 32 ||
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start >= end ||
    end > Date.now() / 1000
  )
    throw new Error("Configuración incompleta");
  const coverage = {
    from: new Date(start * 1000).toISOString(),
    to: new Date(end * 1000).toISOString(),
  };
  const events = new Map<string, Event>();
  let complete = false,
    after = "";
  // Last one-row probe distinguishes exactly 50,000 from an unknown truncated result.
  for (let page = 0; page <= 10; page++) {
    const limit = page === 10 ? 1 : 5000;
    const query = `SELECT uuid, event, distinct_id, timestamp FROM events WHERE event IN ('product.activated','product.failed') AND timestamp >= toDateTime(${start}) AND timestamp < toDateTime(${end}) ${after ? `AND toString(uuid) > '${after}'` : ""} ORDER BY toString(uuid) LIMIT ${limit}`;
    const response = await request(`${host}/api/projects/${project}/query/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { kind: "HogQLQuery", query },
        refresh: "force_blocking",
      }),
      signal: AbortSignal.timeout(60000),
    });
    if (!response.ok) throw new Error("PostHog rechazó la consulta");
    const body = await response.json();
    if (
      body.error ||
      body.query_status?.error ||
      body.query_status?.complete === false ||
      body.query_status?.executing === true ||
      !Array.isArray(body.results) ||
      body.results.length > limit
    )
      throw new Error("Consulta incompleta");
    if (body.hasMore === true && body.results.length < limit)
      throw new Error("Respuesta truncada por proveedor");
    if (page === 10 && body.results.length)
      throw new Error(
        "Más de 50.000 eventos: reducí ventana, no se guarda parcial",
      );
    let previous = after;
    for (const row of body.results) {
      if (
        !Array.isArray(row) ||
        row.length !== 4 ||
        !["product.activated", "product.failed"].includes(row[1]) ||
        typeof row[0] !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          row[0],
        ) ||
        typeof row[2] !== "string"
      )
        throw new Error("Evento inválido");
      const uuid = row[0].toLowerCase();
      if (uuid < previous || (after && uuid <= after))
        throw new Error("Paginación fuera de orden");
      previous = uuid;
      const raw = String(row[3]);
      const date = new Date(/(?:Z|[+-]\d\d:\d\d)$/.test(raw) ? raw : raw + "Z");
      if (!Number.isFinite(date.getTime())) throw new Error("Fecha inválida");
      const event: Event = {
        id: `posthog:${uuid}`,
        kind: row[1],
        subject_id: createHmac("sha256", secret).update(row[2]).digest("hex"),
        occurred_at: date.toISOString(),
      };
      const old = events.get(event.id);
      if (old && JSON.stringify(old) !== JSON.stringify(event))
        throw new Error("UUID duplicado con payload diferente");
      events.set(event.id, event);
    }
    if (body.results.length) after = previous;
    if (body.results.length < limit) {
      complete = true;
      break;
    }
  }
  if (!complete)
    throw new Error("No se pudo verificar el final de la paginación");
  return validateImport(
    { source: "product", coverage, events: [...events.values()] },
    { maxEvents: 50000 },
  );
}
async function main() {
  const {
    POSTHOG_HOST: host,
    POSTHOG_PROJECT_ID: project,
    POSTHOG_PERSONAL_KEY: key,
    POSTHOG_PSEUDONYM_SECRET: secret,
    DATABASE_URL: db,
  } = process.env;
  if (!host || !project || !key || !secret || !db)
    throw new Error("Configuración incompleta");
  const days = Number(process.argv[2] ?? 7);
  if (!Number.isInteger(days) || days < 1 || days > 90)
    throw new Error("Rango inválido (1–90 días)");
  const end = Math.floor(Date.now() / 1000),
    start = end - days * 86400;
  const data = await readPostHogWindow({
    host,
    project,
    key,
    secret,
    start,
    end,
  });
  await storeEvents(db, data);
  console.log(
    `PostHog: ${data.events.length} eventos procesados, ${days} días. Cobertura hasta ${data.coverage.to}. IDs existentes preservados.`,
  );
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch(() => {
    console.error(
      "Sincronización rechazada: revisá variables, permisos, eventos canónicos y ventana. No se guardó un resultado parcial.",
    );
    process.exitCode = 1;
  });
