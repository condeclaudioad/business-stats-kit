"use client";
import { useState } from "react";
const examples = {
  software: { label: "Software", stages: ["Visitantes identificados", "Prueba iniciada", "Primera acción de valor", "Primer pago confirmado"], values: [1200, 360, 180, 72], action: "Un proyecto exportado", color: "#a78bfa" },
  course: { label: "Curso / PDF", stages: ["Visitantes identificados", "Checkout iniciado", "Pago confirmado", "Primera clase completada"], values: [900, 225, 90, 54], action: "Una clase completada; descargar no prueba lectura", color: "#f59e8b" },
  service: { label: "Servicio", stages: ["Consultas recibidas", "Consultas calificadas", "Propuestas enviadas", "Primer pago confirmado"], values: [240, 96, 48, 24], action: "Un entregable aprobado", color: "#69c9bf" },
};
type Example = keyof typeof examples;
export default function DemoFunnel() {
  const [selected, setSelected] = useState<Example>("software");
  const model = examples[selected];
  return <section className="demo-lab" aria-labelledby="demo-lab-title">
    <div className="section-heading"><div><span className="lab-kicker">LABORATORIO · SOLO DATOS INVENTADOS</span><h2 id="demo-lab-title">Dale forma a tu embudo.</h2><p>Elegí un negocio y explorá una misma cohorte ficticia. Este ejemplo es independiente del período del tablero.</p></div>
    <label className="lab-select">Ejemplo<select aria-label="Ejemplo" value={selected} onChange={e => setSelected(e.target.value as Example)}>{Object.entries(examples).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label></div>
    <div className="lab-body"><ol className="funnel-stages">{model.stages.map((stage, i) => <li key={stage}>
      <div className="funnel-caption"><span><small>0{i + 1}</small>{stage}</span><strong>{model.values[i].toLocaleString("es-AR")}</strong></div>
      <div className="funnel-track" aria-hidden="true"><span style={{ width: `${model.values[i] / model.values[0] * 100}%`, backgroundColor: model.color }} /></div>
      <p>{i === 0 ? "100% de la cohorte ficticia" : `${(model.values[i] / model.values[i - 1] * 100).toFixed(0)}% de la etapa anterior · ${(model.values[i] / model.values[0] * 100).toFixed(0)}% del inicio`}</p>
    </li>)}</ol>
    <aside className="lab-notes"><span className="lab-orbit" aria-hidden="true">↗</span><h3>La forma está lista.<br/>La medición se construye.</h3><p>Acción de valor sugerida: <strong>{model.action}</strong>.</p><p>Para usarlo con datos reales hay que unir identidades, ordenar eventos y comprobar pagos. El kit todavía no conecta este embudo a tus fuentes.</p><span className="lab-badge">Sin atribución implementada</span></aside></div>
  </section>;
}
