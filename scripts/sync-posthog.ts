/** Read-only PostHog query -> own Postgres. No remote events are created. */
import { createHmac } from "node:crypto";
import { storeEvents } from "../lib/import-store";
import { validateImport, type Event } from "../lib/import-validation";
async function main() {
  const {
    POSTHOG_HOST: host,
    POSTHOG_PROJECT_ID: project,
    POSTHOG_PERSONAL_KEY: key,
    POSTHOG_PSEUDONYM_SECRET: secret,
    DATABASE_URL: db,
  } = process.env;
  if (
    !host ||
    !["https://us.posthog.com", "https://eu.posthog.com"].includes(host) ||
    !project ||
    !/^\d+$/.test(project) ||
    !key ||
    !secret ||
    secret.length < 32 ||
    !db
  )
    throw new Error("Configuración incompleta");
  const days = Number(process.argv[2] ?? 7);
  if (!Number.isInteger(days) || days < 1 || days > 90)
    throw new Error("Rango inválido (1–90 días)");
  const until = new Date(),
    since = new Date(until.getTime() - days * 86400000);
  const start = Math.floor(since.getTime() / 1000),
    end = Math.floor(until.getTime() / 1000);
  const events: Event[] = [];
  let complete = false;
  for (let page = 0; page < 10; page++) {
    const query = `SELECT uuid, event, distinct_id, timestamp FROM events WHERE event IN ('product.activated','product.failed') AND timestamp >= toDateTime(${start}) AND timestamp < toDateTime(${end}) ORDER BY timestamp, uuid LIMIT 5000 OFFSET ${page * 5000}`;
    const response = await fetch(`${host}/api/projects/${project}/query/`, {
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
      !Array.isArray(body.results)
    )
      throw new Error("Consulta incompleta");
    if (body.hasMore === true && body.results.length < 5000)
      throw new Error("Respuesta truncada por proveedor");
    for (const row of body.results) {
      if (
        !Array.isArray(row) ||
        row.length !== 4 ||
        !["product.activated", "product.failed"].includes(row[1]) ||
        typeof row[0] !== "string" ||
        typeof row[2] !== "string"
      )
        throw new Error("Evento inválido");
      const raw = String(row[3]);
      const date = new Date(/(?:Z|[+-]\d\d:\d\d)$/.test(raw) ? raw : raw + "Z");
      if (!Number.isFinite(date.getTime())) throw new Error("Fecha inválida");
      events.push({
        id: `posthog:${row[0]}`,
        kind: row[1],
        subject_id: createHmac("sha256", secret).update(row[2]).digest("hex"),
        occurred_at: date.toISOString(),
      });
    }
    if (body.results.length < 5000) {
      complete = true;
      break;
    }
  }
  if (!complete)
    throw new Error(
      "Más de 50.000 eventos: reducí ventana, no se guarda parcial",
    );
  // Validate in bounded batches; commit all data in one transaction after complete read.
  for (let i = 0; i < events.length; i += 10000)
    validateImport({ source: "product", events: events.slice(i, i + 10000) });
  await storeEvents(db, { source: "product", events });
  console.log(
    `PostHog: ${events.length} eventos procesados, ${days} días. IDs existentes preservados.`,
  );
}
main().catch(() => {
  console.error(
    "Sincronización rechazada: revisá variables, permisos, eventos canónicos y ventana. No se guardó un resultado parcial.",
  );
  process.exitCode = 1;
});
