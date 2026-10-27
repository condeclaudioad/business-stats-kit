# PDF o producto descargable

Pregunta inicial: **¿Los compradores reciben y descargan el archivo?** Elegí una oferta antes de sumar otras.

- Evento de valor propuesto: Descarga acreditada por endpoint propio con ID estable. Acordalo con el dueño y documentá cómo se observa.
- Fuentes y adaptación: Pago por oferta y evento de descarga propio. No afirmar que el template mide aperturas de PDF. No incluir contenido del archivo, email o nombres en eventos.
- Límite: Un clic al enlace no prueba descarga completa; abrir un PDF offline no es observable sin instrumentación específica.

Completá en una ficha local: nombre, moneda, zona, oferta, productos/campañas exactos, definición de evento, población y período. Los IDs reales de ejemplo de otro negocio no sirven. No inventar una métrica si no hay fuente.

Prueba de aceptación: un caso sintético que recorra pago/acción sin mezclar sus unidades; un día cerrado conciliado por fuente; una fuente desconectada muestra «—»; ningún dato personal llega al navegador. Diseñá primero la demo con `stats-design`, conectá con `stats-connect-sources` y verificá con `stats-reconcile`.
