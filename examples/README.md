# Ejemplos sintéticos

Todos los IDs y eventos son ficticios. No importar en una base de negocio real: contaminaría sus métricas. Usar una base desechable configurada en una copia de pruebas, o validar sin guardar con `validateImport` de `lib/import-validation.ts`.

`imports/product.json` y `imports/email.json` cubren **2026-10-01 00:00 UTC a 2026-10-02 00:00 UTC**, fin exclusivo. La cobertura es una afirmación del exportador para ese conjunto de prueba, no evidencia de un proveedor real. Son ejemplos históricos: no aparecen automáticamente en rangos actuales del dashboard. No cambiar fechas para ocultar que faltan datos.

Resultados esperados para esa ventana UTC: producto tiene3acciones de valor,2IDs activos y1fallo; email tiene2mensajes entregados y1mensaje con clic (aunque hay2eventos de clic), CTR50%. Reimportar el mismo archivo es idempotente; cambiar el payload con el mismo ID debe rechazar la transacción. No unir IDs de persona con IDs de mensaje.

Para importar en la base desechable: preparar `.env.local` de esa copia, ejecutar `npm run db:setup` y `npm run data:import -- examples/imports/product.json` (luego email). El comando no redirige mágicamente a una base de pruebas: comprobar el destino privado antes de ejecutar.

Recetas por negocio: [SaaS](../docs/recipes/saas.md), [curso](../docs/recipes/course.md), [PDF](../docs/recipes/pdf.md), [servicios](../docs/recipes/services.md). Son definiciones y adaptaciones, no promesas de conectores incluidos.
