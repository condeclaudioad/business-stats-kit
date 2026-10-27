# Acceso privado y operación

El kit implementa una instalación para un único dueño. En modo real pide usuario, contraseña y passkey antes de servir los datos. No tiene registro público ni gestión de equipos. Esto reduce exposición, pero no es una garantía de invulnerabilidad ni una auditoría externa.

## Preparar acceso real

1. Creá una base Postgres dedicada al dashboard. No uses la credencial propietaria de la base que procesa cobros del producto. Guardá `DATABASE_URL` en `.env.local` y solo en el servidor del hosting. Usá una conexión TLS verificada en entornos remotos.
2. Configurá `APP_MODE=live` y `APP_ORIGIN` con el origen exacto que vas a abrir, por ejemplo `https://stats.tu-dominio.example`. Para desarrollo se admite HTTP localhost. No usar un dominio efímero de preview como dominio final de passkeys.
3. Cuando la app esté disponible en el origen elegido, ejecutá `npm run auth:setup` en una terminal privada. Si vas a Vercel, seguí el orden de [publicación](deploy-vercel.md): preparar base/variables y deployment antes de generar el token temporal. La herramienta aplica `sql/auth.sql`, pide el usuario del dueño y una contraseña de al menos 14 caracteres sin mostrarla. No pases la contraseña por argumentos del shell ni la pegues en el agente.
4. La herramienta guarda el token inicial en `.auth-bootstrap`, con permisos de archivo restrictivos. Abrilo en privado y usalo en `/login` junto con usuario y contraseña. Vence en 30 minutos y sirve para el alta inicial. Borrá el archivo después de completar el alta; no lo proyectes ni lo subas.
5. Abrí `/login` en el origen exacto de `APP_ORIGIN`; no uses localhost si configuraste el dominio HTTPS final. Registrá la passkey cuando el navegador lo pida y verificá una entrada nueva. El autenticador puede usar huella, cara, PIN o el mecanismo compatible del dispositivo. El servidor recibe una prueba criptográfica, no la biometría.
6. Aplicá `db/analytics.sql` con el mismo rol de `DATABASE_URL` si vas a usar producto/email. Si se migra con un rol administrador distinto, otorgar y verificar los permisos del rol de aplicación sobre el esquema/tablas. Verificá permisos con el rol real del servidor antes de conectar proveedores.

La configuración ausente o inválida debe bloquear el modo real. La demo utiliza datos ficticios y no demuestra que la autenticación esté configurada.

## Qué protege el código

- Contraseña con scrypt; passkeys verificadas en el servidor con challenge, origen, RP ID y verificación del usuario.
- Sesiones opacas aleatorias cuyo hash vive en Postgres; duración absoluta de ocho horas. Flujos de autenticación de cinco minutos.
- Estado durable en la base, sin depender de memoria de una instancia serverless.
- Esquema privado `stats_auth` con permisos públicos revocados. El cliente web no consulta esas tablas directamente.
- Límite global de intentos de login/verificación por ventanas de 15 minutos. No confiar en un encabezado de IP enviado por un cliente para saltarlo.

El detalle exacto y sus tests están en `lib/auth/`, `sql/auth.sql` y `tests/`. Si se modifica un límite o una duración, actualizar esta guía con la implementación.

## Segundo dispositivo y recuperación

Esta versión usa una passkey registrada. Otro dispositivo puede usarla si el proveedor de passkeys la sincroniza o si admite autenticación entre dispositivos; no asumir que todas las combinaciones lo permiten. **No hay un flujo propio de invitación ni botón para registrar una segunda passkey independiente.** Probá el acceso desde los dispositivos necesarios antes de depender del tablero.

Si perdés el acceso, necesitás controlar el servidor y la base. Ejecutá:

```bash
npm run auth:setup -- --reset
```

El reset cambia las credenciales y revoca **todas las sesiones y passkeys anteriores**. Genera un nuevo token inicial y obliga a registrar la passkey otra vez. No sirve como una simple invitación a otro dispositivo. Guardá el acceso administrativo de infraestructura en un gestor seguro y protegelo también con MFA.

Si cambiás de dominio, cambia el ámbito de la passkey. Prepará la recuperación antes de mover `APP_ORIGIN`; no desactives la comprobación de origen para conservar el acceso.

## Límites que hay que conocer

El límite global protege intentos sin depender de proxies, pero un atacante puede consumir el cupo y bloquear temporalmente el login del dueño. Para una instalación expuesta con más exigencia, añadir protección de red/rate limiting en el hosting y probarla. No se incluye un registro durable completo de eventos de seguridad, alertas automáticas, gestión de equipos ni recuperación autoservicio. Los backups y su restauración dependen de la operación de la base.

El compromiso del servidor o de su `DATABASE_URL` puede comprometer datos y autenticación. Contraseña más passkey no reemplazan privilegios mínimos, actualizaciones, TLS, backups ni rotación de secretos.

## Antes y después de publicar

- Revisar `git status`, archivos versionados y bundle: no deben contener `.env.local`, `.auth-bootstrap`, claves ni registros reales. Un secreto expuesto se rota; borrarlo del último commit no basta.
- Ejecutar `npm test`, `npm run typecheck` y `npm run build`.
- En modo real, comprobar rechazo de `/api/dashboard` sin sesión y con una cookie inventada. Probar origen ajeno en rutas POST y logout; no dejar datos privados en cachés públicas.
- Completar una ceremonia WebAuthn real en el dominio final. Un test con autenticador virtual valida un flujo técnico, no confirma Face ID en el teléfono del usuario.
- Configurar variables únicamente en el servidor y comprobar permisos del rol de la base. Si usás Supabase, no exponer `stats_auth` por la Data API y revisar también los permisos de `stats`.
- Verificar nuevamente las rutas sin sesión en el deployment publicado. Conservar fecha, URL y resultado sin secretos ni PII.

Al informar, separar pruebas locales, pruebas con mocks, autenticador virtual y verificación real del dueño. Nunca convertir «build exitoso» en «seguridad comprobada en producción».
