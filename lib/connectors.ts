import "server-only";
import { business } from "../business.config";
import {
  assertCurrency,
  assertSupportedCurrency,
  dayAt,
  scopedProducts,
  rangeForDays,
} from "./contracts";

type Obj = Record<string, any>;
async function getJSON(url: URL, token: string): Promise<Obj> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok)
    throw new Error(
      `El proveedor respondió ${res.status}. Revisá permisos y configuración.`,
    );
  return res.json();
}
async function stripeList(
  path: string,
  params: Record<string, string>,
  token: string,
): Promise<Obj[]> {
  const out: Obj[] = [];
  let after = "";
  for (let page = 0; page < 30; page++) {
    const url = new URL(`https://api.stripe.com/v1/${path}`);
    Object.entries({
      ...params,
      limit: "100",
      ...(after ? { starting_after: after } : {}),
    }).forEach(([k, v]) => url.searchParams.set(k, v));
    const body = await getJSON(url, token);
    if (!Array.isArray(body.data))
      throw new Error("Respuesta de Stripe inválida");
    out.push(...body.data);
    if (!body.has_more) return out;
    if (!body.data.length) throw new Error("Paginación vacía");
    after = body.data.at(-1).id;
  }
  throw new Error(
    "Más de 3.000 registros: ampliá el conector con sincronización incremental. No se muestra un parcial.",
  );
}
const productOf = (line: Obj): string => {
  const p =
    line.pricing?.price_details?.product ??
    line.price?.product ??
    line.plan?.product;
  return typeof p === "string" ? p : (p?.id ?? "");
};
export async function stripeMetrics(days: number) {
  const token = process.env.STRIPE_RESTRICTED_KEY;
  if (!token || !business.stripe.productIds.length) return null;
  assertSupportedCurrency(business.currency);
  const r = rangeForDays(days, new Date(), business.timezone);
  // Paid date may differ from invoice creation date. Do not filter created: old invoices may be paid now.
  const [invoices, subs] = await Promise.all([
    stripeList("invoices", { status: "paid" }, token),
    stripeList("subscriptions", { status: "active" }, token),
  ]);
  let paid = 0,
    count = 0,
    mrr = 0,
    excluded = 0;
  const byDay: Record<string, number> = {};
  for (const invoice of invoices) {
    const at = invoice.status_transitions?.paid_at;
    if (typeof at !== "number" || at < r.start || at >= r.end) continue;
    const lines = invoice.lines?.has_more
      ? await stripeList(
          `invoices/${encodeURIComponent(invoice.id)}/lines`,
          {},
          token,
        )
      : invoice.lines?.data;
    if (!Array.isArray(lines)) throw new Error("Factura sin líneas legibles");
    if (!scopedProducts(lines.map(productOf), business.stripe.productIds)) {
      excluded++;
      continue;
    }
    assertCurrency(invoice.currency, business.currency);
    const amount = invoice.amount_paid / 100;
    paid += amount;
    count++;
    const day = dayAt(at, business.timezone);
    byDay[day] = (byDay[day] ?? 0) + amount;
  }
  for (const sub of subs) {
    if (sub.items?.has_more) throw new Error("Suscripción con items truncados");
    const lines = sub.items?.data;
    if (
      !Array.isArray(lines) ||
      !scopedProducts(lines.map(productOf), business.stripe.productIds)
    )
      continue;
    for (const item of lines) {
      const price = item.price;
      assertCurrency(price.currency, business.currency);
      if (
        price.billing_scheme !== "per_unit" ||
        price.recurring?.usage_type === "metered" ||
        price.unit_amount === null
      )
        throw new Error(
          "MRR requiere precios fijos por unidad; implementá tu regla para precios por uso/escalas.",
        );
      const interval = price.recurring?.interval,
        n = price.recurring?.interval_count;
      if (!n || !["month", "year"].includes(interval))
        throw new Error(
          "MRR soporta intervalos mensuales/anuales; no se aproxima diario/semanal.",
        );
      mrr +=
        ((price.unit_amount / 100) * (item.quantity ?? 1)) /
        (interval === "year" ? 12 * n : n);
    }
  }
  return { paid, count, mrr, byDay, excluded };
}
export async function metaMetrics(days: number) {
  const token = process.env.META_ACCESS_TOKEN,
    version = process.env.META_API_VERSION;
  const accounts = business.meta.accounts;
  if (new Set(accounts.map((a) => a.accountId)).size !== accounts.length)
    throw new Error("Cuenta Meta repetida");
  const campaignIds = accounts.flatMap((a) => a.campaignIds);
  if (new Set(campaignIds).size !== campaignIds.length)
    throw new Error("Campaña Meta repetida");
  if (!token || !version || !business.meta.accounts.length) return null;
  if (!/^v\d+\.\d+$/.test(version))
    throw new Error("META_API_VERSION inválida");
  assertSupportedCurrency(business.currency);
  const r = rangeForDays(days, new Date(), business.timezone);
  let spend = 0,
    clicks = 0;
  const byDay: Record<string, number> = {};
  for (const account of business.meta.accounts) {
    if (
      !/^act_\d+$/.test(account.accountId) ||
      !account.campaignIds.length ||
      account.campaignIds.some((x) => !/^\d+$/.test(x))
    )
      throw new Error("Configurá cuentas y campañas exactas.");
    const accountInfo = await getJSON(
      new URL(
        `https://graph.facebook.com/${version}/${account.accountId}?fields=currency,timezone_name`,
      ),
      token,
    );
    assertCurrency(accountInfo.currency, business.currency);
    // Insights days use ad-account timezone. Reject mismatches instead of pretending the time windows align.
    const canonical = (zone: string) =>
      new Intl.DateTimeFormat("en", { timeZone: zone }).resolvedOptions()
        .timeZone;
    if (canonical(accountInfo.timezone_name) !== canonical(business.timezone))
      throw new Error(
        "La zona de la cuenta Meta no coincide con business.timezone. No se suman ventanas distintas.",
      );
    const url = new URL(
      `https://graph.facebook.com/${version}/${account.accountId}/insights`,
    );
    url.searchParams.set("fields", "date_start,spend,inline_link_clicks");
    url.searchParams.set("level", "campaign");
    url.searchParams.set("time_increment", "1");
    url.searchParams.set("limit", "500");
    url.searchParams.set(
      "filtering",
      JSON.stringify([
        { field: "campaign.id", operator: "IN", value: account.campaignIds },
      ]),
    );
    url.searchParams.set(
      "time_range",
      JSON.stringify({
        since: r.from,
        until: dayAt(r.end - 1, business.timezone),
      }),
    );
    let done = false;
    for (let page = 0; page < 30; page++) {
      const body = await getJSON(url, token);
      if (!Array.isArray(body.data))
        throw new Error("Respuesta de Meta inválida");
      for (const row of body.data) {
        const s = Number(row.spend),
          c = Number(row.inline_link_clicks ?? 0);
        if (!Number.isFinite(s) || !Number.isFinite(c))
          throw new Error("Dato Meta inválido");
        spend += s;
        clicks += c;
        byDay[row.date_start] = (byDay[row.date_start] ?? 0) + s;
      }
      if (!body.paging?.next) {
        done = true;
        break;
      }
      const after = body.paging?.cursors?.after;
      if (!after) throw new Error("Cursor Meta faltante");
      url.searchParams.set("after", after);
    }
    if (!done)
      throw new Error("Meta superó límite de páginas. No se muestra parcial.");
  }
  return { spend, clicks, byDay };
}
