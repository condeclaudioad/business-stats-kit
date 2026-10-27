import {createHash} from "node:crypto";
import {createSourceCache} from "./source-cache";
import {validateBusiness,type BusinessConfig} from "./business-validation";
import {
  assertCurrency,
  assertSupportedCurrency,
  dayAt,
  scopedProducts,
  rangeForDays,
} from "./contracts";

type Obj = Record<string, any>;
export function createConnectors(business:BusinessConfig, env:Record<string,string|undefined>, transport:typeof fetch=fetch) {
const cached = createSourceCache();
function validate(){const errors=validateBusiness(business);if(errors.length)throw new Error(errors.join(' '));}
function nonnegative(value:unknown,label:string,integer=false){
 if(typeof value!=='number'||!Number.isFinite(value)||value<0||(integer&&!Number.isSafeInteger(value)))throw new Error(`${label} inválido; no se muestra un parcial.`);
 return value;
}
function canonical(zone:string){if(typeof zone!=='string'||!zone)throw new Error('Falta zona de la cuenta');return new Intl.DateTimeFormat('en',{timeZone:zone}).resolvedOptions().timeZone;}

async function getJSON(url:URL,token:string,reads:string[],deadline:number):Promise<Obj>{
 const key=createHash('sha256').update(token+'|'+url.toString()).digest('hex');
 const result=await cached(key,async()=>{
  const remaining=deadline-Date.now();if(remaining<=0)throw new Error('Lectura agotó el tiempo disponible. No se muestra un parcial.');
  const res=await transport(url,{headers:{Authorization:`Bearer ${token}`},cache:'no-store',redirect:'error',signal:AbortSignal.timeout(Math.min(20_000,remaining))});
  if(!res.ok)throw new Error(`El proveedor respondió ${res.status}. Revisá permisos y configuración.`);
  const body=await res.json();if(!body||typeof body!=='object'||body.error)throw new Error('Respuesta del proveedor inválida.');
  return body as Obj;
 });
 reads.push(result.readAt);return result.value;
}
async function stripeList(
  path: string,
  params: Record<string, string>,
  token: string, reads:string[], deadline:number,
): Promise<Obj[]> {
  const out: Obj[] = [];
  const seenIds = new Set<string>();
  let after = "";
  for (let page = 0; page < 30; page++) {
    const url = new URL(`https://api.stripe.com/v1/${path}`);
    Object.entries({
      ...params,
      limit: "100",
      ...(after ? { starting_after: after } : {}),
    }).forEach(([k, v]) => url.searchParams.set(k, v));
    const body = await getJSON(url, token, reads, deadline);
    if (!Array.isArray(body.data) || typeof body.has_more!=="boolean")
      throw new Error("Respuesta de Stripe inválida");
    for (const item of body.data) {
      if (!item || typeof item.id !== "string" || !item.id || seenIds.has(item.id))
        throw new Error("Stripe devolvió un ID inválido o duplicado en la paginación.");
      seenIds.add(item.id);
    }
    out.push(...body.data);
    if (!body.has_more) return out;
    if (!body.data.length) throw new Error("Paginación vacía");
    const next = body.data.at(-1)?.id;
    if(typeof next!=="string"||!next||next===after)throw new Error("Cursor Stripe inválido");
    after = next;
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
async function stripeMetrics(days: number) {
  const token = env.STRIPE_RESTRICTED_KEY;
  if (!token || !business.stripe.productIds.length) return null;
  validate();
  const reads:string[]=[];const deadline=Date.now()+25_000;
  const r = rangeForDays(days, new Date(), business.timezone);
  // Paid date may differ from invoice creation date. Do not filter created: old invoices may be paid now.
  const [invoices, subs] = await Promise.all([
    stripeList("invoices", { status: "paid" }, token, reads, deadline),
    stripeList("subscriptions", { status: "active" }, token, reads, deadline),
  ]);
  let paid = 0,
    count = 0,
    mrr = 0,
    excluded = 0;
  const byDay: Record<string, number> = {};
  for (const invoice of invoices) {
    const at = invoice.status_transitions?.paid_at;
    if(!Number.isSafeInteger(at)||at<=0)throw new Error("Factura pagada sin fecha válida.");
    if(at < r.start || at >= r.end) continue;
    const lines = invoice.lines?.has_more
      ? await stripeList(
          `invoices/${encodeURIComponent(invoice.id)}/lines`,
          {},
          token, reads, deadline,
        )
      : invoice.lines?.data;
    if (!Array.isArray(lines)) throw new Error("Factura sin líneas legibles");
    if (!scopedProducts(lines.map(productOf), business.stripe.productIds)) {
      excluded++;
      continue;
    }
    assertCurrency(invoice.currency, business.currency);
    const amount = nonnegative(invoice.amount_paid,"Importe de factura",true) / 100;
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
      if (!Number.isSafeInteger(n) || n<=0 || !["month", "year"].includes(interval))
        throw new Error(
          "MRR soporta intervalos mensuales/anuales; no se aproxima diario/semanal.",
        );
      mrr +=
        ((nonnegative(price.unit_amount,"Precio",true) / 100) * nonnegative(item.quantity ?? 1,"Cantidad",true)) /
        (interval === "year" ? 12 * n : n);
    }
  }
  return { paid, count, mrr, byDay, excluded, readAt:reads.sort()[0] };
}
async function metaMetrics(days: number) {
  const token = env.META_ACCESS_TOKEN,
    version = env.META_API_VERSION;
  const accounts = business.meta.accounts;
  if (new Set(accounts.map((a) => a.accountId)).size !== accounts.length)
    throw new Error("Cuenta Meta repetida");
  const campaignIds = accounts.flatMap((a) => a.campaignIds);
  if (new Set(campaignIds).size !== campaignIds.length)
    throw new Error("Campaña Meta repetida");
  if (!token || !version || !business.meta.accounts.length) return null;
  if (!/^v\d+\.\d+$/.test(version))
    throw new Error("META_API_VERSION inválida");
  validate();
  const reads:string[]=[];const deadline=Date.now()+25_000;
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
      token, reads, deadline,
    );
    assertCurrency(accountInfo.currency, business.currency);
    // Insights days use ad-account timezone. Reject mismatches instead of pretending the time windows align.
    if (canonical(accountInfo.timezone_name) !== canonical(business.timezone))
      throw new Error(
        "La zona de la cuenta Meta no coincide con business.timezone. No se suman ventanas distintas.",
      );
    // An empty Insights result cannot distinguish no spend from a mistyped campaign.
    // Validate each configured campaign before treating an empty result as a real zero.
    for (const campaignId of account.campaignIds) {
      const campaign = await getJSON(
        new URL(`https://graph.facebook.com/${version}/${campaignId}?fields=id,account_id`),
        token, reads, deadline,
      );
      if (campaign.id !== campaignId || campaign.account_id !== account.accountId.slice(4))
        throw new Error("La campaña Meta no existe, no es accesible o no pertenece a la cuenta configurada.");
    }
    const url = new URL(
      `https://graph.facebook.com/${version}/${account.accountId}/insights`,
    );
    url.searchParams.set("fields", "campaign_id,date_start,spend,inline_link_clicks");
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
    const seenRows=new Set<string>(),seenCursors=new Set<string>();
    for (let page = 0; page < 30; page++) {
      const body = await getJSON(url, token, reads, deadline);
      if (!Array.isArray(body.data))
        throw new Error("Respuesta de Meta inválida");
      for (const row of body.data) {
        if(!account.campaignIds.includes(row.campaign_id)||typeof row.date_start!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(row.date_start)||row.date_start<r.from||row.date_start>=r.to)throw new Error('Meta devolvió datos fuera del alcance solicitado.');
        const rowKey=row.campaign_id+'|'+row.date_start;if(seenRows.has(rowKey))throw new Error('Meta devolvió una fila duplicada.');seenRows.add(rowKey);
        if(typeof row.spend!=='string'||!/^\d+(?:\.\d+)?$/.test(row.spend))throw new Error('Gasto Meta inválido.');
        const s = Number(row.spend),
          c = Number(row.inline_link_clicks ?? 0);
        if (!Number.isFinite(s) || s<0 || !Number.isSafeInteger(c) || c<0)
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
      if (typeof after!=="string"||!after||seenCursors.has(after)) throw new Error("Cursor Meta faltante o repetido");
      seenCursors.add(after);
      url.searchParams.set("after", after);
    }
    if (!done)
      throw new Error("Meta superó límite de páginas. No se muestra parcial.");
  }
  return { spend, clicks, byDay, readAt:reads.sort()[0] };
}

return {stripeMetrics,metaMetrics};
}
