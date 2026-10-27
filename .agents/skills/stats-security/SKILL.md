---
name: stats-security
description: Verifica los límites de acceso de Business Stats Kit y prepara o comprueba su despliegue privado con contraseña y passkey.
---

Leé `AGENTS.md`, `docs/security.md`, el código de autenticación, rutas de datos, configuración y migración SQL. No declarar seguro algo solo porque muestra un login.

1. Confirmar modo real explícito, origen exacto, base dedicada y ausencia de secretos en archivos versionados/bundle. No imprimir valores durante la inspección.
2. Revisar alta inicial: dueño creado desde CLI, token de bootstrap de un solo uso, expiración y ausencia de registro público. En acceso normal exigir contraseña y respuesta WebAuthn válida antes de emitir sesión completa.
3. Probar rechazo sin cookie, con cookie inventada, sesión expirada/revocada, origen ajeno y challenge repetido. Comprobar guard de cada endpoint, cookies, cache de datos privados, limitación de intentos durable y consultas parametrizadas. Un test unitario no reemplaza las pruebas HTTP.
4. Ejecutar tests/typecheck/build y conservar evidencia sin datos personales. Con un autenticador real, pedir al usuario completar la ceremonia y verificar acceso, logout y recuperación. No simular su biometría ni afirmar Face ID comprobado desde un mock.
5. Revisar el destino elegido: HTTPS, `APP_ORIGIN`, variables solo servidor, permisos de DB y APIs, backup y rotación. Probar rutas reales sin sesión después de publicar. No publicar si el usuario pidió solo revisión.
6. Escribir un informe con verificado, falló y sin comprobar. Para cada bloqueo, dar archivo/prueba y siguiente paso. No prometer que nadie podrá entrar ni atribuir al kit garantías de auditoría externa.

El reset administrativo invalida accesos y requiere control del servidor/base. Antes de ejecutarlo explicar el efecto concreto; no usarlo como reparación automática de un problema de UI. Mantener las decisiones autorizadas del usuario y no pedir confirmaciones duplicadas.
