# Verificación

## v0.3 — auditoría posterior a la grabación,27/10/2026

- Coordinador ejecutó30/30testsconPostgres17, typecheck y build de producción. Test adicional de seguridad del runner E2E aprobado; total31casos en la suite actual. Los mocks no validan las cuentas reales.
- `npm run test:browser` ejecutado con base local descartable:5diseños×1440/390px sin desborde,3embudos, secciones/período/refresh sin erroresJS. Modo live no muestra embudo ficticio; logout accesible en móvil.
- WebAuthn virtual: API anónima401, origen ajeno403, contraseña/bootstrap sin passkey no dan acceso, registro y login válidos, replay rechazado, cookieHTTPOnly/SameSiteStrict, logout y reset revocan sesión. Runner reproducible en `e2e/`; CI lo ejecuta con base desechable independiente. No prueba biometría física ni HTTPS final.
- Revisión independiente encontró y se corrigió lectura no consistente durante importación concurrente y aceptación de paginación/items Stripe incompletos. Pruebas cubren ambos y cohorte de email. Revisión del runner agregó rechazo de overrideslibpq para que un queryparam no redirija el reset fuera de la DBQA local.
- Revisor visual reportó15checks; coordinador inspeccionó capturas Cosmos/Executive. Autor de skills reportó7/7válidas y ambas fixtures aceptadas por el validador de importación.

Evaluación independiente de skills: escenario curso/PDF con Mercado Pago, Resend, Meta y7días para comparar90; resultado distingue adaptadores pendientes, cobertura incompleta y atribución no implementada. Fixtures validadas y referencias locales comprobadas.

Sin cuentas privadas conectadas, sin datos reales publicados y sin deploy. La versión0.2 tiene CI exitosa [40577726568](https://github.com/condeclaudioad/business-stats-kit/actions/runs/40577726568); la nueva corrida corresponde al commit de esta revisión y se consulta en Actions.

## v0.2 — verificación local del 27/10/2026

Coordinador ejecutó `npm test` con ambas bases PostgreSQL17 desechables: **29/29 aprobados, sin omisiones**. Incluye cobertura, importación/rollback, paginación PostHog, caché, IDs Stripe repetidos y pertenencia Meta. `npm run typecheck`, `npm run build` y `npm audit --omit=dev` aprobados (cero vulnerabilidades reportadas). Runtime local Node25.8.1; CI usa Node22.

Revisión visual independiente reporta22diapositivas sin desbordes a1920×1080, índice por teclado y taller390px sin scroll horizontal; portada, instalación y cierre inspeccionados. Servidor local de clase operativo4324. Doctor demo comprobado. No se repitió el recorrido responsive del dashboard ni el login de navegador de v0.1; se mantienen abajo como evidencia histórica. No se consultaron proveedores reales.

## v0.1 — evidencia histórica

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

La CI configurada ejecuta tests, TypeScript, build y auditoría de dependencias; los tests de navegador de este corte se ejecutaron por separado. Estado de cada ejecución: pestaña Actions del repositorio.
