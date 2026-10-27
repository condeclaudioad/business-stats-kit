---
name: stats-maintenance
description: Diagnostica fallos de actualización, cuotas, sesiones y cambios de API del dashboard; prepara cambios y recuperación comprobables.
---

Leé `AGENTS.md`, `docs/verification.md`, `docs/security.md` y `docs/recipes/operations.md`. Empezá por el síntoma y la última lectura exitosa.

1. Diferenciá sesión vencida (401), permisos (403), cuota (429), cambio de contrato, cobertura incompleta y datos legítimamente vacíos. Mirá status/categorías sin volcar tokens ni cuerpos con PII. Comprobá doctor y configuración por presencia, no imprimas secretos.
2. Reproducí con la menor consulta permitida. Ante 429 respetá backoff/cuota; no repetir refresh en bucle ni rotar claves para eludir límites. No desactivar login, validación de origen o cobertura para que aparezcan números.
3. Contrastá versión de API/dependencias con documentación oficial vigente. Aislá el cambio en una rama, conservá un fixture sintético del fallo y probá migración/rollback cuando haya datos durables. No corregir totales con multiplicadores manuales.
4. Ejecutá tests afectados, typecheck/build y una lectura de conciliación cuando cambie el proveedor. Diferenciá reinicio local de despliegue: no publicar por inferencia de una auditoría. Evitá buildear sobre el directorio que sirve la demo activa.
5. Entregá causa con evidencia, arreglo, pruebas y recuperación. Si se perdió la passkey, explicar reset que revoca todo y seguir la autorización existente; no resetear automáticamente por un error de UI.

Aceptación: el fallo se reproduce antes del arreglo y desaparece después, sin relajar controles; la fecha de caché conserva su significado; las dependencias o servicios externos no verificados quedan nombrados.
