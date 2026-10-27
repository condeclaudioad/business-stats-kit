# SaaS de una oferta

Pregunta inicial: **¿Los clientes llegan a usar la función que entrega valor?** Elegí una oferta antes de sumar otras.

- Evento de valor propuesto: Proyecto exportado o reporte utilizado. Acordalo con el dueño y documentá cómo se observa.
- Fuentes y adaptación: Stripe por catálogo; eventos canónicos de PostHog o export JSON. Retención/cohortes y churn necesitan nuevas definiciones y datos, no están resueltos por contar IDs activos.
- Límite: Registro o login no equivalen a activación. MRR nominal no es caja ni beneficio.

Completá en una ficha local: nombre, moneda, zona, oferta, productos/campañas exactos, definición de evento, población y período. Los IDs reales de ejemplo de otro negocio no sirven. No inventar una métrica si no hay fuente.

Prueba de aceptación: un caso sintético que recorra pago/acción sin mezclar sus unidades; un día cerrado conciliado por fuente; una fuente desconectada muestra «—»; ningún dato personal llega al navegador. Diseñá primero la demo con `stats-design`, conectá con `stats-connect-sources` y verificá con `stats-reconcile`.
