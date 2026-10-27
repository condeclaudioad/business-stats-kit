# Construcción guiada: de la copia al dashboard propio

Esta es la secuencia canónica para Claude Code, Codex y quien siga los pasos manualmente. No hace falta reconstruir la app: adaptá el código existente. Leé primero el estado de la instalación y retomá desde la primera etapa incompleta. Los comandos se ejecutan **desde la raíz de tu copia**, donde está `package.json`.

## 0. Identificar la copia y conservar lo existente

Inspeccioná `git status --short`, rama, remoto y archivos de configuración **sin imprimir secretos**. Si ya existe una instalación, conservá sus cambios, `.env.local`, base y decisiones; no vuelvas a crear el dueño ni resetees acceso para empezar de cero.

Si sólo tenés el enlace, creá una copia con **Use this template** en GitHub, preferentemente privada, y cloná esa copia. Para explorar también podés clonar el template en una carpeta nueva, pero su remoto seguirá apuntando al repositorio original: antes de publicar cambios, elegí tu propio repositorio. No sobrescribas una carpeta existente ni empujes cambios al repo de la clase.

**Salida:** ruta real, rama, remoto propio o pendiente, instalación nueva/existente y siguiente etapa. Si el agente no tiene terminal/archivos, debe decirlo y dar los comandos; no afirmar que instaló por leer el enlace.

## 1. Arrancar la demo sin fuentes reales

Requisitos: Git, Node.js compatible con `package.json` y npm. En una copia nueva:

```bash
npm ci
npm run demo:setup
npm run doctor
npm run dev
```

Abrí `http://localhost:4321`. La página debe mostrar **DEMO** y datos ficticios. `demo:setup` conserva un `.env.local` existente: no garantiza que su modo sea demo. Si la copia ya está en live, no cambies su modo a demo como reparación; usá una copia de prueba separada cuando haga falta experimentar.

**Salida:** demo navegable, diagnóstico sin errores de configuración y ninguna clave necesaria. Si falta Git/Node o falla la instalación, resolver ese requisito antes de editar el diseño.

## 2. Delimitar una oferta y sus métricas

Pedí sólo lo que falte: nombre, moneda, zona horaria, oferta prioritaria, pasarela, publicidad, producto y email. Una cuenta puede contener varios negocios; la pertenencia se prueba por IDs, no por importes ni descripciones.

Elegí una receta: [SaaS](recipes/saas.md), [curso](recipes/course.md), [PDF](recipes/pdf.md) o [servicios](recipes/services.md). Para cada tarjeta definí pregunta, fórmula, unidad, fuente, rango, alcance y exclusiones. Clasificá cada necesidad como **incluida**, **requiere adaptación** o **no necesaria**.

Guardá la ficha en `.local/business.md`, ignorado por Git, sin contraseñas, tokens ni datos personales. Antes de escribir, comprobá `git check-ignore .local/business.md`; si el archivo ya estuviera versionado, ignorarlo no lo retira del historial: elegí una ubicación privada fuera del checkout y corregí esa exposición antes de publicar. Incluí decisiones, etapa actual, pruebas y pendientes para poder reanudar. No uses `docs/business.md` del template para publicar detalles del negocio. `business.config.ts` contiene la configuración necesaria del servidor; no agregues secretos y revisá su visibilidad antes de publicar tu copia.

Configurá `business.config.ts` con el nombre, moneda, zona y los IDs de productos/campañas confirmados. Dejá vacías las listas de fuentes que no uses; no inventes IDs para pasar el diagnóstico.

**Salida:** una oferta concreta y ficha recuperable, con diferencia explícita entre decidido, configurado y verificado. Mercado Pago, Resend nativo, atribución UTM y avisos no se vuelven funcionalidades disponibles por nombrarlos.

## 3. Elegir diseño y adaptar con datos sintéticos

Usá [la galería](designs.md) y `stats-design`. Elegí una de las cinco apariencias antes de construir otra. Ajustá marca, jerarquía y tarjetas conservando fuentes, definiciones, datos ausentes y cobertura. El embudo de ejemplo funciona sólo en demo: no conectarlo a valores inventados en live.

Probá escritorio y móvil, navegación, filtros, errores, valores largos y cierre de sesión cuando corresponda. No cambies fórmulas para acomodarlas a una maqueta.

**Salida:** diseño elegido y capturas sintéticas. Modificar apariencia no acredita una integración ni autoriza consultar cuentas reales.

## 4. Preparar cada fuente o desarrollar el adaptador faltante

Consultá [integraciones](integrations.md). Para Stripe/Meta y los imports existentes, usá `stats-connect-sources`; para otro proveedor o una métrica nueva, `stats-adapter`.

Antes de conectar una API, definí contrato y fixtures sintéticas: ID estable, pertenencia, estado, moneda, fecha, deduplicación, paginación y cobertura. No importar los archivos de `examples/` en una base real. Producto/email requieren `source`, `coverage: {from, to}` y eventos; ese contrato no admite pagos. Un adaptador de ventas necesita su propio cálculo y tratamiento de reembolsos.

**Salida:** fuente incluida identificada o adaptador implementado y probado con fixtures. Si sólo hay mocks, marcar **pendiente de conexión y conciliación**, sin mostrar “conectado”. Si falta una credencial, el agente puede terminar el código y las pruebas sintéticas.

## 5. Preparar base y elegir el origen

Seguí [seguridad](security.md). Elegí una base dedicada y el origen exacto antes de registrar la passkey. Hay dos recorridos distintos:

| Recorrido | Origen y base | Dónde registrar la passkey |
|---|---|---|
| Prueba local de acceso | `http://localhost:4321` y base de prueba independiente | En ese mismo origen local |
| Instalación definitiva | Dominio HTTPS estable y base definitiva | En el dominio definitivo, después de que sirva la app |

No alternes `localhost` y `127.0.0.1`: son orígenes distintos. Una passkey registrada en localhost no migra automáticamente al dominio final. No uses un preview efímero como origen permanente ni desactives validaciones para hacerlo funcionar.

El dueño carga en privado `APP_MODE=live`, `APP_ORIGIN` y `DATABASE_URL` en `.env.local`; en remoto exige TLS verificado. Después:

```bash
npm run doctor
npm run db:setup
```

Todavía no generes el bootstrap para dejarlo vencer mientras preparás el hosting. En una instalación existente, conservá el dueño y su acceso; no ejecutar reset para reanudar el trabajo.

**Salida:** base dedicada, esquema de eventos y configuración válida del origen elegido. Esto no prueba una sesión ni los permisos de los proveedores.

## 6. Verificar, poner la app en el origen elegido y completar el acceso

```bash
npm test
npm run typecheck
npm run build
```

Detené el servidor que usa `.next` antes del build. Los tests PostgreSQL pueden omitirse sin sus variables: informá esa omisión. Para navegador, seguí el README (`npm run test:browser`); las pruebas destructivas sólo usan bases descartables. No apuntes variables de test a la base del negocio.

Para prueba local, `npm start` sirve la app en el puerto 4321; abrí el origen local exacto elegido. Para producción, seguí [Vercel](deploy-vercel.md) o el hosting elegido, con variables privadas, HTTPS y un dominio estable. Publicá únicamente dentro del destino y alcance autorizados. Si falta autorización para publicar, entregá código/checks/configuración revisables y dejá la ceremonia final pendiente; no frenes trabajo local ya autorizado ni simules la prueba final desde localhost.

Cuando `/login` ya esté disponible en ese origen y el dueño pueda completar el alta, ejecutá en la terminal privada:

```bash
npm run auth:setup
npm run doctor -- --database
```

`auth:setup` pide usuario/contraseña y guarda `.auth-bootstrap` local. El token vence en 30 minutos: generarlo inmediatamente antes de la ceremonia evita que caduque durante el despliegue. No ejecutar `auth:setup` ni `--reset` como parte del build. En una instalación existente, reutilizá su acceso; recuperación es un procedimiento separado que revoca sesiones y passkeys.

Completá la ceremonia física en `/login` del origen elegido y borrá `.auth-bootstrap` al terminar. Verificá la API sin sesión, login, logout, un nuevo login y el dispositivo que usarás. `doctor -- --database` sólo comprueba esquema/dueño: no registra ni prueba la passkey. Un preview demo no demuestra la seguridad de producción.

**Salida:** commit/URL elegidos y acceso observado en ese origen. Diferenciá prueba local de dominio/dispositivo definitivo. Un build exitoso o un error de configuración no prueban seguridad. Sin acceso final probado, todavía no conectar datos privados a ese deployment.

## 7. Conectar una fuente y conciliarla

Con acceso ya protegido, el dueño incorpora claves de lectura en variables privadas del servidor. No deben aparecer en prompts, frontend, commits ni capturas. Reiniciá el proceso local después de cambiar variables; en Vercel los cambios se aplican a un nuevo deployment.

Para imports, confirmá la base de destino y la cobertura del archivo antes de `npm run data:import -- /ruta/privada/archivo.json`. Siete días no certifican noventa. Para API, comprobá permisos, paginación completa, moneda/zona y scope exacto.

Usá `stats-reconcile` y [la receta de conciliación](recipes/reconciliation.md) para un día cerrado: mismos IDs, período y definición. Explicá diferencias por registros/reglas, no ajustando la fórmula hasta que dé igual. Conservá evidencia financiera fuera del repositorio público.

**Salida:** una fuente conciliada o diferencia pendiente con causa y próximo paso. Repetí esta etapa por fuente; una fuente que falla debe mostrar error o `—`, no cero inventado.

## 8. Dejar una instalación mantenible

Documentá responsable, frecuencia de actualización, fecha de conciliación, backups/restauración, cuotas, permisos y recuperación. Usá `stats-maintenance` para fallos concretos. Actualizar la UI no garantiza datos nuevos: Stripe/Meta tienen caché por proceso y producto/email dependen de imports o sincronización manual.

La entrega final distingue **implementado**, **probado con fixtures**, **verificado en cuenta real** y **pendiente**. No cerrar con “todo listo” si falta passkey definitiva, conciliación o restauración. Tampoco repetir fases ya verificadas sin un cambio que lo justifique.
