---
name: stats-connect-sources
description: Conecta o adapta fuentes de ventas, anuncios, producto y email a Business Stats Kit con alcance explícito y conciliación de datos.
---

Leé `AGENTS.md`, `docs/integrations.md`, `docs/metrics.md`, `business.config.ts` y el conector o importador afectado. La implementación manda sobre ejemplos de proveedores.

1. Identificá proveedor, cuenta, negocio, período, moneda, zona horaria y permiso de lectura disponible. Si la documentación del proveedor cambió, consultá su fuente oficial. No instalar plugins ni copiar código de terceros sin revisar alcance/licencia.
2. Pedí al usuario configurar secretos en su entorno; nunca en conversación. Guardá IDs de scope en la configuración prevista. No habilitar permisos de escritura para resolver un 403 de lectura.
3. Para Stripe, verificar producto por IDs y relación exacta de recursos; probar un producto externo y casos sin evidencia. La implementación actual mide facturas saldadas y no deduce reembolsos ni acredita caja: no cambiar esos nombres sin ampliar el conector y conciliar. Para Meta, comprobar IDs de cuenta/campaña, moneda, zona, paginación y ventana de atribución; no inferir pertenencia por nombre.
4. Para producto/email, mapear el esquema real al contrato de importación con `coverage:{from,to}` obligatorio: ISO con zona, ventana completa [from,to), no futura. No declarar cobertura por el mero timestamp de carga; comprobar huecos y corte visible. Si se usa PostHog, leer también `scripts/sync-posthog.ts`: requiere eventos canónicos y secreto HMAC estable, pagina por UUID y solo sincroniza a pedido. Reimportar ventanas solapadas para eventos tardíos; el proveedor no aporta snapshot transaccional. Verificar qué evento acredita valor y qué unidad se cuenta. No afirmar conector directo si se usa importación manual. No extraer PII innecesaria.
5. Tratar autenticación fallida, cuotas, páginas incompletas, duplicados y fuentes caídas explícitamente. No sumar un parcial como total ni mezclar moneda. Conservar `null` y cobertura.
6. Ejecutar pruebas del conector y conciliar un día cerrado contra el proveedor con filtros iguales. Mocks prueban lógica; dejar la cuenta real como no verificada hasta comparar su lectura.
7. Registrar en `.local/business.md` y evidencia privada dentro de `.local/` (ignorada por Git): fuente, fecha/hora con zona, filtros, cobertura, diferencia encontrada y límite pendiente.

Este flujo consulta datos. No crear pagos, reembolsar, cambiar anuncios, mandar emails ni agregar tracking a producción sin alcance explícito para esa acción.

Para una fuente que no existe en el código, usar `stats-adapter` antes de prometer conexión. Para discrepancias, `stats-reconcile`. Una CLI/MCP puede facilitar acceso autorizado durante configuración; no constituye por sí sola un proceso durable de sincronización del dashboard.

Aceptación por fuente: ID de cuenta y scope confirmados, permiso mínimo, cobertura declarada, deduplicación probada, fallo visible y conciliación de un día cerrado. Guardar evidencia real fuera de Git; el repo solo contiene fixtures sintéticas. Dejar por separado «implementado con mocks», «conectado» y «conciliado».
