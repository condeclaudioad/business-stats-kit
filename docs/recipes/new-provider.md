# Diseñar un adaptador nuevo

Primero elegí la unidad y la evidencia; después la API. Este repo incluye Stripe/Meta y el contrato producto/email, no una conexión automática a todos los proveedores mencionados en la clase.

| Caso | Evidencia necesaria | Riesgo que probar |
|---|---|---|
| Mercado Pago | Pago, estado, moneda, fecha y pertenencia a la oferta | Revisiones, devoluciones, cuotas, duplicados y dinero no disponible |
| Resend u otro email | Evento y message ID, entrega y clic compatibles | Webhooks repetidos/fuera de orden; clic automatizado; aperturas no prueban lectura |
| Plataforma de cursos | Curso/lección, usuario pseudónimo y acción de valor | «Matriculado» no es «completó»; ausencia de telemetría no prueba abandono |
| Tracking UTM | Visita identificada → checkout → pago con evidencia persistida | Consentimiento, dispositivos, tráfico directo, dedupe y ventanas |
| Avisos de venta | Evento confirmado y destinatario autorizado | Doble envío, reintentos, datos personales en notificaciones |

Estas filas son especificaciones de trabajo, no conectores incluidos. UTM/CAPI/notificaciones no se habilitan por elegir un diseño. Evitá dobles emisores al agregar tracking a un sitio que ya tiene píxeles.

Diseño mínimo: contrato con IDs, paginación, estados, moneda/zona, timeout/cuota, cobertura y secreto solo servidor. Implementar prueba sintética → lectura de prueba → comparación con origen. Consultar documentación oficial actual del proveedor elegido; registrar URL/fecha, permisos y versión. No copiar un ejemplo de internet como evidencia de que la cuenta tiene acceso.
