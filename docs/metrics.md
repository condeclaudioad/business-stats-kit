# Cómo definir los números

Antes de conectar una cuenta, escribir qué negocio se mide, qué productos incluye, en qué moneda, en qué zona horaria y con qué rango temporal. Una cuenta de Stripe o Meta puede contener varios negocios.

## Contrato mínimo

Cada métrica necesita nombre, fuente, unidad, fórmula, período, exclusiones, hora de lectura y estado de cobertura. El valor ausente se muestra como `—`; cero significa que la fuente se leyó correctamente y no hubo casos.

| Área | Qué contar | Error que hay que evitar |
|---|---|---|
| Ventas | Cobros efectivamente pagados de productos permitidos; reembolsos y comisiones con definición separada. | Inferir el negocio por importe, nombre del cliente o descripción libre. |
| Marketing | Gasto y resultados del conjunto explícito de cuentas/campañas. | Sumar cuentas ajenas o presentar un total parcial como completo. |
| Producto | Usuarios distintos que realizan el evento de valor, activación y uso dentro del período. | Llamar activo a alguien solo porque se registró o abrió una página. |
| Email | Envíos, entregas, clics y bajas del conjunto de campañas elegido. | Tratar apertura como lectura humana o atribuir ventas por haber enviado el email. |

En esta versión, la tarjeta Stripe suma facturas saldadas (`amount_paid`) y puede incluir pagos externos o créditos; no acredita caja cobrada. Las definiciones implementadas actualmente están en el código y la UI. Esta guía también fija criterios para ampliar el kit; no afirma que todas las métricas de la tabla estén implementadas.

## Dinero

Guardar importes en unidades menores enteras y moneda explícita. No dividir todas las monedas por 100 sin considerar sus exponentes. No sumar monedas distintas sin una política de conversión con fecha y fuente. El starter trabaja con una moneda configurada; una incompatibilidad debe señalarse, no convertirse silenciosamente.

Distinguir cobrado bruto, reembolsado, comisiones y neto. `Cobros − gasto publicitario` no es beneficio: faltan comisiones, costos de producto, impuestos y otros gastos. MRR se calcula sobre suscripciones recurrentes válidas normalizadas por intervalo; no es la suma de cobros del mes. Churn necesita una cohorte inicial definida y nunca se obtiene dividiendo bajas por una base final arbitraria.

## Embudos y atribución

Los totales de visitas, leads y compras del mismo día no representan necesariamente a las mismas personas. Para una conversión trazada, fijar una cohorte de entrada, un identificador estable y una ventana; comprobar el orden de eventos y unir la compra mediante identificadores exactos. Un pago anterior a la visita no convierte esa visita.

Separar superficie (web, app, quiz), adquisición (anuncio, email, búsqueda) y fuente de evidencia. Una compra puede tener señales de más de un canal. Las compras atribuidas por Meta y las compras cobradas por Stripe se muestran con sus propias definiciones; no se suman. Si se calcula ingreso total/gasto total, llamarlo eficiencia global, no ROAS atribuido.

No atribuir por proximidad temporal, email coincidente o haber recibido una campaña. Conservar los casos sin atribuir y ambiguos. No subir porcentajes artificialmente ni recortarlos a 100% para esconder poblaciones incompatibles.

## Producto y email

Elegir un evento de valor concreto: exportó un documento, completó una lección o generó su primer resultado. Definir activación (primera vez), actividad (en ventana), retención (cohorte que vuelve) y riesgo (cliente pagador sin valor durante N días). El umbral depende del producto y debe quedar configurado/documentado.

Aperturas y clics pueden estar inflados por precarga o sistemas de seguridad. Priorizar entrega, rebote, baja y clic validado, declarando limitaciones. Para atribuir una compra a email, conservar una señal verificable y la ventana elegida; el envío solo es evidencia de exposición potencial.

## Conciliación antes de confiar

1. Tomar un día cerrado, con la misma zona horaria y filtros en origen y dashboard.
2. Comparar cada fuente por separado, incluyendo cero casos, reembolsos y productos externos.
3. Revisar paginación, duplicados, límites, pruebas internas y eventos tardíos.
4. Registrar discrepancias y su causa. Un dato del proveedor no disponible es cobertura incompleta.
5. Repetir al agregar productos, cambiar proveedor o modificar fórmulas.
