# Venís de la clase: empezá acá

El objetivo es tener tu propio dashboard, con una oferta delimitada y números que puedas comprobar. Empezá con la demo: no necesitás entregar claves para elegir el diseño.

## Copiá este mensaje en Claude Code o Codex

> Quiero instalar https://github.com/condeclaudioad/business-stats-kit para mi negocio. Prepará mi propia copia y leé AGENTS.md. Usá stats-onboarding. Primero levantá la demo, mostrame los diseños y preguntame por una oferta, moneda, zona y proveedores. No me pidas secretos en el chat. Después prepará configuración, acceso privado y conexión de una fuente por vez. Indicá qué está implementado y qué necesita un adaptador. No des por terminada una fuente hasta conciliar un período cerrado. No publiques mi instalación sin que yo haya elegido el destino.

El agente necesita acceso a archivos/terminal. Pegar el link en un chat sin herramientas permite recibir instrucciones, pero no instala la aplicación por sí solo.

En GitHub elegí **Use this template → Create a new repository**, preferentemente privado para tu adaptación. Cloná tu copia y abrí esa carpeta en el agente. No uses la cuenta de Claudio ni pegues archivos secretos. [Cómo crear una copia](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

## Cuatro resultados comprobables

1. **Demo:** abre localmente, muestra etiqueta ficticia, podés elegir apariencia y navegar desde el celular en una prueba responsive.
2. **Negocio definido:** una oferta, IDs exactos, moneda/zona y definiciones guardadas sin secretos. No inferir a qué negocio pertenece un pago por su importe.
3. **Acceso:** base dedicada, contraseña y passkey; la API rechaza acceso sin sesión. La prueba definitiva se hace en tu dominio y dispositivo.
4. **Fuente validada:** mismo período, alcance y definición que el proveedor; diferencias explicadas. Un número bonito no alcanza.

[Diseños](designs.md) · [Skills y agentes](agents.md) · [Fuentes](integrations.md) · [Publicar en Vercel](deploy-vercel.md) · [UTMify](utmify.md).

## Lo que viste en la grabación y lo que trae la plantilla

| En la clase | En este repositorio |
|---|---|
| Panel personal de Claudio | Diseños reutilizables con datos inventados. No incluye su operación ni sus credenciales. |
| Stripe y Meta | Lecturas acotadas ya implementadas; requieren tus permisos, IDs y conciliación. |
| Mercado Pago o tu proveedor de cobros | Requiere implementar y probar un adaptador. No alcanza con pegar una clave. |
| Email / Resend | Contrato de importación de entregas y clics. No trae sincronización nativa Resend ni envía recordatorios. |
| Producto, cursos o PDF | Eventos canónicos por JSON o PostHog. Instrumentar acciones reales es parte de la adaptación; una descarga no demuestra lectura. |
| Embudo y UTMs | Ejemplos visuales sintéticos; no hay atribución anuncio→pago implementada. Guardar una UTM no prueba la unión. |
| Refresco cada15segundos del panel personal | Aquí se actualiza al abrir, cambiar rango o pulsar Actualizar; proveedores con caché60s por proceso. No hay refresco automático15s. |
| Avisos de ventas en celular | No incluidos. Necesitan integración, privacidad, idempotencia y permiso de notificaciones. |
| Contraseña aleatoria | El CLI pide que elijas una contraseña; generala con tu gestor y pegala solo en la terminal privada. |

La contraseña más passkey es el control de acceso implementado. La biometría se valida en el dispositivo, no se guarda en el dashboard. No equivale a seguridad absoluta: también importan infraestructura, permisos y mantenimiento. Un código por email no es automáticamente más seguro que una passkey.

Podés mostrar distintas métricas en una misma pantalla si cada una conserva su definición. No mezcles facturas, caja, beneficio y ROAS atribuido bajo una etiqueta común.
