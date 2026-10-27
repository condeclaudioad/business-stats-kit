# Antes de reemplazar o cancelar una herramienta de tracking

Esta lista produce una decisión y evidencia. No cancela servicios, no borra scripts y no autoriza cambios en campañas, cobros o integraciones. Usarla con [la comparación de UTMify](utmify.md).

## 1. Inventariar qué hace hoy

Anotá cada dependencia y su responsable real:

| Función | Sistema que la hace hoy | Evidencia / URL sin secretos | ¿Es esencial? | Reemplazo probado |
|---|---|---|---|---|
| Captura y persistencia UTM / click IDs | — | — | — | — |
| Recibir pagos, estados y reembolsos | — | — | — | — |
| Unir visitante/checkout/pago/anuncio | — | — | — | — |
| Pixel navegador y eventos de servidor | — | — | — | — |
| Deduplicación navegador-servidor | — | — | — | — |
| Reportes por campaña/anuncio | — | — | — | — |
| Reglas que modifican publicidad | — | — | — | — |
| Exportación e histórico | — | — | — | — |
| Operación, alertas y recuperación | — | — | — | — |

«No sabemos» es un pendiente. El dashboard propio no captura ni reenvía eventos publicitarios en esta versión. Tener el pixel en la landing no demuestra que las compras de checkout lleguen al servidor ni que se dedupliquen.

## 2. Definir qué se va a reemplazar

Elegí una opción y escribí por qué:

- **Complemento:** conservar tracking/atribución y usar el kit para métricas operativas propias.
- **Reemplazo del tablero:** otra capa conserva el tracking requerido, y el kit cubre los reportes que realmente usás.
- **Reemplazo completo:** solo evaluable después de implementar y probar las funciones faltantes. La v0.1 por sí sola no llega a este estado.

Si una integración esencial todavía no tiene sustituto, la decisión es conservarla. No compensar una ausencia con una promesa de construirla después de cancelar.

## 3. Probar en paralelo sin duplicar envíos

Mantener lecturas en paralelo es distinto de instalar dos emisores de `Purchase`. No duplicar pixels, webhooks o envíos CAPI para hacer la comparación. El kit actual consulta y carga datos en su base; no necesita enviar conversiones a Meta.

Elegí un período que cubra el ciclo real del negocio, retrasos de pago y atribución. No hay una duración universal: incluir suficientes casos para probar ventas aprobadas, pendientes/fallidas, reembolsos, renovaciones, upsells y fuentes sin UTMs que sean relevantes. Si un caso todavía no ocurrió, marcarlo como no comprobado o probarlo en un entorno autorizado del proveedor.

Para cada muestra, comparar con la pasarela/orden original como fuente de estado monetario, con la misma moneda, zona horaria y filtros. No tratar UTMify o el kit como verdad por defecto. Para atribución, comparar el registro de UTMs/identificadores capturado en el recorrido y la ventana/modelo; dos plataformas pueden discrepar por definición, no por un error aritmético.

| Prueba | Resultado esperado | Estado / evidencia |
|---|---|---|
| Producto de otro negocio en la cuenta compartida | Queda excluido de ventas propias | — |
| Pago sin factura | Se identifica como fuera del alcance de Stripe del kit; no se oculta como cobertura total | — |
| Factura con crédito o pago externo | No se presenta como cobro procesado por Stripe | — |
| Reembolso / comisión | Se concilia en origen; el kit no afirma neto | — |
| Compra por anuncio y compra sin UTM | Se conserva la diferencia y el caso sin atribución; no se inventa unión | — |
| Evento browser + server de la misma compra | Un envío lógico deduplicado en la plataforma destino, si se usa esa arquitectura | — |
| Cuenta Meta caída o fuente incompleta | El tablero señala error/ausencia, no un total parcial como completo | — |
| Token revocado / cuota / paginación | Falla visible y recuperación documentada | — |
| API sin sesión, logout y recuperación | Acceso rechazado y recuperación probada en el destino propio | — |

El acuerdo de tolerancia se define antes de revisar resultados: por ejemplo, conteos de órdenes por ID exactos y redondeo monetario explicado. Nunca aceptar «se parece» como conciliación. Documentar cada diferencia, su causa y su impacto sobre una decisión real.

## 4. Comprobar operación y costos

- Elegir quién mantiene la base, actualiza dependencias, rota claves y responde a una caída.
- Probar backup/restauración y conservar acceso administrativo seguro. La passkey del tablero no protege por sí sola el panel del hosting.
- Verificar cuánto historial se necesita y cómo exportarlo antes de perder acceso al proveedor anterior. No asumir conservación ni borrado inmediato: leer condiciones vigentes de esa cuenta.
- Completar `U/X/Tu` y `H/D/A/Tk/M` de [la comparación](utmify.md#pros-contras-y-costo-total), con moneda, impuestos, fecha y factura/cotización.
- Confirmar que ninguna regla publicitaria, alerta o integración oculta dependa del servicio que se pretende retirar.

## 5. Criterio para dar el cambio por listo

Se puede proponer la baja cuando todas las funciones esenciales tengan un sustituto verificado o se haya decidido explícitamente dejar de usarlas; los datos estén conciliados; el acceso y la recuperación estén probados; el histórico necesario esté respaldado; y una persona acepte costos y mantenimiento.

Guardar una decisión breve:

```text
Fecha y zona:
Uso que se reemplaza:
Funciones que se conservan en otro sistema:
Período y casos conciliados:
Diferencias pendientes y efecto:
Costo total comparado y fuente:
Responsable de operación:
Plan para volver atrás:
Decisión: conservar / complementar / reemplazar tablero / reemplazo completo probado
```

La cancelación, si finalmente se decide, es una acción separada del análisis. Verificar el comprobante, renovación y fecha de acceso después de ejecutarla con autorización. No quitar instrumentación ni revocar sus credenciales hasta comprobar qué dependencias deben seguir funcionando.
