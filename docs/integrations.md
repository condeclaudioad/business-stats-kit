# Conectar las fuentes

Usá primero datos sintéticos. En modo real, protegé el acceso según [seguridad](security.md) y elegí un día cerrado para [conciliar](metrics.md). Las claves se guardan en `.env.local` y en el gestor de secretos del hosting, nunca en `business.config.ts`, el chat o GitHub.

## Configuración del negocio

`business.config.ts` define `name`, `currency`, `timezone`, `stripe.productIds` y `meta.accounts`. Cada cuenta Meta lleva `accountId` y `campaignIds` explícitos. Es configuración del servidor. Cambiar colores no cambia estos filtros.

Monedas admitidas por este conector: USD, EUR, ARS, BRL, MXN, COP, PEN, GBP, CAD y AUD. Todas se procesan con dos decimales. No agregar JPY ni otra moneda sin adaptar y probar su exponente. No existe conversión automática de divisas.

## Stripe: facturas pagadas y suscripciones

1. Entrá a la cuenta propia de Stripe y verificá qué productos pertenecen al negocio. Copiá sus IDs de producto al catálogo de `business.config.ts`; no usar IDs de precio ni el nombre del plan.
2. Creá una clave restringida exclusiva para el dashboard. Habilitá lectura de los recursos consultados por `lib/connectors.ts` (facturas, suscripciones y sus líneas/relaciones necesarias). Dejá permisos de escritura deshabilitados. Un 403 exige revisar el recurso faltante, no habilitar todo.
3. Guardala como `STRIPE_RESTRICTED_KEY` del lado servidor. Empezá en el entorno de prueba de Stripe y conciliá antes de usar la clave live. No mezclar productos test y live.
4. Contrastá un día cerrado con la lista de facturas pagadas, usando fecha de pago, moneda y catálogo idénticos.

**Alcance implementado:** la métrica «Facturas saldadas (bruto)» suma `amount_paid` de facturas `paid` por `paid_at`; excluye pagos que no tengan factura. Solo entran facturas cuyos productos pertenecen íntegramente al catálogo. El estado pagado puede incluir facturas marcadas pagadas fuera de Stripe (`paid_out_of_band`) y saldos/créditos aplicados. No prueba cobro procesado por Stripe ni efectivo recibido. No descuenta reembolsos ni comisiones; no presentarla como caja bancaria, beneficio ni ingreso neto.

El MRR es un snapshot de suscripciones `active` de precio fijo mensual/anual, normalizado a mes y a precio de lista. No aplica descuentos ni soporta planes por uso o escalas. No equivale a lo cobrado ese mes. Para otra definición hay que ampliar el conector y su conciliación antes de renombrar la tarjeta.

Si el negocio vende exclusivamente con pagos sin factura, el total de este conector será incompleto por diseño: adaptar lectura de PaymentIntents/Checkout Sessions y su unión por producto, o elegir una fuente que incluya esos pagos. No compensar sumando todos los cobros de la cuenta.

[Claves API de Stripe](https://docs.stripe.com/keys).

## Meta: cuentas y campañas explícitas

1. Elegí las cuentas y campañas que representan este negocio; guardá sus IDs en `meta.accounts`. Una cuenta compartida necesita un scope de campañas estricto.
2. Obtené un token autorizado a leer esas cuentas con el permiso de lectura apropiado (`ads_read`), según el tipo de aplicación y acceso aprobado por Meta. Configurá `META_ACCESS_TOKEN` y una `META_API_VERSION` válida para esa app.
3. Comprobá moneda y zona horaria: el conector exige que coincidan con las del negocio. Si difieren, no sumar sin una política de conversión/fechas explícita.
4. Compará gasto y clics de enlace en Ads Manager para el mismo período y las mismas campañas. Revisá paginación y errores de cada cuenta. Una cuenta sin acceso no debe desaparecer del total silenciosamente.

La configuración no añade campañas nuevas automáticamente; incorporarlas requiere revisar sus IDs. Las conversiones atribuidas de Meta dependen de su ventana y modelo. No tratarlas como pagos independientes ni sumarlas a Stripe.

[Insights API oficial](https://developers.facebook.com/docs/marketing-api/insights/). La investigación inicial encontró un HTTP 429 al abrir esta página; el alumno/agente debe confirmar campos y permisos vigentes en su conexión real. El kit no crea anuncios ni modifica presupuestos.

## Producto y email: contrato de importación

Estos módulos funcionan con tablas normalizadas de Postgres y un importador local. Producto incluye además un comando manual de lectura desde PostHog, explicado abajo. **No incluyen una sincronización programada ni un conector universal a plataformas de cursos o email.** El agente puede crear un exportador/adaptador para el proveedor elegido, conservando este contrato.

Aplicá `db/analytics.sql` en la base dedicada con el mismo rol usado por `DATABASE_URL`. Si el administrador aplica la migración con otro rol, debe otorgar al rol del servidor los permisos sobre ese esquema y tablas; verificarlos antes de importar. Después, desde la raíz:

```bash
npm run data:import -- /ruta/privada/eventos.json
```

El archivo es un objeto JSON con `source` (`product` o `email`) y `events`:

```json
{
  "source": "product",
  "events": [
    {
      "id": "demo-product-001",
      "kind": "product.activated",
      "subject_id": "usuario-ficticio-001",
      "occurred_at": "2026-10-01T12:00:00Z"
    }
  ]
}
```

Este ejemplo es sintético; no importarlo a una base real como si fuese actividad del negocio. `id` debe ser único globalmente: prefijalo por fuente/proveedor. `occurred_at` es el momento del evento con zona horaria, no el momento de la exportación.

| `source` | `kind` admitidos | `subject_id` |
|---|---|---|
| `product` | `product.activated`, `product.failed` | ID pseudónimo estable del usuario. Sin nombre ni email. |
| `email` | `email.delivered`, `email.clicked` | ID del mensaje, el mismo en entrega y clic. No el email del destinatario. |

Máximo por archivo: 10.000 eventos y 5 MB. La importación es idempotente por `id`: un ID existente con el mismo contenido se conserva. Si el contenido cambia, se rechaza la transacción completa y no se actualiza la hora de importación. Para corregir una importación errónea, preparar una reparación controlada de la base y verificar el resultado; no cambiar IDs para esconder duplicados.

Producto calcula usuarios/acciones/fallos a partir de esos eventos. Acordá qué acción de valor se mapea a `product.activated`; no mapear un login por conveniencia. Email forma una cohorte de mensajes cuya primera entrega cae en el rango; cuenta clics posteriores a esa entrega y anteriores al final. Importá la historia necesaria para conocer primeras entregas. No hay aperturas, rebotes, bajas ni ingresos atribuidos en esta versión.

La hora visible de importación prueba cuándo se cargó el archivo; no prueba que el exportador incluyera todos los datos del proveedor. Guardá por fuera del dashboard la cobertura de la exportación (inicio, fin, filtros y exclusiones).

Para adaptar una base del producto o Resend, primero identificá sus eventos/IDs reales, exportá solo los campos del contrato, probá duplicados y datos fuera de orden, y conciliá conteos. [Stripe en PostHog](https://posthog.com/docs/data-pipelines/sources/stripe), [eventos Resend](https://resend.com/docs/webhooks/event-types).


## Producto desde PostHog

El comando `npm run data:sync:posthog -- 7` lee los últimos siete días hasta el momento de ejecución y guarda los eventos en el mismo Postgres del dashboard. Acepta de 1 a 90 días. Se ejecuta a pedido: el kit no crea un cron ni promete actualización continua.

Preparación:

1. Aplicá `db/analytics.sql` en la base dedicada.
2. Usá un proyecto propio de PostHog Cloud con los eventos `product.activated` y `product.failed`. Si los tuyos tienen otros nombres, adaptá y probá la consulta de `scripts/sync-posthog.ts`; el comando no los adivina ni instrumenta tu producto.
3. Configurá `POSTHOG_HOST` como `https://us.posthog.com` o `https://eu.posthog.com`, `POSTHOG_PROJECT_ID` numérico y `POSTHOG_PERSONAL_KEY` con acceso de consulta al proyecto. El host de ingestión no es el host de esta API. El conector no admite self-hosted sin adaptación.
4. Generá `POSTHOG_PSEUDONYM_SECRET`, un secreto aleatorio de al menos 32 caracteres, en tu gestor de secretos. Mantenelo estable: se usa con HMAC para convertir `distinct_id` en un pseudónimo antes de guardar. Cambiarlo puede dividir el historial de una misma persona. No confundir pseudonimización con anonimización irreversible.
5. Ejecutá el comando y conciliá los conteos contra PostHog para la misma ventana. Usa un endpoint POST de consultas HogQL, de solo lectura; no envía eventos ni modifica el proyecto remoto.

La consulta pagina en lotes de 5.000 y no guarda resultados parciales si alcanza el máximo de diez páginas sin confirmar el fin. Una ventana con 50.000 resultados exactos también requiere reducirla, porque no alcanza para demostrar que terminó. Los eventos se guardan en una transacción y se deduplican por `posthog:<uuid>`; una ejecución posterior conserva los eventos idénticos y rechaza la transacción si un ID existente tiene contenido distinto. No mezclar varios proyectos PostHog en la misma instalación sin ampliar el namespace de IDs y su política de identidad.

La lectura usa una ventana móvil UTC, mientras las tarjetas agrupan por la zona del negocio. Importá suficiente historia para cubrir el rango que vas a mostrar. El comando no prueba que la instrumentación sea completa ni que todos los eventos hayan llegado: documentá retrasos y cobertura. Antes de añadir un scheduler, definir frecuencia, cuotas, observación de fallos y tratamiento de eventos tardíos.

Estado de verificación inicial: el comando PostHog se implementó y pasó comprobaciones de código/build; no se probó contra una cuenta real del proveedor. Esa lectura y conciliación corresponden a cada instalación.
