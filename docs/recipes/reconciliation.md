# Conciliar sin engañarse

Ejemplo sintético: el proveedor muestra 3 facturas de 10 USD y el dashboard 20 USD. Compará IDs: si falta una página, corregí paginación; si la tercera es de otra oferta, el scope puede ser correcto. No sumar diez dólares para que coincida.

Ficha de comparación (guardar datos reales fuera de Git):

| Campo | Completar |
|---|---|
| Pregunta/definición | Qué cuenta exactamente esta tarjeta |
| Extracción | Fecha/hora y zona; versión/commit |
| Ventana | Inicio inclusive y fin exclusivo, zona de negocio |
| Alcance | Cuenta, productos/campañas, estados y moneda |
| Cobertura | Páginas completas, filtros, exclusiones y corte |
| Comparación | IDs presentes/faltantes/sobrantes; total y redondeo |
| Resolución | Diferencia explicada, defecto corregido o pendiente |

Probar, además del caso feliz: pago pendiente; reembolso posterior; suscripción anual; producto externo; cero legítimo; fuente inaccesible; duplicado; evento tardío; cambio horario; moneda distinta. Solo los casos aplicables al contrato implementado. Si un caso no está soportado, documentarlo como exclusión en lugar de inventar el resultado.

Un cociente facturas/inversión no demuestra qué anuncio produjo una venta. La igualdad con un reporte comercial tampoco verifica su modelo de atribución. Para decidir cancelar ese servicio usar [decision-checklist](../decision-checklist.md).
