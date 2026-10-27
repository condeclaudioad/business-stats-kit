import { Dashboard, metric, rangeForDays } from "./contracts";
export function demoDashboard(days: number): Dashboard {
  const range = rangeForDays(days);
  const series = Array.from({ length: days }, (_, i) => ({
    day: new Date((range.start + i * 86400) * 1000).toISOString().slice(0, 10),
    revenue: Math.round(190 + i * 3 + Math.sin(i * 1.3) * 80),
    spend: Math.round(65 + Math.cos(i * 0.9) * 18),
  }));
  const revenue = series.reduce((sum, p) => sum + p.revenue, 0),
    spend = series.reduce((sum, p) => sum + p.spend, 0);
  return {
    business: "Estudio Nube · negocio ficticio",
    currency: "USD",
    timezone: "UTC",
    demo: true,
    from: range.from,
    to: range.to,
    series,
    sources: ["Stripe", "Meta Ads", "Producto", "Email"].map((name) => ({
      name,
      state: "ready",
      updatedAt: new Date().toISOString(),
      detail:
        "Datos sintéticos de demostración. No corresponden a un negocio real.",
    })),
    sales: [
      metric(
        "Facturas saldadas (bruto)",
        revenue,
        "money",
        "Importe saldado de facturas del catálogo; puede incluir pagos registrados fuera de Stripe. Antes de comisiones y reembolsos.",
      ),
      metric(
        "Facturas pagadas",
        Math.round(revenue / 79),
        "number",
        "Facturas que registraron pago en este período. Una factura no equivale a un cliente nuevo.",
      ),
      metric(
        "MRR activo",
        9240,
        "money",
        "Snapshot de suscripciones activas, normalizado por mes; no es caja cobrada.",
      ),
    ],
    marketing: [
      metric(
        "Inversión publicitaria",
        spend,
        "money",
        "Gasto de las campañas seleccionadas.",
      ),
      metric(
        "Clics de enlace",
        days * 94,
        "number",
        "Clics de enlace reportados por Meta. No son visitantes únicos.",
      ),
      metric(
        "Facturado / inversión",
        revenue / spend,
        "number",
        "Relación de facturas saldadas e inversión; no es ROAS atribuido ni prueba de caja o causalidad.",
      ),
    ],
    product: [
      metric(
        "IDs activos",
        Math.round(days * 12.8),
        "number",
        "Usuarios únicos con al menos un evento de valor product.activated en el período.",
      ),
      metric(
        "Acciones de valor",
        days * 58,
        "number",
        "Eventos product.activated; definir este evento según el valor del producto.",
      ),
      metric(
        "Tasa de fallos",
        3.7,
        "percent",
        "Eventos product.failed / (product.activated + product.failed).",
      ),
    ],
    email: [
      metric(
        "Emails entregados",
        days * 246,
        "number",
        "Mensajes únicos con evento email.delivered.",
      ),
      metric(
        "Clics únicos",
        days * 21,
        "number",
        "Mensajes únicos con al menos un email.clicked.",
      ),
      metric(
        "Click rate",
        8.54,
        "percent",
        "Mensajes entregados en el período con clic / mensajes entregados en el período. No utiliza aperturas.",
      ),
    ],
  };
}
