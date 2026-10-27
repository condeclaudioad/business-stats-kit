# ¿Este kit permite dejar UTMify?

**La v0.2 no reemplaza UTMify completo.** Puede cubrir un tablero privado de operación si el negocio solo necesita sus métricas implementadas y el seguimiento de ventas/publicidad ya está resuelto por otra capa, o no forma parte de sus decisiones. Si hoy dependés de UTMify para conectar anuncio → venta, preservar UTMs o alimentar la optimización publicitaria, este repositorio no sustituye esa función.

Evaluación del 27/10/2026, 17:15 ART. Base de comparación: revisión `71cc042`; actualización de lectura para v0.2 en desarrollo, con los mismos proveedores y alcance. Se revisaron conectores, contratos, consultas, scripts y rutas API. La comparación no incluye una compra real ni una prueba de atribución en UTMify. No se tocó ninguna cuenta, integración o suscripción.

## Cómo leer la comparación

- **Verificado en código:** existe la implementación indicada; no equivale a conciliar la cuenta real de un alumno.
- **Proveedor declara:** la página o ayuda oficial describe la capacidad; no se auditó su precisión ni su operación interna.
- **No comprobado:** no se obtuvo evidencia suficiente. No significa que el proveedor carezca de la función.

UTMify es `utmify.com.br`. UTMizey, UTMize y otras marcas parecidas no son la misma herramienta y no se usaron como evidencia.

## Capacidad por capacidad

| Necesidad | Business Stats Kit v0.2 — inspeccionado en código | UTMify — evidencia pública | Consecuencia para reemplazar |
|---|---|---|---|
| Tablero de ventas y gasto | Facturas saldadas de Stripe, gasto/clics Meta y tres estilos sobre la misma lógica. | Declara dashboard de métricas y ventas por campaña [U1]. | Puede cubrir una lectura agregada propia, con las definiciones del kit. |
| Capturar y conservar UTMs | No incluye script de captura, cookie de atribución ni propagación al checkout. | La ayuda exige scripts y UTMs correctas; identifica casos vacíos/inválidos [U2]. | No retirar esa capa si se usa para atribuir ventas. |
| Unir anuncio → venta | No hay unión entre pago y anuncio/visitante. `Facturado / inversión` no es ROAS atribuido. | Declara seguimiento de ventas por campaña [U1]; documenta diagnóstico UTM [U2]. Modelo exacto/ventana no comprobados. | No puede reemplazar decisiones por anuncio basadas en esa unión. |
| Pixel, server-side y CAPI | No envía eventos de navegación ni compras a Meta; consulta métricas de lectura. | Declara seguimiento server-side [U1] y ofrece píxeles [U3]. Protocolo CAPI exacto, deduplicación y cobertura no comprobados. | Auditar qué servicio envía cada evento antes de quitarlo. No asumir CAPI por el nombre de una función. |
| Pasarelas y checkouts | Conector Stripe limitado a facturas/suscripciones. No hay webhooks de venta ni adaptadores listos para otras pasarelas. | Lista integraciones como Stripe, Hotmart, Kiwify y Shopify [U1]. | Un alumno con otra pasarela necesita desarrollar y probar su adaptador. |
| Reembolsos, comisiones y caja neta | No descuenta reembolsos/comisiones. Una factura saldada puede incluir créditos o pago registrado fuera de Stripe. | La FAQ explica que rechazos, reembolsos y contracargos no consumen su cupo de ventas [U1]. Tratamiento contable/comisiones del tablero no comprobado. | No comparar como si ambas cifras fueran caja neta conciliada. |
| Varias cuentas / negocios | Varios IDs Meta y campañas explícitos, misma moneda/zona; un negocio y un dueño por instalación. | Planes con límites de cuentas, webhooks y dashboards [U3]. | Multicuenta no garantiza separación por negocio. Conciliar scope de cada reporte. |
| Recurrencia / MRR | Snapshot de suscripciones Stripe activas, precio fijo mensual/anual de lista; sin descuentos/uso. | No se verificó una definición pública equivalente de MRR. | El kit puede aportar esa vista concreta; no afirmar superioridad universal. |
| Uso del producto | Activos, acciones de valor y fallos; JSON o comando manual PostHog con eventos canónicos. | Analítica de activación/uso equivalente no comprobada en las fuentes leídas. | Es un complemento operacional propio, no reemplazo del tracking publicitario. |
| Email | Entregas y clics por mensaje importados; sin envío, aperturas ni ventas atribuidas. | La ayuda distingue fuentes de recuperación como email mediante UTMs [U2]; analítica de entregas/clics no comprobada. | Medir entregas no sustituye atribuir compras a un email. |
| Operación y optimización | Código propio, contraseña+passkey, base propia; doctor/setup, cobertura visible y caché de 60 s por proceso. No cambia campañas ni incluye soporte gestionado o scheduler. | Declara optimizaciones desde el informe, soporte y app [U1]; reglas según plan [U3]. | Se gana control del código y se asume mantenimiento; no reemplaza automatizaciones externas. |

Las mejoras v0.2 hacen más visible la cobertura y facilitan preparar el entorno; no añaden captura UTM, atribución ni CAPI. La verificación final v0.2 está pendiente en [verification.md](verification.md).

Código de referencia: [conectores](../lib/provider-connectors.ts), [definiciones del dashboard](../lib/dashboard.ts), [producto/email](../lib/analytics.ts), [sync PostHog](../scripts/sync-posthog.ts), [rutas](../app/api/), [seguridad](security.md). Que el código sea visible y modificable no lo convierte automáticamente en más seguro que un servicio gestionado.

## Pros, contras y costo total

**El kit conviene** cuando necesitás fórmulas propias, unificar señales operativas, aprender cómo se calculan y adaptar la interfaz. No exige pagar una licencia de software por venta al autor del kit. Podés inspeccionar y modificar el alcance de cada consulta.

**El kit exige** mantener dependencias, permisos, secretos, base, backups, disponibilidad, pruebas y adaptadores. Los límites de consulta y la importación manual pueden ser insuficientes para volumen alto. Su código no incluye el recorrido completo de adquisición ni seguimiento de toda pasarela.

**UTMify puede convenir** si sus integraciones, atribución, soporte u optimizaciones resuelven trabajo que no querés desarrollar y operar. Su existencia no elimina la necesidad de configurar UTMs, probar recepción y conciliar; la propia ayuda documenta ventas no rastreadas [U2]. Las promesas comerciales de precisión o mejora de ganancias no se tomaron como resultados demostrados.

No hay un ahorro universal. Compará mensualmente, en la misma moneda y con impuestos consistentes:

| Costo | Servicio gestionado | Kit propio |
|---|---|---|
| Base | `U`: importe de tu plan vigente | `H + D`: hosting y Postgres |
| Volumen / extras | `X`: excedentes, adicionales e impuestos que correspondan | `A`: APIs/analítica, almacenamiento, transferencia y backups |
| Trabajo | `Tu`: configuración y conciliación, más soporte no cubierto | `Tk`: actualizaciones, incidencias, seguridad, conciliación y desarrollo |
| Migración | Costo de exportar/cerrar dependencias | `M`: implementación y validación inicial, amortizado en un período elegido |

`Costo UTMify = U + X + Tu`. `Costo kit = H + D + A + Tk + M amortizado`. Si se valora el tiempo en dinero, usar la misma tarifa y criterio en ambos lados. Separar costo de mantenimiento del costo hundido de haber tomado la clase.

### Precios: qué se pudo verificar

La [página oficial de precios][U3] mostró planes y cupos en la consulta del 27/10/2026. La vista en español mostró importes con símbolo `$`, sin código ISO de moneda ni desglose fiscal visible; el buscador devolvió la versión brasileña en `R$`. No se abrió checkout, no se eligió plan y no se verificó país de facturación/impuestos. Por eso **no se ofrece aquí un precio mensual universal ni una cifra de ahorro**. Para completar `U` y `X`, usar la cotización oficial de tu país o tu próxima factura, con moneda, plan, cupo, extras, impuestos y fecha.

Los costos actuales del hosting/DB/API elegidos por un alumno tampoco están verificados: completar `H`, `D` y `A` con sus proveedores. Un free tier no es garantía de costo cero permanente. La licencia MIT del kit no incluye infraestructura ni soporte operativo.

## Decisión para la clase

La promesa defendible es: **«Construí un tablero privado que mida tu negocio y entendé cuándo podés reemplazar una herramienta y cuándo todavía la necesitás».** No enseñar «cancelá UTMify porque ya tenés estas tarjetas».

Para decidir con evidencia, completá [la lista de salida](decision-checklist.md). Si falta una función esencial, conservarla en su sistema actual y usar el kit como complemento. Si solo necesitás el tablero implementado, las fuentes están conciliadas y aceptás su operación, puede reemplazar ese uso específico.

## Fuentes y límites de investigación

- **[U1] Sitio oficial:** [presentación y FAQ](https://www.utmify.com.br/), leído en navegador el 27/10/2026. Capacidades comerciales y lista de integraciones son declaraciones del proveedor; no son una auditoría técnica.
- **[U2] Ayuda oficial:** [posibles soluciones para ventas no rastreadas](https://utmify.help.center/article/1024-voce-esta-tendo-vendas-nao-trackeadas), leído completo en navegador. Verifica que la documentación reconoce dependencia de parámetros/scripts y casos sin atribución; no mide tasas de pérdida.
- **[U3] Sitio oficial:** [precios y cupos](https://www.utmify.com.br/precos/), leído en navegador el 27/10/2026. Se omiten precios numéricos por no comprobar moneda/país/impuestos de una cotización concreta.

La ayuda enlaza a `app.utmify.com.br`, lo que permite identificarla como centro del proveedor. `help.utmify.com.br` no fue accesible. Varias páginas oficiales renderizan contenido con JavaScript: se recurrió a lectura visual/DOM de navegador. No se usaron comparativas de competidores para concluir que UTMify tiene o carece de CAPI. No se publican datos de cuentas particulares.

[U1]: https://www.utmify.com.br/
[U2]: https://utmify.help.center/article/1024-voce-esta-tendo-vendas-nao-trackeadas
[U3]: https://www.utmify.com.br/precos/
