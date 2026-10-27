import "server-only";
import { business } from "../business.config";
import {
  Dashboard,
  metric,
  ratio,
  rangeForDays,
  daysInRange,
  Source,
} from "./contracts";
import { demoDashboard } from "./demo";
import { stripeMetrics, metaMetrics } from "./connectors";
import { eventMetrics } from "./analytics";
export async function getDashboard(days: number): Promise<Dashboard> {
  rangeForDays(days, new Date(), business.timezone);
  if (process.env.APP_MODE === "demo") return demoDashboard(days);
  if (process.env.APP_MODE !== "live")
    throw new Error("APP_MODE debe ser demo o live");
  const sources: Source[] = [];
  async function source<T>(
    name: string,
    fn: () => Promise<T | null>,
  ): Promise<T | null> {
    try {
      const value = await fn();
      sources.push({
        name,
        state: value === null ? "missing" : "ready",
        updatedAt: value === null ? null : new Date().toISOString(),
        detail:
          value === null
            ? "Sin configurar. Seguí la guía de fuentes."
            : "Lectura completa dentro del alcance configurado.",
      });
      return value;
    } catch (error) {
      sources.push({
        name,
        state: "error",
        updatedAt: null,
        detail:
          "Lectura incompleta o configuración incompatible. Revisá permisos, moneda, zona horaria y alcance en la guía de fuentes.",
      });
      return null;
    }
  }
  const [s, m, p, e] = await Promise.all([
    source("Stripe", () => stripeMetrics(days)),
    source("Meta Ads", () => metaMetrics(days)),
    source("Producto", () => eventMetrics(days, "product")),
    source("Email", () => eventMetrics(days, "email")),
  ]);
  if (s) {
    sources.find(x=>x.name==="Stripe")!.updatedAt=s.readAt;
    sources.find((x) => x.name === "Stripe")!.detail =
      `Solo facturas y suscripciones del catálogo. ${s.excluded} facturas fuera de alcance. No incluye pagos sin factura, reembolsos ni comisiones.`;
  }
  if(m) sources.find(x=>x.name==="Meta Ads")!.updatedAt=m.readAt;
  const product=p?.coverage.complete?p:null, email=e?.coverage.complete?e:null;
  if (p) {
    sources.find((x) => x.name === "Producto")!.updatedAt = p.at;
    sources.find((x) => x.name === "Producto")!.detail =
      p.coverage.reason;
    sources.find(x=>x.name==="Producto")!.dataThrough=p.coverage.asOf;
    if(!p.coverage.complete||p.coverage.stale)sources.find(x=>x.name==="Producto")!.state="partial";
  }
  if (e) {
    sources.find((x) => x.name === "Email")!.updatedAt = e.at;
    sources.find((x) => x.name === "Email")!.detail =
      e.coverage.reason;
    sources.find(x=>x.name==="Email")!.dataThrough=e.coverage.asOf;
    if(!e.coverage.complete||e.coverage.stale)sources.find(x=>x.name==="Email")!.state="partial";
  }
  sources.sort((a,b)=>["Stripe","Meta Ads","Producto","Email"].indexOf(a.name)-["Stripe","Meta Ads","Producto","Email"].indexOf(b.name));
  const r = rangeForDays(days, new Date(), business.timezone);
  return {
    business: business.name,
    currency: business.currency,
    timezone: business.timezone,
    demo: false,
    from: r.from,
    to: r.to,
    sources,
    sales: [
      metric(
        "Facturas saldadas (bruto)",
        s?.paid ?? null,
        "money",
        "amount_paid por paid_at y catálogo. Incluye facturas marcadas pagadas fuera de Stripe; no prueba cobro por Stripe. Antes de reembolsos/comisiones, sin pagos sin factura.",
      ),
      metric(
        "Facturas pagadas",
        s?.count ?? null,
        "number",
        "Facturas pagadas en el período, no clientes nuevos.",
      ),
      metric(
        "MRR de catálogo",
        s?.mrr ?? null,
        "money",
        "Snapshot activo: precio de lista por cantidad, mensual/anual. Antes de descuentos, impuestos y saldos; no es caja.",
      ),
    ],
    marketing: [
      metric(
        "Inversión publicitaria",
        m?.spend ?? null,
        "money",
        "Gasto Meta de cuentas y campañas configuradas, en la zona configurada.",
      ),
      metric(
        "Clics de enlace",
        m?.clicks ?? null,
        "number",
        "inline_link_clicks reportados por Meta. No son sesiones únicas.",
      ),
      metric(
        "Facturado / inversión",
        s && m && m.spend > 0 ? s.paid / m.spend : null,
        "number",
        "Importe de facturas saldadas / gasto. Puede incluir pagos registrados fuera de Stripe. No es ROAS ni caja verificada.",
      ),
    ],
    product: [
      metric(
        "IDs activos",
        product?.active ?? null,
        "number",
        "IDs pseudónimos únicos con product.activated hasta el corte. Varias identidades de una persona pueden contar más de una vez; definí una identidad canónica antes de llamarlos usuarios.",
      ),
      metric(
        "Acciones de valor",
        product?.actions ?? null,
        "number",
        "Cantidad de eventos product.activated. Definí qué acción expresa valor.",
      ),
      metric(
        "Tasa de fallos",
        product ? ratio(product.failed, product.actions + product.failed) : null,
        "percent",
        "product.failed / (product.activated + product.failed).",
      ),
    ],
    email: [
      metric(
        "Emails entregados",
        email?.delivered ?? null,
        "number",
        "Mensajes únicos cuyo primer email.delivered cae en el período.",
      ),
      metric(
        "Mensajes con clic",
        email?.clicked ?? null,
        "number",
        "Mensajes de esa cohorte con email.clicked posterior a entrega y antes del cierre.",
      ),
      metric(
        "Click rate",
        email ? ratio(email.clicked, email.delivered) : null,
        "percent",
        "Mensajes con clic / entregados de la misma cohorte. Los bloqueadores y bots limitan la señal.",
      ),
    ],
    series:
      s && m
        ? daysInRange(r.from, days).map((day) => {
            return {
              day,
              revenue: s.byDay[day] ?? 0,
              spend: m.byDay[day] ?? 0,
            };
          })
        : [],
  };
}
