# Referencias evaluadas

Consulta: 27/10/2026, 16:58 ART. Se usaron documentación oficial, repositorios originales y la API pública de GitHub. Las estrellas y los forks son señales de interés; no prueban seguridad, calidad de implementación ni resultados de negocio.

## Decisión para este kit

Mantener una aplicación pequeña, con un dueño por instalación, Postgres privado, autenticación obligatoria en modo real y contratos de métricas explícitos. Reutilizar bibliotecas mantenidas; no convertir una maqueta de administración en un sistema de seguridad por inferencia. Las tres apariencias comparten datos y permisos.

| Referencia | Evidencia leída | Uso recomendado |
|---|---|---|
| [shadcn/ui](https://github.com/shadcn-ui/ui) | 126.697 estrellas, 12.547 forks; [licencia MIT](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md). API GitHub consultada en el corte indicado. | Componentes si el alumno quiere ampliar la UI. Conservar los avisos de licencia de cualquier código incorporado. No aporta por sí solo autenticación ni métricas. |
| [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) | 15.968 estrellas, 2.401 forks; [MIT](https://github.com/satnaing/shadcn-admin/blob/main/LICENSE). Su README describe autenticación parcial y aclara que no es un starter. | Referencia visual y de navegación. No usar sus pantallas de login como evidencia de protección real. |
| [Supabase Agent Skills](https://github.com/supabase/agent-skills) | Repositorio oficial, 2.939 estrellas, 255 forks; [MIT](https://github.com/supabase/agent-skills/blob/main/LICENSE). Incluye `supabase` y `supabase-postgres-best-practices`. | Complemento opcional para SQL, índices, pooling y RLS. Leer versión y cambios antes de instalar; no hace falta para ejecutar este kit. |
| [Metabase](https://github.com/metabase/metabase) | 49.872 estrellas, 6.929 forks. El repo distingue edición abierta AGPL y código comercial. [Documentación de permisos de base](https://www.metabase.com/docs/latest/databases/users-roles-privileges) recomienda usuario dedicado con lectura mínima. | Alternativa si la prioridad es explorar SQL y construir reportes sin desarrollar una UI. Evaluar la licencia de la edición y función elegidas; no copiar su código al kit. |
| [PostHog](https://github.com/PostHog/posthog) | 40.474 estrellas, 3.557 forks. [Licencia](https://github.com/PostHog/posthog/blob/master/LICENSE): MIT fuera de las excepciones indicadas y licencia específica en `ee/`. [Fuente Stripe](https://posthog.com/docs/data-pipelines/sources/stripe) y [SQL](https://posthog.com/docs/sql) documentados. | Alternativa para unir eventos de producto y datos externos en su warehouse. Reduce trabajo de ingestión si el negocio ya usa PostHog; no garantiza que la atribución esté correctamente modelada. |

Los repos no estaban archivados en la consulta. `pushed_at` o muchas estrellas no equivalen a una auditoría. No se ha incorporado código de estos templates ni copiado sus skills. No se midieron resultados de alumnos con ellos.

## Base de datos: elegir por la operación

**Postgres dedicado** es la base del kit: almacenamiento durable de autenticación y tablas normalizadas para integraciones. Es conveniente separar esa base del producto que cobra a clientes. El proceso que importa estadísticas necesita escribir únicamente en sus tablas; la lectura del producto original debería usar un usuario de solo lectura o vistas agregadas.

**Supabase** puede alojar ese Postgres. Si se usa su Data API, revisar permisos del esquema expuesto y RLS. La documentación advierte que sus claves administrativas pueden saltarse RLS y nunca deben llegar al navegador. RLS no corrige una aplicación que usa una credencial privilegiada para entregar datos a cualquiera. [Fuente oficial](https://supabase.com/docs/guides/database/postgres/row-level-security).

**PostHog** sirve cuando además hay que instrumentar eventos, estudiar retención y consultar fuentes externas. Se puede extraer un agregado para este dashboard o trabajar en PostHog directamente. Revisar región, retención, costos y alcance de permisos antes de sincronizar datos personales. Su conector no reemplaza el catálogo de productos que define qué negocio se está midiendo.

**Metabase** sirve para personas que prefieren preguntar sobre SQL y publicar tableros internos. Conectar vistas curadas con un rol de lectura; no entregar el usuario propietario de la base. El alcance de permisos avanzados depende de la edición elegida. [Permisos](https://www.metabase.com/docs/latest/permissions/introduction).

## Seguridad y fuentes

- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html): recomienda hashes lentos con salt; documenta scrypt con N=2^17, r=8, p=1 como configuración mínima. Es una referencia de parámetros, no una certificación de esta aplicación.
- [OWASP Passkey Security](https://cheatsheetseries.owasp.org/cheatsheets/Passkey_Security_Cheat_Sheet.html): revisar alta, origen/RP ID, verificación del usuario, sesiones y recuperación como un conjunto. Recomienda más de un autenticador; este kit todavía no implementa alta independiente de una segunda passkey, por lo que conserva esa limitación explícita. [OWASP MFA](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) distingue presencia del usuario de verificación local.
- [SimpleWebAuthn: passkeys](https://simplewebauthn.dev/docs/advanced/passkeys): pedir verificación del usuario en las opciones y exigirla al validar la respuesta. También verificar challenge, origen y RP ID. Huella, cara o PIN se resuelven en el autenticador; el servidor no recibe biometría.
- [Stripe: claves API](https://docs.stripe.com/keys): crear una clave restringida por integración. Este dashboard requiere lectura de recursos concretos; no necesita crear pagos, reembolsar ni cancelar suscripciones.
- [Meta Insights](https://developers.facebook.com/docs/marketing-api/insights/): referencia canónica para validar campos, permisos, versión y atribución del conector. La apertura devolvió HTTP 429 en esta investigación; su contenido no se da por leído. Antes de conectar una cuenta real, contrastar la versión y `ads_read` con la documentación accesible de la app y probar consultas GET en esa cuenta.
- [Resend: eventos de webhooks](https://resend.com/docs/webhooks/event-types): ejemplo oficial de eventos de entrega, apertura, clic y rebote. Es una referencia para escribir un adaptador; el kit no incluye un conector directo de Resend ni manda emails.

## Qué mejora esta clase

El alumno primero ve un tablero con datos sintéticos, después define su negocio, protege el acceso y conecta una fuente por vez. No empieza pegando claves en un prompt ni clonando datos del instructor. Cada fuente debe mostrar alcance, período, cobertura y última lectura; el diseño no puede ocultar que falta información.

Las skills incluidas son específicas de ese recorrido y del código de este repo. Las skills públicas son opcionales: su procedencia ayuda a evaluar, pero ninguna reemplaza las pruebas contra el negocio concreto.
