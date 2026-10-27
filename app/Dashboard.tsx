"use client";
import { useEffect, useState } from "react";
import type { Dashboard as Data, Metric } from "@/lib/contracts";
type Area = "overview" | "marketing" | "product" | "email";
const areas: { id: Area; label: string; title: string; description: string }[] =
  [
    {
      id: "overview",
      label: "Resumen",
      title: "El pulso de tu negocio.",
      description:
        "Ventas, inversión y actividad. Cada número con su fuente y su alcance.",
    },
    {
      id: "marketing",
      label: "Marketing",
      title: "Dónde invertís. Qué vuelve.",
      description:
        "La inversión y los clics vienen de Meta. La relación con facturación no es atribución.",
    },
    {
      id: "product",
      label: "Producto",
      title: "Lo que tus clientes usan.",
      description:
        "Medí la acción que entrega valor. Registrarse no es lo mismo que activar.",
    },
    {
      id: "email",
      label: "Email",
      title: "De la entrega a la acción.",
      description:
        "Compará los clics de la misma cohorte de mensajes entregados.",
    },
  ];
function Icon({ kind }: { kind: Area }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      {kind === "overview" ? (
        <>
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
        </>
      ) : kind === "marketing" ? (
        <>
          <path d="m3 13 18-8v14L3 13ZM7 15v6h4l-1-5" />
        </>
      ) : kind === "product" ? (
        <>
          <path d="m12 2 10 5v10l-10 5-10-5V7Z M2 7l10 5 10-5M12 12v10" />
        </>
      ) : (
        <>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="m3 6 9 7 9-7" />
        </>
      )}
    </svg>
  );
}
function format(m: Metric, currency: string) {
  if (m.value === null) return "—";
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits:
      m.unit === "money" ? 2 : m.unit === "percent" ? 1 : 2,
    ...(m.unit === "money" ? { style: "currency", currency } : {}),
    ...(m.unit === "percent" ? { style: "unit", unit: "percent" } : {}),
  }).format(m.value);
}
export default function Dashboard() {
  const [area, setArea] = useState<Area>("overview"),
    [theme, setTheme] = useState("studio"),
    [days, setDays] = useState(30),
    [data, setData] = useState<Data | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const saved = localStorage.getItem("stats-theme");
    if (saved && ["studio", "editorial", "terminal"].includes(saved))
      setTheme(saved);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`/api/dashboard?days=${days}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (r) => {
        if (r.status === 401) {
          location.assign("/login");
          throw new Error("Iniciá sesión nuevamente.");
        }
        if (!r.ok)
          throw new Error(
            "No pudimos leer el tablero. Revisá la configuración y volvé a intentar.",
          );
        return r.json();
      })
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(e.message);
          setData(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [days, refresh]);
  const current = areas.find((x) => x.id === area)!;
  const visible = data ? (area === "overview" ? data.sales : data[area]) : [];
  async function logout() {
    const result = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    if (result.ok) location.assign("/login");
    else setError("No se pudo cerrar la sesión. Volvé a intentar.");
  }
  return (
    <div className={`workspace theme-${theme}`}>
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Business Stats, inicio">
          <span className="brand-mark">
            bs<span>.</span>
          </span>
          <span>
            Business
            <br />
            <b>Stats</b>
          </span>
        </a>
        <p className="sidebar-label">TU ESPACIO</p>
        <nav aria-label="Secciones del dashboard">
          {areas.map((item) => (
            <button
              key={item.id}
              aria-current={area === item.id ? "page" : undefined}
              onClick={() => setArea(item.id)}
            >
              <Icon kind={item.id} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="private-note">
            <span className="status-dot" />{" "}
            {data?.demo ? "Entorno de práctica" : "Espacio privado"}
          </div>
          <p>
            {data?.demo
              ? "Probá el tablero antes de conectar tus fuentes."
              : "Contraseña + passkey. Acceso de un solo propietario."}
          </p>
          {data && !data.demo && (
            <button className="text-button" onClick={logout}>
              Cerrar sesión
            </button>
          )}
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <span className="business-name">
            {data?.business ?? "Business Stats"}
          </span>
          <label className="theme-picker">
            Estilo{" "}
            <select
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
                localStorage.setItem("stats-theme", e.target.value);
              }}
            >
              <option value="studio">Studio</option>
              <option value="editorial">Editorial</option>
              <option value="terminal">Terminal</option>
            </select>
          </label>
        </header>
        {data?.demo && (
          <div className="demo-banner">
            <strong>DEMO</strong>
            <span>
              Todo lo que ves es ficticio. No hay cuentas reales conectadas.
            </span>
            <a href="#sources">Ver fuentes</a>
          </div>
        )}
        <section className="page-heading">
          <div>
            <h1>{current.title}</h1>
            <p>{current.description}</p>
          </div>
          <div className="toolbar">
            <label>
              <span className="sr-only">Período</span>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              >
                <option value="7">Últimos 7 días</option>
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 90 días</option>
              </select>
            </label>
            <button
              onClick={() => setRefresh((x) => x + 1)}
              disabled={loading}
              className="refresh"
            >
              {loading ? "Leyendo…" : "Actualizar"}
            </button>
          </div>
        </section>
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        {loading && !data && (
          <div className="loading" role="status">
            Preparando tus métricas…
          </div>
        )}
        {data && (
          <div
            aria-busy={loading}
            className={loading ? "content updating" : "content"}
          >
            <p className="period">
              {data.from} → {new Date(Date.parse(data.to+"T00:00:00Z")-86400000).toISOString().slice(0,10)}{" "}
              <span>
                {data.timezone} · {data.currency}
              </span>
            </p>
            <section className="metric-grid" aria-label="Métricas principales">
              {visible.map((m, i) => (
                <article
                  key={m.label}
                  className={i === 0 ? "metric primary" : "metric"}
                >
                  <h2>{m.label}</h2>
                  <strong className="metric-value">
                    {format(m, data.currency)}
                  </strong>
                  <details>
                    <summary>Cómo se mide</summary>
                    <p>{m.definition}</p>
                  </details>
                </article>
              ))}
            </section>
            {area === "overview" && (
              <section className="chart-panel">
                <div className="section-heading">
                  <div>
                    <h2>Facturas e inversión, día a día</h2>
                    <p>
                      Facturas saldadas frente a gasto. No representa caja
                      verificada ni utilidad.
                    </p>
                  </div>
                  <div className="legend">
                    <span>
                      <i className="revenue-key" />
                      Facturas
                    </span>
                    <span>
                      <i className="spend-key" />
                      Inversión
                    </span>
                  </div>
                </div>
                {data.series.length ? (
                  <>
                    <div
                      className="chart"
                      role="img"
                      aria-label={`Gráfico de ${days} días, disponible también en tabla debajo.`}
                    >
                      {data.series.map((point) => {
                        const max = Math.max(
                          ...data.series.map((x) =>
                            Math.max(x.revenue, x.spend),
                          ),
                          1,
                        );
                        return (
                          <div
                            className="bar-group"
                            key={point.day}
                            title={`${point.day}: facturas ${point.revenue}, inversión ${point.spend} ${data.currency}`}
                          >
                            <div
                              className="bar revenue"
                              style={{
                                height: `${Math.max(1, (point.revenue / max) * 100)}%`,
                              }}
                            />
                            <div
                              className="bar spend"
                              style={{
                                height: `${Math.max(1, (point.spend / max) * 100)}%`,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="chart-axis">
                      <span>{data.series[0].day}</span>
                      <span>{data.series.at(-1)?.day}</span>
                    </div>
                    <details className="chart-table">
                      <summary>Ver datos en tabla</summary>
                      <div className="table-scroll">
                        <table>
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Facturas ({data.currency})</th>
                              <th>Inversión ({data.currency})</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.series.map((p) => (
                              <tr key={p.day}>
                                <td>{p.day}</td>
                                <td>{p.revenue.toFixed(2)}</td>
                                <td>{p.spend.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  </>
                ) : (
                  <div className="empty">
                    Conectá Stripe y Meta con la misma moneda y zona para
                    comparar el período. Una fuente faltante nunca aparece como
                    cero.
                  </div>
                )}
              </section>
            )}
            {area === "overview" && (
              <section className="quick-view">
                <h2>Más allá de la venta</h2>
                <div>
                  {[
                    {
                      label: "Producto",
                      metric: data.product[0],
                      target: "product" as Area,
                    },
                    {
                      label: "Email",
                      metric: data.email[0],
                      target: "email" as Area,
                    },
                    {
                      label: "Marketing",
                      metric: data.marketing[0],
                      target: "marketing" as Area,
                    },
                  ].map((item) => (
                    <button
                      onClick={() => setArea(item.target)}
                      key={item.label}
                    >
                      <span>
                        {item.label}
                        <small>{item.metric.label}</small>
                      </span>
                      <strong>{format(item.metric, data.currency)}</strong>
                      <span aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {area !== "overview" && (
              <section className="reading-note">
                <h2>
                  {area === "product"
                    ? "La activación la definís vos."
                    : area === "email"
                      ? "Una entrega no es una venta."
                      : "Separá facturación, caja y atribución."}
                </h2>
                <p>
                  {area === "product"
                    ? "Elegí una acción observable que entrega valor: un proyecto exportado, una clase terminada o un reporte usado. Importá eventos con un ID pseudónimo, nunca datos personales."
                    : area === "email"
                      ? "Este tablero mide mensajes entregados y clics de esa misma cohorte. Para atribuir compras necesitás una unión explícita entre mensaje, checkout y pago. Las aperturas no prueban lectura."
                      : "Una compra puede llegar por pauta, email o una visita anterior. El cociente facturado / inversión sirve como contexto; puede incluir pagos externos y no es ROAS por anuncio. No sumes las compras atribuidas por cada plataforma."}
                </p>
              </section>
            )}
            <section id="sources" className="sources">
              <div className="section-heading">
                <div>
                  <h2>La fuente importa.</h2>
                  <p>
                    Disponibilidad, última lectura y límites de cada
                    integración.
                  </p>
                </div>
                <span className="source-count">
                  {data.sources.filter((s) => s.state === "ready").length} / 4
                  disponibles
                </span>
              </div>
              {data.sources.map((source) => (
                <article className="source-row" key={source.name}>
                  <div>
                    <span className={`status-dot ${source.state}`} />
                    <strong>{source.name}</strong>
                  </div>
                  <p>{source.detail}</p>
                  <div className="source-state">
                    <span>
                      {source.state === "ready"
                        ? "Disponible"
                        : source.state === "partial"
                            ? "Revisar cobertura"
                            : source.state === "missing"
                          ? "Sin configurar"
                          : "Revisar fuente"}
                    </span>
                    {source.dataThrough && <small>Datos hasta {new Intl.DateTimeFormat('es-AR',{dateStyle:'short',timeStyle:'short',timeZone:data.timezone}).format(new Date(source.dataThrough))}</small>}
                    <time>
                      {source.updatedAt
                        ? new Intl.DateTimeFormat("es-AR", {
                            dateStyle: "short",
                            timeStyle: "short",
                            timeZone: data.timezone,
                          }).format(new Date(source.updatedAt))
                        : "—"}
                    </time>
                  </div>
                </article>
              ))}
            </section>
            <footer>
              Business Stats Kit{" "}
              <span>Datos propios. Decisiones con contexto.</span>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}
