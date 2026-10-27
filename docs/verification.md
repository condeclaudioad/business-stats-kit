# Verificación de la versión inicial

Corte: 27/10/2026, 17:07 ART. Pruebas locales con Node 22.22.2, PostgreSQL 17 desechable y Chromium; exclusivamente datos sintéticos.

- 14/14 tests aprobados, incluidas las dos pruebas de integración PostgreSQL: límite concurrente, vencimiento/revocación e importaciones idempotentes con rollback ante colisiones.
- TypeScript y build de producción aprobados. `npm audit --audit-level=high`: cero vulnerabilidades reportadas en el corte; no es una garantía permanente.
- Navegador: API sin sesión rechazada; origen ajeno rechazado; contraseña y bootstrap sin passkey no acceden; registro WebAuthn con autenticador virtual; replay rechazado; logout revoca la cookie en servidor; login posterior y reset CLI comprobados.
- Tres estilos en 1440 y 390 px: sin desborde horizontal ni errores JavaScript. Navegación, rango, actualización y selector de estilo comprobados. Capturas inspeccionadas.
- Tres skills validadas con el validador de skill-creator; enlaces de documentación y symlinks revisados.

## Qué falta comprobar en cada instalación

1. Passkey en dispositivo físico y dominio HTTPS definitivo. El autenticador virtual no prueba Touch ID/Face ID del alumno.
2. Permisos y conciliación contra sus cuentas reales de Stripe, Meta y PostHog; aquí no se usaron credenciales reales. El modelo de email requiere un exportador adaptado a su proveedor.
3. Hosting, TLS de base, privilegios del rol, backups/restauración y controles de red. No se desplegó la app ni se ejecutó una auditoría externa.

La CI ejecuta tests, TypeScript, build y auditoría de dependencias; los tests de navegador de este corte se ejecutaron por separado. Estado de cada ejecución: pestaña Actions del repositorio.
