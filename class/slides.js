window.DECK = [
  {
    "chapter": "Tu negocio, tus datos",
    "title": "Tu dashboard de negocio",
    "kind": "lesson hero-lesson",
    "seconds": 45,
    "html": "<div><span class=\"eyebrow\">CLASE PRÁCTICA · CLAUDIO CONDE</span><h1>Tu negocio.<br>Tus datos.<br><em>Tu dashboard.</em></h1><p class=\"intro\">Cómo instalarlo, adaptarlo y saber<br>cuándo te sirve hacerlo por tu cuenta.</p></div><div class=\"hero-machine\"><div class=\"orbit\"></div><div class=\"orbit two\"></div><div class=\"mini-dashboard\"><div class=\"mhead\"><b>Mi negocio</b><span>DEMO</span></div><div class=\"mini-grid\"><div>Ventas<small>Qué pasó</small></div><div>Producto<small>Qué usan</small></div><div>Email<small>Qué hacen</small></div></div><div class=\"bars\"><i style=\"--h:20%\"></i><i style=\"--h:40%\"></i><i style=\"--h:33%\"></i><i style=\"--h:65%\"></i><i style=\"--h:51%\"></i><i style=\"--h:76%\"></i><i style=\"--h:68%\"></i><i style=\"--h:92%\"></i><i style=\"--h:80%\"></i><i style=\"--h:100%\"></i></div></div><span class=\"orbit-label ol1\">Marketing</span><span class=\"orbit-label ol2\">Ventas</span><span class=\"orbit-label ol3\">Producto</span><span class=\"orbit-label ol4\">Email</span><span class=\"demo-tag\">Ilustración conceptual · sin datos reales</span></div>",
    "notes": "Familia, hoy vamos a usar un proyecto que ya tiene el tablero, el acceso y las instrucciones para adaptarlo. La idea es que ustedes entiendan qué están instalando y sepan comprobar sus números. No alcanza con que se vea bonito. Vamos a ver lo que suma, lo que exige y la pregunta importante: si con esto podés dejar de pagar UTMify. La respuesta depende de para qué lo usás. Esta presentación propone una explicación de unos 24 minutos; la instalación y los permisos de cada cuenta se trabajan después, sin prometer un tiempo fijo.",
    "start": 0
  },
  {
    "chapter": "El resultado",
    "title": "Cuatro áreas, decisiones concretas",
    "kind": "lesson",
    "html": "<h2>Primero, la pregunta.<br><em>Después, la métrica.</em></h2><div class=\"body\"><div class=\"columns\"><div class=\"rows\"><div class=\"row\"><b>Marketing</b><span>¿Dónde estoy invirtiendo?</span></div><div class=\"row\"><b>Ventas</b><span>¿Qué facturas se saldaron?</span></div></div><div class=\"rows\"><div class=\"row\"><b>Producto</b><span>¿Llegan al primer resultado?</span></div><div class=\"row\"><b>Email</b><span>¿Hacen clic después de recibir?</span></div></div></div></div><div class=\"foot\">Elegí una decisión que quieras tomar esta semana.</div>",
    "notes": "Bien, no empezamos diciendo quiero cincuenta métricas. Empezamos con una decisión. Si el problema es que los clientes no usan el producto, mirar solamente ventas no lo resuelve. Si querés saber qué anuncio generó una compra, mirar gasto y facturación juntos tampoco lo resuelve. El kit trae cuatro áreas, pero cada área tiene un alcance concreto. El objetivo es elegir una pregunta y encontrar la fuente que de verdad la responde. Ejercicio oral: que cada uno complete quiero saber si... con una decisión de su negocio.",
    "seconds": 60,
    "start": 45
  },
  {
    "chapter": "Cómo funciona",
    "title": "La pantalla es la última capa",
    "kind": "lesson inverse",
    "html": "<h2>La pantalla es<br><em>la última capa.</em></h2><div class=\"body\"><div class=\"route\"><article class=\"node\"><span class=\"num\">01</span><h3>Fuentes</h3><p>Stripe · Meta · eventos</p></article><span class=\"arrow\" aria-hidden=\"true\">→</span><article class=\"node\"><span class=\"num\">02</span><h3>Datos</h3><p>Filtrar · ordenar · conciliar</p></article><span class=\"arrow\" aria-hidden=\"true\">→</span><article class=\"node\"><span class=\"num\">03</span><h3>Acceso</h3><p>Contraseña + passkey</p></article><span class=\"arrow\" aria-hidden=\"true\">→</span><article class=\"node\"><span class=\"num\">04</span><h3>Dashboard</h3><p>Mostrar lo comprobado</p></article></div></div><div class=\"foot\">Una instalación por negocio. Las credenciales quedan en el servidor.</div>",
    "notes": "Mostrá el recorrido de izquierda a derecha. Stripe y Meta son fuentes externas. Producto y email entran por eventos propios o importaciones. Postgres conserva autenticación y eventos; el servidor lee, filtra y calcula. El navegador recibe agregados. La contraseña y la passkey protegen el acceso del dueño, pero no deciden qué significa cada número. Son dos problemas distintos. Esta versión es para un dueño por instalación, no un SaaS para repartir usuarios de distintos negocios. Si agregás equipos, necesitás diseñar permisos y aislamiento; no alcanza con poner otro formulario de registro.",
    "seconds": 60,
    "start": 105
  },
  {
    "chapter": "Pros y contras",
    "title": "Lo que ganás y lo que asumís",
    "kind": "lesson",
    "html": "<h2>Más control.<br><em>Más responsabilidad.</em></h2><div class=\"body\"><div class=\"columns\"><article class=\"sheet\"><h3>Lo que ganás</h3><div class=\"rows\"><div class=\"row\"><b>Tu pregunta</b><span>Métricas adaptadas</span></div><div class=\"row\"><b>Tu código</b><span>Podés modificarlo</span></div><div class=\"row\"><b>Tu producto</b><span>Eventos que te importan</span></div></div></article><article class=\"sheet\"><h3>Lo que asumís</h3><div class=\"rows\"><div class=\"row\"><b>Mantenimiento</b><span>APIs y dependencias</span></div><div class=\"row\"><b>Operación</b><span>Accesos y backups</span></div><div class=\"row\"><b>Medición</b><span>Comprobar cada fuente</span></div></div></article></div></div><div class=\"foot\">Tener el código no vuelve correctos los datos automáticamente.</div>",
    "notes": "“Claudio, entonces me lo hago con IA y listo”. La IA puede adelantarte mucho código, pero alguien tiene que comprobarlo y mantenerlo. Ganás control sobre lo que medís y sobre cómo lo mostrás. Podés incorporar una acción que solo existe en tu producto. A cambio, te hacés cargo de cambios de APIs, permisos, respaldos y fallos. El código es tuyo; las cuentas externas siguen teniendo sus condiciones y costos. Si no querés atender esa operación, una herramienta administrada puede ser la mejor decisión. No se trata de construir todo porque ahora se puede.",
    "seconds": 60,
    "start": 165
  },
  {
    "chapter": "Costo real",
    "title": "Gratis el código no es gratis la operación",
    "kind": "lesson",
    "html": "<h2>El código es abierto.<br><em>La operación cuesta.</em></h2><div class=\"body\"><div class=\"formula\"><div class=\"term\">Infraestructura<small>Hosting · base · dominio</small></div><span class=\"operator\">+</span><div class=\"term\">Consumo<small>APIs · eventos · IA</small></div><span class=\"operator\">+</span><div class=\"term\">Tu tiempo<small>Implementar · mantener</small></div></div></div><div class=\"foot\">Compará el costo total con tu factura actual, en la misma moneda.</div>",
    "notes": "El repositorio tiene licencia MIT. Eso no significa costo total cero. Puede haber hosting, base, dominio, consumo de fuentes o herramientas de IA y tiempo de mantenimiento. No voy a poner un precio universal porque depende de región, volumen, plan e impuestos. En la guía del taller hay una cuenta para completar con tus costos reales. Si ahorrás una suscripción pero invertís más tiempo del que te sirve, el ahorro no era tan claro. Tampoco confundas un plan gratuito con una garantía de que seguirá alcanzando cuando crezca el negocio.",
    "seconds": 60,
    "start": 225
  },
  {
    "chapter": "Lo imprescindible",
    "title": "Cuatro números que no son lo mismo",
    "kind": "lesson",
    "html": "<h2>No mezcles<br><em>cosas distintas.</em></h2><div class=\"body\"><div class=\"rows\"><div class=\"row\"><b>Factura saldada</b><span>Estado de una factura; no prueba caja bancaria</span></div><div class=\"row\"><b>MRR de catálogo</b><span>Valor mensual de suscripciones activas</span></div><div class=\"row\"><b>Beneficio</b><span>Requiere costos, comisiones y devoluciones</span></div><div class=\"row\"><b>ROAS atribuido</b><span>Requiere unir una venta con su anuncio</span></div></div></div><div class=\"foot\">La etiqueta de la tarjeta tiene que respetar su definición.</div>",
    "notes": "Este es uno de los puntos que sí o sí tienen que saber. Hoy el conector Stripe lee facturas saldadas del catálogo permitido. Una factura puede quedar pagada por un pago externo o por créditos; no lo vamos a llamar dinero recibido en el banco. El MRR es nominal, a precio de lista, y no incluye todos los descuentos. Tampoco es caja. Para beneficio faltan costos, comisiones y devoluciones. Y para ROAS por anuncio falta una unión entre el anuncio y el pago. Que dos números estén al lado no demuestra esa relación. Abrí Cómo se mide en la demo y mostrá la definición.",
    "seconds": 75,
    "start": 285
  },
  {
    "chapter": "Lo imprescindible",
    "title": "Cada número necesita contexto",
    "kind": "lesson",
    "html": "<h2>Un número sin contexto<br><em>te puede engañar.</em></h2><div class=\"body\"><div class=\"checklist\"><div class=\"check\"><div><b>Fuente</b><span>De dónde salió</span></div></div><div class=\"check\"><div><b>Período y zona</b><span>Qué días está contando</span></div></div><div class=\"check\"><div><b>Alcance</b><span>Qué negocio, productos y campañas</span></div></div><div class=\"check\"><div><b>Cobertura</b><span>Qué falta y qué tan reciente es</span></div></div></div></div><div class=\"foot\">Última lectura reciente no significa historia completa. “—” no es cero.</div>",
    "notes": "Imaginen que importo siete días de eventos y después miro noventa días. El tablero no debería decir que cubre noventa porque terminé de importar hace un minuto. Necesitamos saber la ventana que se leyó, no solo la hora de ejecución. Lo mismo con una cuenta Meta que falla: no podemos esconderla y mostrar la suma de las demás como si estuviera completa. Para comparar fuentes, igualamos moneda, zona horaria, fechas y filtros. Si falta información, la marcamos. Cero significa que pudimos medir y el resultado fue cero; un guion significa que no tenemos una respuesta confiable para esa métrica.",
    "seconds": 60,
    "start": 360
  },
  {
    "chapter": "Atribución",
    "title": "Lo que falta entre un clic y una venta",
    "kind": "lesson inverse",
    "html": "<h2>Un clic y una venta<br><em>necesitan un vínculo.</em></h2><div class=\"body\"><div class=\"route\"><article class=\"node\"><span class=\"num\">01</span><h3>Anuncio</h3><p>Campaña + ad ID + UTMs</p></article><span class=\"arrow\" aria-hidden=\"true\">→</span><article class=\"node\"><span class=\"num\">02</span><h3>Visita</h3><p>Conservar origen e identidad</p></article><span class=\"arrow\" aria-hidden=\"true\">→</span><article class=\"node\"><span class=\"num\">03</span><h3>Checkout</h3><p>Pasar esa evidencia al pago</p></article><span class=\"arrow\" aria-hidden=\"true\">→</span><article class=\"node\"><span class=\"num\">04</span><h3>Venta</h3><p>Conciliar ID y estado real</p></article></div></div><div class=\"foot\">Este kit todavía no implementa ese recorrido completo.</div>",
    "notes": "Acá está la diferencia entre un tablero y un sistema de atribución. Necesitás capturar el origen, conservarlo al navegar, llevarlo al checkout y unirlo con el pago exacto. Además tenés devoluciones, duplicados, dispositivos distintos y eventos que no llegaron. No vale unir por nombre, por un importe parecido o porque pasaron cinco minutos. Este kit no trae hoy un capturador UTM completo ni ese recorrido ad a venta. Tampoco envía pixel o CAPI. Si ustedes dependen de eso para decidir campañas, la pantalla de estadísticas por sí sola no lo reemplaza.",
    "seconds": 75,
    "start": 420
  },
  {
    "chapter": "UTMify",
    "title": "¿Podés dejar de pagar UTMify?",
    "kind": "lesson",
    "html": "<h2>¿Dejar UTMify?<br><em>Hoy, no por instalar esto.</em></h2><div class=\"body\"><table class=\"matrix\"><thead><tr><th>Necesidad</th><th>Este kit</th><th>Decisión</th></tr></thead><tbody><tr><td>Tablero propio de negocio</td><td>Sí, con fuentes configuradas</td><td>Puede cubrir esa parte</td></tr><tr><td>Venta atribuida a un anuncio</td><td>No está implementado</td><td>Conservá esa capa</td></tr><tr><td>Pixel / envío de conversiones</td><td>No está implementado</td><td>No lo retires sin reemplazo</td></tr><tr><td>Producto y email a medida</td><td>Eventos e importaciones</td><td>Es su ventaja práctica</td></tr></tbody></table></div><div class=\"foot\">UTMify declara funciones de tracking; no es solamente su dashboard.</div>",
    "notes": "La respuesta corta es que no recomiendo cancelar UTMify solo por instalar este kit. Si lo usás únicamente para mirar un resumen y no dependés de su tracking, este proyecto puede cubrir parte de ese trabajo después de conciliar los datos. Si dependés de atribución, scripts, integración con tu checkout o envío de conversiones, todavía falta construir y verificar esa capa. La web y la ayuda oficial de UTMify describen tracking e integraciones. No estamos certificando toda su implementación interna ni prometiendo que rastree todas las ventas. La comparación completa, con fecha y fuentes, está en docs/utmify.md. No presentar precios con símbolo $ como dólares si la moneda no está confirmada.",
    "seconds": 75,
    "start": 495
  },
  {
    "chapter": "UTMify",
    "title": "La prueba antes de cancelar",
    "kind": "lesson",
    "html": "<h2>Primero comprobás.<br><em>Después decidís.</em></h2><div class=\"body\"><div class=\"checklist\"><div class=\"check\"><div><b>Anotá lo que usás</b><span>Reportes · scripts · integraciones</span></div></div><div class=\"check\"><div><b>Probá en paralelo</b><span>Mismas fechas y mismas reglas</span></div></div><div class=\"check\"><div><b>Resolvé las diferencias</b><span>Pago · atribución · devolución</span></div></div><div class=\"check\"><div><b>Prepará la salida</b><span>Histórico · rollback · responsables</span></div></div></div></div><div class=\"foot\">Sin reemplazo probado para una función crítica, mantené esa función.</div>",
    "notes": "La cancelación es una decisión operativa, no el premio por terminar la clase. Primero hagan inventario: qué reportes consultan y qué scripts o webhooks dependen del servicio. Después comparen durante una ventana representativa de su ciclo de ventas; no voy a inventar una cantidad universal de días. Incluyan devoluciones, renovaciones y pagos tardíos que les apliquen. Documenten por qué difiere cada total. Antes de sacar algo, exporten lo que permita el proveedor, sepan qué van a perder y tengan una forma de volver. Si falta atribución crítica, conservan esa herramienta o construyen el reemplazo y lo prueban. No cancelamos nada en esta clase.",
    "seconds": 60,
    "start": 570
  },
  {
    "chapter": "Instalación",
    "title": "Dos modos, dos objetivos",
    "kind": "lesson",
    "html": "<h2>Primero una demo.<br><em>Después, tu instalación.</em></h2><div class=\"body\"><div class=\"columns\"><article class=\"sheet\"><h3>DEMO</h3><p class=\"big\">Ver y aprender</p><p>Datos ficticios.<br>Sin cuentas conectadas.<br>Podés probar los tres estilos.</p></article><article class=\"sheet\"><h3>LIVE</h3><p class=\"big\">Medir tu negocio</p><p>Base dedicada.<br>Contraseña + passkey.<br>Fuentes y permisos propios.</p></article></div></div><div class=\"foot\">Nunca uses datos ficticios para disimular que una fuente real falló.</div>",
    "notes": "La demo existe para aprender sin tocar cuentas ni introducir credenciales. Es el primer hito de todos. El modo live es una instalación distinta en cuanto a configuración y obligaciones: necesita base, dueño, passkey y fuentes. Si algo falla en live, se muestra el fallo o se bloquea; no cambiamos a demo silenciosamente. Tampoco quitamos la seguridad para que deje de dar error. Local significa que está corriendo en tu computadora. Publicado significa que lo dejaste en un servidor y lo verificaste en su dominio. Son estados distintos.",
    "seconds": 45,
    "start": 630
  },
  {
    "chapter": "Instalación",
    "title": "De GitHub al primer tablero",
    "kind": "lesson",
    "html": "<h2>Tu primera instalación,<br><em>sin claves reales.</em></h2><div class=\"body\"><div class=\"columns\"><div><p class=\"subhead\">1. Use this template → tu repo</p><p class=\"subhead\">2. Clonalo y abrí esa carpeta</p><p class=\"subtitle\">Git · Node 22.22+ compatible · npm<br>Claude Code o Codex</p><div class=\"linkbar\"><a href=\"https://github.com/condeclaudioad/business-stats-kit\" target=\"_blank\" rel=\"noopener\">Abrir repositorio ↗</a></div></div><pre class=\"codebox\">npm ci\nnpm run demo:setup\nnpm run doctor\nnpm run dev<small>Abrí http://localhost:4321\ndemo:setup no sobrescribe tu configuración</small></pre></div></div><div class=\"foot\">Ver la etiqueta DEMO es el resultado esperado de este paso.</div>",
    "notes": "Mostrá Use this template en GitHub y elegí una copia propia. No hay que trabajar sobre el repositorio del instructor. Cloná esa copia, abrí la carpeta en el editor y comprobá Node y npm. Los comandos están copiados en el taller y son iguales en Windows, macOS y Linux. npm ci instala las versiones del lockfile. demo:setup crea la configuración de demo si no existe. doctor revisa configuración sin imprimir secretos. npm run dev arranca el servidor local; esa terminal debe seguir abierta mientras lo usás. Abrí localhost:4321 y confirmá que dice demo. Si el puerto está ocupado, cerrá el proceso que vos abriste o elegí otro puerto y conservá el origen coherente cuando pases a live. El taller incluye diagnóstico de fallos.",
    "seconds": 90,
    "start": 675
  },
  {
    "chapter": "Tu negocio",
    "title": "Definí qué entra y qué queda afuera",
    "kind": "lesson",
    "html": "<h2>Primero delimitá<br><em>tu negocio.</em></h2><div class=\"body\"><div class=\"columns\"><article class=\"sheet\"><h3>business.config.ts</h3><div class=\"rows\"><div class=\"row\"><b>Nombre</b><span>Cómo lo vas a identificar</span></div><div class=\"row\"><b>Moneda y zona</b><span>Una política coherente</span></div><div class=\"row\"><b>Stripe</b><span>Productos permitidos</span></div><div class=\"row\"><b>Meta</b><span>Cuentas + campañas exactas</span></div></div></article><div><p class=\"question\">Una cuenta puede cobrar<br>varios negocios.</p><p class=\"subtitle\">El importe o el nombre del pago<br>no prueban a cuál pertenece.</p><div class=\"statusline\"><div>Incluido<small>Evidencia exacta</small></div><div>Fuera<small>Otro alcance</small></div><div>Sin resolver<small>No adivinar</small></div></div></div></div></div><div class=\"foot\">Los IDs son configuración. Las claves no van en este archivo.</div>",
    "notes": "Abrí business.config.ts. Ustedes completan nombre, moneda, zona y los productos/campañas de su negocio. Lo que parece una configuración menor define qué números entran. Una misma cuenta de pagos puede cobrar varias ofertas o negocios. No filtren por descripción o por un monto que les parece suyo. Necesitamos productos e IDs exactos. En Meta, si crean una campaña nueva, deben incorporarla al scope luego de comprobarla. No mezclen monedas ni conviertan con una tasa inventada. El kit soporta un conjunto explícito de monedas de dos decimales; si su moneda no está incluida, hay que ampliar la política y sus pruebas antes de usarla.",
    "seconds": 75,
    "start": 765
  },
  {
    "chapter": "Seguridad",
    "title": "Dos pasos, una sesión privada",
    "kind": "lesson",
    "html": "<h2>La contraseña<br><em>no abre sola.</em></h2><div class=\"body\"><div class=\"route\"><article class=\"node\"><span class=\"num\">01</span><h3>Preparar</h3><p>Base dedicada + origen exacto</p></article><span class=\"arrow\" aria-hidden=\"true\">→</span><article class=\"node\"><span class=\"num\">02</span><h3>Alta privada</h3><p>auth:setup + token temporal</p></article><span class=\"arrow\" aria-hidden=\"true\">→</span><article class=\"node\"><span class=\"num\">03</span><h3>Passkey</h3><p>Huella, rostro o PIN local</p></article><span class=\"arrow\" aria-hidden=\"true\">→</span><article class=\"node\"><span class=\"num\">04</span><h3>Sesión</h3><p>API también comprueba acceso</p></article></div></div><div class=\"foot\">No hay registro público. La passkey no envía tu cara ni tu huella al servidor.</div>",
    "notes": "Este paso se hace fuera de la grabación de pantalla de secretos. Preparás Postgres dedicado y configurás APP_MODE live, DATABASE_URL y APP_ORIGIN del lado servidor. Ejecutás npm run db:setup para el esquema de eventos y npm run auth:setup en terminal privada: pide usuario y contraseña sin eco. Genera un token temporal en .auth-bootstrap, que usás en el primer login para registrar la passkey. Después borrás ese archivo. El dispositivo puede pedir cara, huella o PIN; el servidor verifica una firma. Contraseña sola no debe devolver datos. Si perdés acceso, el reset por CLI requiere controlar la infraestructura y revoca sesiones y passkeys anteriores. No hay un botón mágico que saltee el segundo factor.",
    "seconds": 75,
    "start": 840
  },
  {
    "chapter": "Seguridad",
    "title": "Dónde van las claves",
    "kind": "lesson inverse",
    "html": "<h2>La clave queda<br><em>del lado del servidor.</em></h2><div class=\"body\"><div class=\"bridge\"><article class=\"sheet\"><h3>Servidor</h3><p>Variables privadas<br>Permisos de lectura mínimos<br>Conexión a base protegida</p></article><span class=\"arrow\">→</span><article class=\"sheet\"><h3>Navegador</h3><p>Sesión validada<br>Agregados necesarios<br>Sin claves ni datos personales extra</p></article></div></div><div class=\"foot\">No pegues secretos en prompts, screenshots, código público ni variables públicas.</div>",
    "notes": "Las claves no van en business.config ni en un prompt al agente. Van en .env.local o en el gestor de secretos del hosting. Nunca con prefijos que las lleven al cliente. Para leer estadísticas, la integración no necesita permiso para cobrar, reembolsar o modificar campañas. Usá el mínimo de lectura que el proveedor permita. La base de estadísticas se separa de la que cobra a tus clientes. Y no pienses que tener passkey protege una clave de base que publicaste en GitHub: son riesgos distintos. Si exponés un secreto, se rota; borrarlo del último archivo no lo elimina del historial.",
    "seconds": 45,
    "start": 915
  },
  {
    "chapter": "Conectar fuentes",
    "title": "Una fuente por vez",
    "kind": "lesson",
    "html": "<h2>Conectá una.<br><em>Comprobala. Seguís.</em></h2><div class=\"body\"><table class=\"matrix\"><thead><tr><th>Fuente</th><th>Qué conecta este kit</th><th>Qué verificás</th></tr></thead><tbody><tr><td>Stripe</td><td>Facturas + suscripciones del catálogo</td><td>Productos, fechas y estados</td></tr><tr><td>Meta</td><td>Gasto y clics de campañas elegidas</td><td>Permisos, moneda y zona</td></tr><tr><td>Producto</td><td>JSON o lectura de PostHog</td><td>Evento de valor e identidad</td></tr><tr><td>Email</td><td>JSON de entregas y clics</td><td>ID de mensaje y primera entrega</td></tr></tbody></table></div><div class=\"foot\">Leer desde una API no es enviar pagos, anuncios o emails.</div>",
    "notes": "No conecten cuatro fuentes al mismo tiempo y después intenten adivinar cuál está mal. Empiecen por una y comparen un período contra el origen. Stripe necesita su catálogo. Meta requiere token, versión de API y scope. Producto tiene importación y un comando PostHog; sus nombres de eventos deben mapearse al contrato. Email todavía requiere adaptar un exportador de su proveedor. El kit no manda campañas ni emails. La guía de integraciones describe permisos y límites. Un comando implementado no prueba los permisos de la cuenta de cada alumno; por eso ese contraste forma parte de la instalación.",
    "seconds": 75,
    "start": 960
  },
  {
    "chapter": "Conectar fuentes",
    "title": "Los eventos necesitan un contrato",
    "kind": "lesson",
    "html": "<h2>Un evento tiene<br><em>identidad y fecha.</em></h2><div class=\"body\"><div class=\"columns\"><pre class=\"codebox\">id: \"curso:accion-001\"\nkind: \"product.activated\"\nsubject_id: \"usuario-pseudonimo\"\noccurred_at: \"...Z\"<small>Ejemplo ficticio · campos canónicos</small></pre><div><div class=\"rows\"><div class=\"row\"><b>Mismo ID, mismo dato</b><span>No duplicar</span></div><div class=\"row\"><b>Mismo ID, otro dato</b><span>Revisar el conflicto</span></div><div class=\"row\"><b>Solo siete días</b><span>No declarar noventa</span></div><div class=\"row\"><b>Importación reciente</b><span>No prueba exhaustividad</span></div></div></div></div></div><div class=\"foot\">coverage: {from, to} · inicio incluido, fin excluido · ventana completa exportada.</div>",
    "notes": "La importación no es pegar una planilla cualquiera. Cada evento tiene un ID estable, un tipo, una identidad pseudónima y su fecha real con zona. Si reimportamos exactamente lo mismo, no debe duplicar. Si cambiamos el contenido conservando el ID, debe detenerse para que revisemos el conflicto. No cambien el ID para esconder el problema. En producto, subject_id representa usuario; en email representa mensaje, no destinatario. Y necesitamos declarar la cobertura de lo exportado. coverage contiene from y to, con inicio incluido y fin excluido; declara una ventana completa exportada, no el mínimo y máximo de los eventos que encontraste. Usen el ejemplo vigente del repo. La importación manual no instala una rutina automática.",
    "seconds": 75,
    "start": 1035
  },
  {
    "chapter": "Adaptar el negocio",
    "title": "La acción de valor cambia",
    "kind": "lesson",
    "html": "<h2>Mismo tablero.<br><em>Distinto negocio.</em></h2><div class=\"body\"><div class=\"columns three\"><article class=\"sheet\"><h3>Software</h3><p class=\"big\">Resultado</p><p>Reporte exportado.<br>Proyecto completado.</p><span class=\"capsule\">Usuario ≠ login</span></article><article class=\"sheet\"><h3>Curso</h3><p class=\"big\">Avance</p><p>Primera lección útil.<br>Ejercicio entregado.</p><span class=\"capsule\">Acceso ≠ aprendizaje</span></article><article class=\"sheet\"><h3>Servicio</h3><p class=\"big\">Entrega</p><p>Hito aceptado.<br>Trabajo completado.</p><span class=\"capsule\">Venta ≠ resultado</span></article></div></div><div class=\"foot\">Elegí una señal observable. Después adaptá el exportador.</div>",
    "notes": "Lo que entrega valor cambia según el negocio. En software podría ser un reporte exportado. En un curso, una lección o ejercicio que realmente indique avance. En servicio, un hito aceptado. Son ejemplos, no reglas universales. No llamemos activación a un login porque es el dato más fácil de conseguir. Primero definimos qué decisión vamos a tomar, elegimos la señal, ubicamos dónde existe y recién después adaptamos el exportador. Si la pasarela no es Stripe, hace falta otro conector con su conciliación; no se resuelve cambiando el logo de la tarjeta.",
    "seconds": 60,
    "start": 1110
  },
  {
    "chapter": "Modificar con IA",
    "title": "Un cambio por vez, con prueba",
    "kind": "lesson",
    "html": "<h2>Pedile el cambio.<br><em>Pedile la prueba.</em></h2><div class=\"body\"><div class=\"prompt-card\">“Leé AGENTS.md y usá <b>stats-onboarding</b>.<br>Mi negocio es [X]. Quiero medir [decisión].<br>Proponé el cambio más chico, explicá qué fuente necesita<br>y comprobá que no cambien los permisos ni los totales.”</div><div class=\"statusline\"><div>Apariencia<small>Estilo, color y texto</small></div><div>Negocio<small>Scope y definición</small></div><div>Integración<small>Contrato y conciliación</small></div></div></div><div class=\"foot\">Las skills guían al agente; no garantizan que su resultado sea correcto.</div>",
    "notes": "Abrí la carpeta del proyecto con Claude Code o Codex y usá las skills incluidas. Distingan tres tipos de cambio. Apariencia: color, tipografía, orden. Negocio: qué productos o campañas cuentan y cómo se define una métrica. Integración: de qué fuente sale y cómo se transforma. Cada uno necesita una prueba distinta. Un cambio visual no debería tocar permisos ni modificar una fórmula. Antes de un cambio importante, guardá una versión en Git. Pedí una diferencia concreta y comprobable, no hacelo mejor. Los prompts completos para cada caso están en el taller, listos para copiar.",
    "seconds": 75,
    "start": 1170
  },
  {
    "chapter": "Comprobar",
    "title": "Un día cerrado y un caso difícil",
    "kind": "lesson",
    "html": "<h2>El número tiene<br><em>que poder explicarse.</em></h2><div class=\"body\"><div class=\"checklist\"><div class=\"check\"><div><b>Elegí el período</b><span>Día cerrado · misma zona · mismos filtros</span></div></div><div class=\"check\"><div><b>Compará contra el origen</b><span>Importes, conteos y exclusiones</span></div></div><div class=\"check\"><div><b>Probá un caso difícil</b><span>Duplicado · dato tardío · otra cuenta</span></div></div><div class=\"check\"><div><b>Guardá la diferencia</b><span>Causa, evidencia y próximo paso</span></div></div></div></div><div class=\"foot\">Tests + build + conciliación real. Ninguna de las tres sustituye a las otras.</div>",
    "notes": "La prueba más útil no es mirar si el gráfico sube. Elegí un día cerrado, usá las mismas fechas y filtros del proveedor y compará. Si no coincide, no ajustes la cifra a mano para que cierre. Buscá si falta una página, si la zona horaria es otra, si se incluyó otro negocio, si hubo una devolución o si la definición es distinta. Probá un duplicado y un evento tardío. Después corré tests, typecheck y build. Eso verifica código, pero no sustituye la cuenta real. Guardá la conciliación sin nombres de clientes ni secretos. Lo que no se pudo comprobar queda indicado.",
    "seconds": 75,
    "start": 1245
  },
  {
    "chapter": "Operar",
    "title": "Instalado no significa mantenido",
    "kind": "lesson",
    "html": "<h2>Lo instalaste.<br><em>Ahora hay que cuidarlo.</em></h2><div class=\"body\"><div class=\"columns\"><div class=\"rows\"><div class=\"row\"><b>Cuando cambie algo</b><span>Nuevo producto, campaña o evento</span></div><div class=\"row\"><b>Cada actualización</b><span>Tests, build y revisión de dependencias</span></div><div class=\"row\"><b>Si falla una fuente</b><span>Aviso visible, sin rellenar con ceros</span></div></div><div class=\"rows\"><div class=\"row\"><b>Backups</b><span>Probar que se restauran</span></div><div class=\"row\"><b>Acceso perdido</b><span>Recuperación que revoca lo anterior</span></div><div class=\"row\"><b>Dominio definitivo</b><span>HTTPS y passkey física probados</span></div></div></div></div><div class=\"foot\">El dueño del sistema también necesita un plan cuando algo falla.</div>",
    "notes": "La frecuencia concreta depende de tu negocio, pero hay disparadores claros: nuevo producto, nueva campaña, cambio de API o un dato que dejó de llegar. Las actualizaciones necesitan pruebas. Una copia de respaldo sirve cuando podés restaurarla; no basta con ver un archivo. Probá acceso en tu teléfono y computadora antes de depender del tablero. El kit no registra una segunda passkey independiente desde el panel; puede usarse la sincronizada o el mecanismo compatible del proveedor. Recuperar por CLI revoca todo. La infraestructura también debe tener MFA y permisos mínimos. Nada de esto promete seguridad absoluta.",
    "seconds": 75,
    "start": 1320
  },
  {
    "chapter": "Tu próximo paso",
    "title": "Una instalación que puedas comprobar",
    "kind": "lesson",
    "html": "<h2>Una pregunta.<br>Una fuente.<br><em>Una prueba.</em></h2><div class=\"body\"><p class=\"statement\">Después agregás lo demás.</p><div class=\"linkbar\"><a href=\"workshop.html\" target=\"_blank\" rel=\"noopener\">Abrir taller y prompts ↗</a><a href=\"https://github.com/condeclaudioad/business-stats-kit\" target=\"_blank\" rel=\"noopener\">Copiar el template ↗</a></div><p class=\"subtitle\">Si dependés del tracking de UTMify, mantenelo<br>hasta tener un reemplazo real y verificado.</p></div><div class=\"foot\">La entrega: demo + scope + acceso privado + una fuente conciliada.</div>",
    "notes": "Bien, el primer resultado no es tener todos los indicadores. Es poder mostrar una pregunta, una fuente que la responde y una prueba que sostiene el número. El taller les deja los pasos, los prompts y el diagnóstico de errores. Empiecen con la demo, definan el negocio, cierren el acceso y conecten una fuente. Después amplían. Y sobre UTMify: si hoy lo usan para una función que este kit no tiene, lo mantienen hasta resolverla. El que decide sos vos, con evidencia de tu operación. Abrí el taller y dejá que cada alumno elija su primera pregunta.",
    "seconds": 45,
    "start": 1395
  }
];
