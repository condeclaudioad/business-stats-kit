# Publicar tu instalación en Vercel

Este procedimiento prepara una instalación propia. El template público no incluye hosting, base ni credenciales. No hay botón que conecte todas tus cuentas automáticamente. Conservá una copia recuperable antes de cambiar una instalación existente.

## Preparar y revisar

1. Creá tu copia privada del template y elegí un proyecto Vercel propio. Verificá cuenta/equipo, repo y rama. El framework es **Next.js**, raíz del repo, instalación `npm ci`, build `npm run build`; no pongas `npm run dev` como comando de producción.
2. Elegí un origen HTTPS estable (tu dominio o el dominio estable asignado al proyecto). Debe coincidir exactamente con `APP_ORIGIN`, sin barra final. Las passkeys quedan vinculadas al dominio; un preview efímero no sirve como dominio permanente.
3. Prepará Postgres dedicado accesible desde Vercel, TLS con certificado verificado y permisos mínimos. Revisá conexiones máximas y pooling del proveedor. Este kit usa `pg`; no convierte automáticamente una base local en una base remota.
4. En una terminal privada, `.env.local` apunta a esa base y contiene `APP_MODE=live` y el origen definitivo. Ejecutá `npm run doctor`, `npm run db:setup` y `npm run auth:setup`. El último pide contraseña sin mostrarla y genera `.auth-bootstrap` local. **No ejecutes reset como parte del build ni en cada deploy.**
5. Cargá en el entorno **Production** de Vercel `APP_MODE=live`, `APP_ORIGIN` y `DATABASE_URL`. Agregá solo las claves de fuentes que vas a conectar. No usar prefijos `NEXT_PUBLIC_`. `.auth-bootstrap` no es variable de hosting y no se sube. No imprimir valores en logs.
6. Para Preview usá demo sin secretos o una base de prueba independiente. No compartas credenciales de producción con previews ni código de terceros. Un preview en demo es público y ficticio; no demuestra el login real.
7. Corré tests/typecheck/build. Al publicar, los cambios de variables se aplican a un nuevo deployment; verificá el entorno seleccionado. Si habilitás integración Git, sus pushes pueden generar deployments: revisá esa automatización antes de usarla.

## Comprobar antes de usar datos reales

En el dominio elegido y una ventana privada sin cookies:

```bash
curl -i https://TU-DOMINIO/api/dashboard
```

Debe devolver401 en live correctamente configurado y no incluir métricas. Un503 indica configuración incompleta: no es una instalación lista. Un200 con datos sintéticos revela modo demo; corregilo antes de conectar fuentes. Una barrera adicional de Vercel puede interceptar la petición: después de atravesarla legítimamente, verificá también la autorización propia de la app.

Entrá con tu usuario, contraseña y token inicial; registrá la passkey. Si venció el token, seguí la recuperación de [seguridad](security.md), sabiendo que reset revoca sesiones/passkeys. Borrá `.auth-bootstrap` después. Probá logout, un login nuevo y el teléfono que vas a usar. `npm run doctor -- --database` valida esquema/dueño, no una ceremonia WebAuthn.

Conectá una fuente, conciliá un día cerrado y revisá el estado y fecha de los datos. No envíes capturas privadas al repo público. Conservá un registro sin secretos: fecha, commit, dominio, tests, dispositivo probado, diferencias y persona responsable.

## Mantenimiento y recuperación

- Guardá backups fuera del servidor y probá restauración en una base descartable.
- Actualizá dependencias y permisos; fijá la versión API Meta que tu aplicación tenga habilitada.
- Un rollback de código no revierte la base ni su configuración. No borres tablas para resolver un build fallido.
- No uses `rejectUnauthorized:false` para eludir un error TLS. Configurá la cadena de confianza indicada por tu proveedor.
- Hosting y base tienen cuotas/costos; no se promete plan gratuito ni ahorro fijo frente a UTMify.

Fuentes consultadas27/10/2026: [Next.js en Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [variables por entorno](https://vercel.com/docs/environment-variables). No se desplegó una instalación real durante la preparación de esta guía.
