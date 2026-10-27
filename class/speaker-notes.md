# Tu dashboard de negocio — guía de exposición

Duración propuesta: 24:00 de exposición. El taller y los permisos de cada cuenta van aparte; no es tiempo medido ni garantía de instalación.

## 1. Tu dashboard de negocio

Guía: 0:00 · 45 segundos.

Familia, hoy vamos a usar un proyecto que ya tiene el tablero, el acceso y las instrucciones para adaptarlo. La idea es que ustedes entiendan qué están instalando y sepan comprobar sus números. No alcanza con que se vea bonito. Vamos a ver lo que suma, lo que exige y la pregunta importante: si con esto podés dejar de pagar UTMify. La respuesta depende de para qué lo usás. Esta presentación propone una explicación de unos 24 minutos; la instalación y los permisos de cada cuenta se trabajan después, sin prometer un tiempo fijo.

## 2. Cuatro áreas, decisiones concretas

Guía: 0:45 · 60 segundos.

Bien, no empezamos diciendo quiero cincuenta métricas. Empezamos con una decisión. Si el problema es que los clientes no usan el producto, mirar solamente ventas no lo resuelve. Si querés saber qué anuncio generó una compra, mirar gasto y facturación juntos tampoco lo resuelve. El kit trae cuatro áreas, pero cada área tiene un alcance concreto. El objetivo es elegir una pregunta y encontrar la fuente que de verdad la responde. Ejercicio oral: que cada uno complete quiero saber si... con una decisión de su negocio.

## 3. La pantalla es la última capa

Guía: 1:45 · 60 segundos.

Mostrá el recorrido de izquierda a derecha. Stripe y Meta son fuentes externas. Producto y email entran por eventos propios o importaciones. Postgres conserva autenticación y eventos; el servidor lee, filtra y calcula. El navegador recibe agregados. La contraseña y la passkey protegen el acceso del dueño, pero no deciden qué significa cada número. Son dos problemas distintos. Esta versión es para un dueño por instalación, no un SaaS para repartir usuarios de distintos negocios. Si agregás equipos, necesitás diseñar permisos y aislamiento; no alcanza con poner otro formulario de registro.

## 4. Lo que ganás y lo que asumís

Guía: 2:45 · 60 segundos.

“Claudio, entonces me lo hago con IA y listo”. La IA puede adelantarte mucho código, pero alguien tiene que comprobarlo y mantenerlo. Ganás control sobre lo que medís y sobre cómo lo mostrás. Podés incorporar una acción que solo existe en tu producto. A cambio, te hacés cargo de cambios de APIs, permisos, respaldos y fallos. El código es tuyo; las cuentas externas siguen teniendo sus condiciones y costos. Si no querés atender esa operación, una herramienta administrada puede ser la mejor decisión. No se trata de construir todo porque ahora se puede.

## 5. Gratis el código no es gratis la operación

Guía: 3:45 · 60 segundos.

El repositorio tiene licencia MIT. Eso no significa costo total cero. Puede haber hosting, base, dominio, consumo de fuentes o herramientas de IA y tiempo de mantenimiento. No voy a poner un precio universal porque depende de región, volumen, plan e impuestos. En la guía del taller hay una cuenta para completar con tus costos reales. Si ahorrás una suscripción pero invertís más tiempo del que te sirve, el ahorro no era tan claro. Tampoco confundas un plan gratuito con una garantía de que seguirá alcanzando cuando crezca el negocio.

## 6. Cuatro números que no son lo mismo

Guía: 4:45 · 75 segundos.

Este es uno de los puntos que sí o sí tienen que saber. Hoy el conector Stripe lee facturas saldadas del catálogo permitido. Una factura puede quedar pagada por un pago externo o por créditos; no lo vamos a llamar dinero recibido en el banco. El MRR es nominal, a precio de lista, y no incluye todos los descuentos. Tampoco es caja. Para beneficio faltan costos, comisiones y devoluciones. Y para ROAS por anuncio falta una unión entre el anuncio y el pago. Que dos números estén al lado no demuestra esa relación. Abrí Cómo se mide en la demo y mostrá la definición.

## 7. Cada número necesita contexto

Guía: 6:00 · 60 segundos.

Imaginen que importo siete días de eventos y después miro noventa días. El tablero no debería decir que cubre noventa porque terminé de importar hace un minuto. Necesitamos saber la ventana que se leyó, no solo la hora de ejecución. Lo mismo con una cuenta Meta que falla: no podemos esconderla y mostrar la suma de las demás como si estuviera completa. Para comparar fuentes, igualamos moneda, zona horaria, fechas y filtros. Si falta información, la marcamos. Cero significa que pudimos medir y el resultado fue cero; un guion significa que no tenemos una respuesta confiable para esa métrica.

## 8. Lo que falta entre un clic y una venta

Guía: 7:00 · 75 segundos.

Acá está la diferencia entre un tablero y un sistema de atribución. Necesitás capturar el origen, conservarlo al navegar, llevarlo al checkout y unirlo con el pago exacto. Además tenés devoluciones, duplicados, dispositivos distintos y eventos que no llegaron. No vale unir por nombre, por un importe parecido o porque pasaron cinco minutos. Este kit no trae hoy un capturador UTM completo ni ese recorrido ad a venta. Tampoco envía pixel o CAPI. Si ustedes dependen de eso para decidir campañas, la pantalla de estadísticas por sí sola no lo reemplaza.

## 9. ¿Podés dejar de pagar UTMify?

Guía: 8:15 · 75 segundos.

La respuesta corta es que no recomiendo cancelar UTMify solo por instalar este kit. Si lo usás únicamente para mirar un resumen y no dependés de su tracking, este proyecto puede cubrir parte de ese trabajo después de conciliar los datos. Si dependés de atribución, scripts, integración con tu checkout o envío de conversiones, todavía falta construir y verificar esa capa. La web y la ayuda oficial de UTMify describen tracking e integraciones. No estamos certificando toda su implementación interna ni prometiendo que rastree todas las ventas. La comparación completa, con fecha y fuentes, está en docs/utmify.md. No presentar precios con símbolo $ como dólares si la moneda no está confirmada.

## 10. La prueba antes de cancelar

Guía: 9:30 · 60 segundos.

La cancelación es una decisión operativa, no el premio por terminar la clase. Primero hagan inventario: qué reportes consultan y qué scripts o webhooks dependen del servicio. Después comparen durante una ventana representativa de su ciclo de ventas; no voy a inventar una cantidad universal de días. Incluyan devoluciones, renovaciones y pagos tardíos que les apliquen. Documenten por qué difiere cada total. Antes de sacar algo, exporten lo que permita el proveedor, sepan qué van a perder y tengan una forma de volver. Si falta atribución crítica, conservan esa herramienta o construyen el reemplazo y lo prueban. No cancelamos nada en esta clase.

## 11. Dos modos, dos objetivos

Guía: 10:30 · 45 segundos.

La demo existe para aprender sin tocar cuentas ni introducir credenciales. Es el primer hito de todos. El modo live es una instalación distinta en cuanto a configuración y obligaciones: necesita base, dueño, passkey y fuentes. Si algo falla en live, se muestra el fallo o se bloquea; no cambiamos a demo silenciosamente. Tampoco quitamos la seguridad para que deje de dar error. Local significa que está corriendo en tu computadora. Publicado significa que lo dejaste en un servidor y lo verificaste en su dominio. Son estados distintos.

## 12. De GitHub al primer tablero

Guía: 11:15 · 90 segundos.

Mostrá Use this template en GitHub y elegí una copia propia. No hay que trabajar sobre el repositorio del instructor. Cloná esa copia, abrí la carpeta en el editor y comprobá Node y npm. Los comandos están copiados en el taller y son iguales en Windows, macOS y Linux. npm ci instala las versiones del lockfile. demo:setup crea la configuración de demo si no existe. doctor revisa configuración sin imprimir secretos. npm run dev arranca el servidor local; esa terminal debe seguir abierta mientras lo usás. Abrí localhost:4321 y confirmá que dice demo. Si el puerto está ocupado, cerrá el proceso que vos abriste o elegí otro puerto y conservá el origen coherente cuando pases a live. El taller incluye diagnóstico de fallos.

## 13. Definí qué entra y qué queda afuera

Guía: 12:45 · 75 segundos.

Abrí business.config.ts. Ustedes completan nombre, moneda, zona y los productos/campañas de su negocio. Lo que parece una configuración menor define qué números entran. Una misma cuenta de pagos puede cobrar varias ofertas o negocios. No filtren por descripción o por un monto que les parece suyo. Necesitamos productos e IDs exactos. En Meta, si crean una campaña nueva, deben incorporarla al scope luego de comprobarla. No mezclen monedas ni conviertan con una tasa inventada. El kit soporta un conjunto explícito de monedas de dos decimales; si su moneda no está incluida, hay que ampliar la política y sus pruebas antes de usarla.

## 14. Dos pasos, una sesión privada

Guía: 14:00 · 75 segundos.

Este paso se hace fuera de la grabación de pantalla de secretos. Preparás Postgres dedicado y configurás APP_MODE live, DATABASE_URL y APP_ORIGIN del lado servidor. Ejecutás npm run db:setup para el esquema de eventos y npm run auth:setup en terminal privada: pide usuario y contraseña sin eco. Genera un token temporal en .auth-bootstrap, que usás en el primer login para registrar la passkey. Después borrás ese archivo. El dispositivo puede pedir cara, huella o PIN; el servidor verifica una firma. Contraseña sola no debe devolver datos. Si perdés acceso, el reset por CLI requiere controlar la infraestructura y revoca sesiones y passkeys anteriores. No hay un botón mágico que saltee el segundo factor.

## 15. Dónde van las claves

Guía: 15:15 · 45 segundos.

Las claves no van en business.config ni en un prompt al agente. Van en .env.local o en el gestor de secretos del hosting. Nunca con prefijos que las lleven al cliente. Para leer estadísticas, la integración no necesita permiso para cobrar, reembolsar o modificar campañas. Usá el mínimo de lectura que el proveedor permita. La base de estadísticas se separa de la que cobra a tus clientes. Y no pienses que tener passkey protege una clave de base que publicaste en GitHub: son riesgos distintos. Si exponés un secreto, se rota; borrarlo del último archivo no lo elimina del historial.

## 16. Una fuente por vez

Guía: 16:00 · 75 segundos.

No conecten cuatro fuentes al mismo tiempo y después intenten adivinar cuál está mal. Empiecen por una y comparen un período contra el origen. Stripe necesita su catálogo. Meta requiere token, versión de API y scope. Producto tiene importación y un comando PostHog; sus nombres de eventos deben mapearse al contrato. Email todavía requiere adaptar un exportador de su proveedor. El kit no manda campañas ni emails. La guía de integraciones describe permisos y límites. Un comando implementado no prueba los permisos de la cuenta de cada alumno; por eso ese contraste forma parte de la instalación.

## 17. Los eventos necesitan un contrato

Guía: 17:15 · 75 segundos.

La importación no es pegar una planilla cualquiera. Cada evento tiene un ID estable, un tipo, una identidad pseudónima y su fecha real con zona. Si reimportamos exactamente lo mismo, no debe duplicar. Si cambiamos el contenido conservando el ID, debe detenerse para que revisemos el conflicto. No cambien el ID para esconder el problema. En producto, subject_id representa usuario; en email representa mensaje, no destinatario. Y necesitamos declarar la cobertura de lo exportado. coverage contiene from y to, con inicio incluido y fin excluido; declara una ventana completa exportada, no el mínimo y máximo de los eventos que encontraste. Usen el ejemplo vigente del repo. La importación manual no instala una rutina automática.

## 18. La acción de valor cambia

Guía: 18:30 · 60 segundos.

Lo que entrega valor cambia según el negocio. En software podría ser un reporte exportado. En un curso, una lección o ejercicio que realmente indique avance. En servicio, un hito aceptado. Son ejemplos, no reglas universales. No llamemos activación a un login porque es el dato más fácil de conseguir. Primero definimos qué decisión vamos a tomar, elegimos la señal, ubicamos dónde existe y recién después adaptamos el exportador. Si la pasarela no es Stripe, hace falta otro conector con su conciliación; no se resuelve cambiando el logo de la tarjeta.

## 19. Un cambio por vez, con prueba

Guía: 19:30 · 75 segundos.

Abrí la carpeta del proyecto con Claude Code o Codex y usá las skills incluidas. Distingan tres tipos de cambio. Apariencia: color, tipografía, orden. Negocio: qué productos o campañas cuentan y cómo se define una métrica. Integración: de qué fuente sale y cómo se transforma. Cada uno necesita una prueba distinta. Un cambio visual no debería tocar permisos ni modificar una fórmula. Antes de un cambio importante, guardá una versión en Git. Pedí una diferencia concreta y comprobable, no hacelo mejor. Los prompts completos para cada caso están en el taller, listos para copiar.

## 20. Un día cerrado y un caso difícil

Guía: 20:45 · 75 segundos.

La prueba más útil no es mirar si el gráfico sube. Elegí un día cerrado, usá las mismas fechas y filtros del proveedor y compará. Si no coincide, no ajustes la cifra a mano para que cierre. Buscá si falta una página, si la zona horaria es otra, si se incluyó otro negocio, si hubo una devolución o si la definición es distinta. Probá un duplicado y un evento tardío. Después corré tests, typecheck y build. Eso verifica código, pero no sustituye la cuenta real. Guardá la conciliación sin nombres de clientes ni secretos. Lo que no se pudo comprobar queda indicado.

## 21. Instalado no significa mantenido

Guía: 22:00 · 75 segundos.

La frecuencia concreta depende de tu negocio, pero hay disparadores claros: nuevo producto, nueva campaña, cambio de API o un dato que dejó de llegar. Las actualizaciones necesitan pruebas. Una copia de respaldo sirve cuando podés restaurarla; no basta con ver un archivo. Probá acceso en tu teléfono y computadora antes de depender del tablero. El kit no registra una segunda passkey independiente desde el panel; puede usarse la sincronizada o el mecanismo compatible del proveedor. Recuperar por CLI revoca todo. La infraestructura también debe tener MFA y permisos mínimos. Nada de esto promete seguridad absoluta.

## 22. Una instalación que puedas comprobar

Guía: 23:15 · 45 segundos.

Bien, el primer resultado no es tener todos los indicadores. Es poder mostrar una pregunta, una fuente que la responde y una prueba que sostiene el número. El taller les deja los pasos, los prompts y el diagnóstico de errores. Empiecen con la demo, definan el negocio, cierren el acceso y conecten una fuente. Después amplían. Y sobre UTMify: si hoy lo usan para una función que este kit no tiene, lo mantienen hasta resolverla. El que decide sos vos, con evidencia de tu operación. Abrí el taller y dejá que cada alumno elija su primera pregunta.

