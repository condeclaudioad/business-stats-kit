---
name: stats-reconcile
description: Investiga discrepancias y concilia métricas del dashboard con sus fuentes, sin mezclar caja, facturas ni atribución.
---

Leé `AGENTS.md`, `docs/metrics.md`, `docs/integrations.md`, el cálculo afectado y `docs/recipes/reconciliation.md`.

1. Reproducí una discrepancia concreta en un día cerrado: mismo rango [desde,hasta), zona, moneda, negocio/productos, cuentas/campañas y estado del pago. Registrá versión del código y fecha de cada extracción. Sin acceso al origen, marcá pendiente; no completar datos inventados.
2. Trazá tarjeta → transformación → filas mínimas de origen. Compará conjuntos por ID estable, no solo sumas. Separá faltantes, sobrantes, repetidos, diferente fecha/estado, monedas y datos tardíos. Evitá exportar PII; no commitear datos reales del cliente ni resultados financieros.
3. Revisá paginación completa, límites, caché, cobertura, DST, reembolsos, facturas externas/créditos y catálogo compartido. Un número diferente no prueba un bug: puede ser otra definición. No renombrar facturas saldadas como caja ni dividir poblaciones para inventar atribución.
4. Si hay un defecto, creá fixture sintética mínima que reproduzca el caso, corregí el cálculo y probá los bordes relacionados. Si faltan datos, conservá `—` y explicá el faltante. Tolerancias monetarias deben acordarse por moneda/redondeo; no inventar un porcentaje universal.
5. Devolvé definición, alcance, diferencias explicadas, evidencia de test y comparación real pendiente/aprobada. Una suma que coincide por casualidad no basta si los IDs difieren.

Aceptación: igualdad de conjuntos y reglas, o cada diferencia clasificada; totales parciales no pasan como completos. Para abandonar UTMify leer también `docs/decision-checklist.md`: conciliar facturación no valida atribución ni CAPI.
