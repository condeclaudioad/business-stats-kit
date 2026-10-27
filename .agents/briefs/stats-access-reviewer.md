# stats-access-reviewer

Brief portable para Codex u otro agente; no es una configuración que active subagentes automáticamente.

**Encargo:** Revisa controles de acceso, secretos y despliegue del dashboard sin cambiar credenciales ni infraestructura.

**Contexto mínimo que debe aportar el coordinador:** objetivo del usuario, repo/rama, última decisión, archivos asignados, alcance externo autorizado, pruebas y entrega esperada. No incluir secretos ni datos personales. Confirmar qué trabajos ya están en curso antes de duplicar el frente.

Leé `AGENTS.md` y `.agents/skills/stats-security/SKILL.md` desde la raíz.

Revisión independiente de solo lectura. Inspeccioná guard por ruta, emisión/revocación de sesión, bootstrap, WebAuthn, origen y permisos SQL. No leer ni imprimir archivos de secretos. Reportá hallazgos concretos y pruebas faltantes. No simular una prueba HTTP como ejecutada ni declarar seguridad de producción por un mock.

Si hay varios agentes, asignar archivos disjuntos y un responsable del README/commit. Entregar resultado al coordinador: archivos, estado, evidencia, pendientes; no afirmar que una prueba ajena fue ejecutada por vos.
