# Operar sin depender de una captura bonita

| Síntoma | Primera comprobación | Evitar |
|---|---|---|
| Todos los pedidos 401 | Sesión y nuevo login | Desactivar el guard o resetear el dueño sin diagnóstico |
| Proveedor 403 | Token y scope de lectura | Habilitar escritura o imprimir el token |
| Proveedor 429 | Cuota y espera indicada | Bucle de refresh |
| Datos antiguos | Última carga vs último evento/cobertura, caché | Cambiar fecha para parecer reciente |
| Cero inesperado | Alcance, páginas, IDs y cobertura | Sustituir error por cero |
| Cambio de API | Versión y contrato oficial | Aplicar un multiplicador a los números |

Mantenimiento según uso: revisar errores y frescura; conciliar después de cambiar catálogo, campañas o APIs; actualizar dependencias con pruebas; respaldar y probar restauración. La frecuencia la define el operador: el repo no programa este trabajo automáticamente.

Antes de cambiar esquema: respaldo, migración compatible, prueba en base desechable y plan de reversión. Si cambiar el origen rompe la passkey, usar el procedimiento documentado de recuperación; nunca aceptar todos los orígenes.
