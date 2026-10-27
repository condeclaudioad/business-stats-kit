# Business Stats Kit — instrucciones para agentes

Este proyecto es un dashboard privado de un dueño por instalación, con una demo sintética y un modo real. Leé `README.md` y la guía específica de `docs/` antes de cambiar el contrato. El usuario elige su negocio y proveedores; no asumir que utiliza los del ejemplo.

## Recorrido

- Para configurar el negocio: `.agents/skills/stats-onboarding/SKILL.md`.
- Para conectar o adaptar fuentes: `.agents/skills/stats-connect-sources/SKILL.md`.
- Para revisar acceso y preparar publicación: `.agents/skills/stats-security/SKILL.md`.

Las copias bajo `.claude/skills` apuntan a las mismas instrucciones. Si el cliente no descubre una skill, leer su archivo explícitamente. No hace falta instalar skills globales para usar el repo.

## Invariantes

- No pedir al usuario que pegue claves, contraseñas, tokens de alta o recuperación en el chat. Indicá dónde ingresarlos de forma local/segura. No mostrarlos en logs, capturas, commits ni reportes.
- Mantener `APP_MODE` explícito. Modo real sin configuración o sin autenticación válida se bloquea; no volver a demo o abrir acceso como solución a un fallo. La demo no consulta fuentes reales.
- El navegador recibe agregados mínimos. Credenciales de proveedores y base solo del lado servidor, sin prefijos públicos. Cada endpoint de datos debe exigir sesión verificada; un middleware o una pantalla de login no bastan.
- Un negocio por instalación. No transformar en SaaS multiusuario sin diseñar autorización, aislamiento por tenant y pruebas independientes.
- Integraciones de lectura. Configurar el dashboard no autoriza cobros, reembolsos, cambios de presupuesto, envío de emails, mensajes ni campañas.
- Scope de Stripe por producto y unión exacta de recursos, nunca por monto o descripción. Meta por IDs explícitos. No inventar conversiones cruzando poblaciones distintas.
- Dato ausente = `null`/`—`. No devolver cero ni datos sintéticos cuando una fuente real falla. Mostrar cobertura parcial y fecha de lectura.
- Escribir tests cuando cambien seguridad, importes, pertenencia, deduplicación o cobertura. Ejecutar los comandos de verificación del README y conciliar en origen las integraciones reales.
- No copiar dumps, archivos `.env`, caches ni datos del negocio que inspiró el proyecto. Fixtures sintéticas identificadas como tales.

## Entrega

Reportar qué cambió, qué pruebas se ejecutaron y qué sigue sin comprobar. Un build no prueba Face ID real, una migración no prueba permisos de producción y un mock no prueba la cuenta del usuario. No afirmar seguridad absoluta. Conservar licencias del código incorporado; evaluar el archivo concreto, no el nombre comercial del template.
