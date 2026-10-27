# Conectar las fuentes

Usá primero datos sintéticos. En modo real, protegé el acceso según [seguridad](security.md) y elegí un día cerrado para [conciliar](metrics.md). Las claves se guardan en `.env.local` y en el gestor de secretos del hosting, nunca en `business.config.ts`, el chat o GitHub.

## Configuración del negocio

`business.config.ts` define `name`, `currency`, `timezone`, `stripe.productIds` y `meta.accounts`. Cada cuenta Meta lleva `accountId` y `campaignIds` explícitos. Es configuración del servidor. Cambiar colores no cambia estos filtros.

Monedas admitidas por este conector: USD, EUR, ARS, BRL, MXN, COP, PEN, GBP, CAD y AUD. Todas se procesan con dos decimales. No agregar JPY ni otra moneda sin adaptar y probar su exponente. No existe conversión automática de divisas.

## Stripe: facturas pagadas y suscripciones

1. Entrá a la cuenta propia de Stripe y verificá qué productos pertenecen al negocio. Copiá sus IDs de producto al catálogo de `business.config.ts`; no usar IDs de precio ni el nombre del plan.
2. Creá una clave restringida exclusiva para el dashboard. Habilitá lectura de los recursos consultados por `lib/provider-connectors.ts` (facturas, suscripciones y sus líneas/relaciones necesarias). Dejá permisos de escritura deshabilitados. Un 403 exige revisar el recurso faltante, no habilitar todo.
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

Ejecutá `npm run db:setup` para aplicar `db/analytics.sql` en la base dedicada con el rol usado por `DATABASE_URL`. Si el administrador aplica la migración con otro rol, debe otorgar al rol del servidor los permisos sobre ese esquema y tablas; verificarlos antes de importar. Después, desde la raíz:

```bash
npm run data:import -- /ruta/privada/eventos.json
```

El archivo es un objeto JSON con `source` (`product` o `email`), `coverage` obligatorio y `events`:

```json
{
  "source": "product",
  "coverage": {
    "from": "2026-10-01T00:00:00Z",
    "to": "2026-10-02T00:00:00Z"
  },
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

Este ejemplo es sintético; no importarlo a una base real como si fuese actividad del negocio. `coverage.from` y `coverage.to` son fechas ISO con zona; representan `[from,to)`, inicio incluido y fin excluido, ordenadas y sin fin futuro. Todos los eventos deben caer dentro. Declarar una ventana exige exportar íntegramente esa ventana, incluso si tuvo cero eventos. `id` debe ser único globalmente: prefijalo por fuente/proveedor. `occurred_at` es el momento del evento con zona horaria, no el momento de la exportación.

| `source` | `kind` admitidos | `subject_id` |
|---|---|---|
| `product` | `product.activated`, `product.failed` | ID pseudónimo estable del usuario. Sin nombre ni email. |
| `email` | `email.delivered`, `email.clicked` | ID del mensaje, el mismo en entrega y clic. No el email del destinatario. |

Máximo por archivo: 10.000 eventos y 5 MB. La importación es idempotente por `id`: un ID existente con el mismo contenido se conserva. Si el contenido cambia, se rechaza la transacción completa y no se actualiza la hora de importación. Para corregir una importación errónea, preparar una reparación controlada de la base y verificar el resultado; no cambiar IDs para esconder duplicados.

Producto calcula usuarios/acciones/fallos a partir de esos eventos. Acordá qué acción de valor se mapea a `product.activated`; no mapear un login por conveniencia. Email forma una cohorte de mensajes cuya primera entrega cae en el rango; cuenta clics posteriores a esa entrega y anteriores al final. Importá la historia necesaria para conocer primeras entregas. No hay aperturas, rebotes, bajas ni ingresos atribuidos en esta versión.

La v0.2 guarda los intervalos declarados por fuente y evalúa su unión. `updatedAt` indica última carga; `dataThrough`, el corte de datos. Si falta el comienzo del rango o hay huecos, la fuente queda parcial y las tarjetas muestran `—`, no un total corto. Una cobertura continua puede mostrar cifras hasta su corte; si ese corte tiene más de 24 horas se advierte antigüedad. La cobertura declarada no prueba que el exportador o tracking capturen todas las acciones reales. Conservá filtros y exclusiones en la conciliación. Cargas anteriores sin coverage no acreditan cobertura: reimportá ventanas completas.

Para adaptar una base del producto o Resend, primero identificá sus eventos/IDs reales, exportá solo los campos del contrato, probá duplicados y datos fuera de orden, y conciliá conteos. [Stripe en PostHog](https://posthog.com/docs/data-pipelines/sources/stripe), [eventos Resend](https://resend.com/docs/webhooks/event-types).


## Producto desde PostHog

El comando `npm run data:sync:posthog -- 7` lee los últimos siete días hasta el momento de ejecución y guarda los eventos en el mismo Postgres del dashboard. Acepta de 1 a 90 días. Se ejecuta a pedido: el kit no crea un cron ni promete actualización continua.

Preparación:

1. Ejecutá `npm run db:setup` en la base dedicada.
2. Usá un proyecto propio de PostHog Cloud con los eventos `product.activated` y `product.failed`. Si los tuyos tienen otros nombres, adaptá y probá la consulta de `scripts/sync-posthog.ts`; el comando no los adivina ni instrumenta tu producto.
3. Configurá `POSTHOG_HOST` como `https://us.posthog.com` o `https://eu.posthog.com`, `POSTHOG_PROJECT_ID` numérico y `POSTHOG_PERSONAL_KEY` con acceso de consulta al proyecto. El host de ingestión no es el host de esta API. El conector no admite self-hosted sin adaptación.
4. Generá `POSTHOG_PSEUDONYM_SECRET`, un secreto aleatorio de al menos 32 caracteres, en tu gestor de secretos. Mantenelo estable: se usa con HMAC para convertir `distinct_id` en un pseudónimo antes de guardar. Cambiarlo puede dividir el historial de una misma persona. No confundir pseudonimización con anonimización irreversible.
5. Ejecutá el comando y conciliá los conteos contra PostHog para la misma ventana. Usa un endpoint POST de consultas HogQL, de solo lectura; no envía eventos ni modifica el proyecto remoto.

La consulta pagina por cursor UUID (`keyset`), en lotes de 5.000 hasta 50.000 eventos, con una consulta final de una fila para distinguir el límite exacto de un resultado truncado. Rechaza respuestas incompletas y no guarda un parcial. Los eventos se guardan en una transacción y se deduplican por `posthog:<uuid>`; una ejecución posterior conserva los eventos idénticos y rechaza la transacción si un ID existente tiene contenido distinto. No mezclar varios proyectos PostHog en la misma instalación sin ampliar el namespace de IDs y su política de identidad.

El conjunto de eventos puede crecer mientras se pagina: la consulta no ofrece un snapshot transaccional del proveedor. Los eventos tardíos requieren reimportar una ventana solapada suficiente; no se reconstruyen automáticamente fuera de la ventana pedida. La lectura usa una ventana móvil UTC, mientras las tarjetas agrupan por la zona del negocio. Importá suficiente historia para cubrir el rango que vas a mostrar. El comando no prueba que la instrumentación sea completa ni que todos los eventos hayan llegado: documentá retrasos y cobertura. Antes de añadir un scheduler, definir frecuencia, cuotas, observación de fallos y tratamiento de eventos tardíos.

Estado v0.2: la verificación final de esta revisión está pendiente de registro en [verification.md](verification.md). No se probó una cuenta real de PostHog; la lectura y conciliación corresponden a cada instalación.

## Diagnóstico y frecuencia

`npm run doctor` valida configuración sin mostrar secretos ni probar permisos de los proveedores. `npm run doctor -- --database` agrega lecturas del esquema y del dueño. No acredita Face ID físico, TLS correctamente operado ni conciliación.

Stripe/Meta tienen caché de 60 segundos por proceso y agrupan solicitudes concurrentes de la misma lectura. Es una reducción de llamadas, no un scheduler ni una caché compartida entre instancias. Tras un fallo no se sirve silenciosamente un dato viejo como actual. La hora de lectura conserva el corte real; pulsar Actualizar puede reutilizar una lectura dentro del TTL.
