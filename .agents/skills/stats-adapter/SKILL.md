---
name: stats-adapter
description: Implementa una fuente todavía no soportada o una nueva métrica con contrato, fixtures y pruebas; no simula integraciones listas.
---

Leé `AGENTS.md`, `docs/integrations.md`, `lib/contracts.ts`, `lib/import-validation.ts` y el adaptador más cercano. Para proveedor no implementado, leé `docs/recipes/new-provider.md`.

1. Definí la pregunta y el contrato mínimo: evento/estado, ID estable, unidad, moneda, fecha, alcance, deduplicación, cobertura y tratamiento de revisiones. Comprobá documentación oficial actual del proveedor y registrá URL/fecha, sin asumir campos por similitud con Stripe.
2. Elegí importar un export normalizado o integrar API de lectura. Mercado Pago, Resend, Google Ads, Hotmart y plataformas de cursos no quedan conectados por existir un MCP o por configurar una variable. Detectá qué soporta realmente este checkout y explicá el desarrollo faltante.
3. Implementá capa servidor con validación de respuesta, paginación acotada y detectable, timeouts, cuotas/reintentos controlados, caché con fecha original y fallos explícitos. Una página faltante invalida el total. Usá IDs de negocio demostrables; nunca monto/nombre para separar ofertas.
4. Para producto/email reutilizá `validateImport`: `source`, `coverage:{from,to}` y eventos mínimos. No afirmar cobertura completa de una exportación recortada. IDs globales con prefijo de proveedor/proyecto. Email une entrega y clic por mensaje; no por dirección. La pseudonimización debe mantener identidad estable sin almacenar email.
5. Para ventas nuevas, el contrato de eventos actual NO admite pagos: diseñá su almacenamiento/cálculo por separado. No mapear una venta a `product.activated` para sumar ingresos. Probá estado pendiente→aprobado→devuelto, duplicados, orden de llegada, desconocidos, moneda, días locales, accesos denegados y páginas truncadas.
6. Primero fixture sintética, después cuenta sandbox si existe, finalmente conciliación autorizada con `stats-reconcile`. Si falta credencial, entregá código probado con mocks y pendiente explícito; no poner estado «conectado».

Aceptación: error no equivale a cero; actualización idempotente; pertenencia y cobertura demostrables. Webhooks requieren firma/raw-body, deduplicación y manejo fuera de orden antes de exponerse. No agregar emisores de conversiones, mensajes ni cobros sin el alcance específico del usuario.
