# Business Stats Kit — instrucciones para agentes

Este proyecto es un dashboard privado de un dueño por instalación, con una demo sintética y un modo real. Leé `README.md` y la guía específica de `docs/` antes de cambiar el contrato. El usuario elige su negocio y proveedores; no asumir que utiliza los del ejemplo.

## Recorrido

Elegí la skill por el trabajo, no cargar todas:

- Negocio/demo: `.agents/skills/stats-onboarding/SKILL.md`.
- Fuente existente: `.agents/skills/stats-connect-sources/SKILL.md`.
- Proveedor o métrica nueva: `.agents/skills/stats-adapter/SKILL.md`.
- Apariencia: `.agents/skills/stats-design/SKILL.md`.
- Números que difieren: `.agents/skills/stats-reconcile/SKILL.md`.
- Acceso/publicación: `.agents/skills/stats-security/SKILL.md`.
- Fallos/cambios de API: `.agents/skills/stats-maintenance/SKILL.md`.

[Guía y prompts](docs/agents.md). `.claude/skills` enlaza la fuente común. Claude tiene roles en `.claude/agents`; Codex dispone de briefs portables en `.agents/briefs`, sin activación automática. No hace falta instalar skills globalmente. Si el cliente no descubre una skill, leer su archivo explícitamente.

Antes de editar, inspeccioná rama y cambios existentes. Si el pedido solo trae la URL del repo, `stats-onboarding` guía la copia inicial sin sobrescribir instalaciones. Guardá configuración y evidencia privada del alumno fuera del repo público; no commitear reportes financieros reales. Una guía de proveedor no demuestra que exista su conector.

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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
