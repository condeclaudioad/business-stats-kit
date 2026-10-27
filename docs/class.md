# Recorrido para la clase

Resultado: cada alumno tiene su copia del proyecto, puede demostrar el tablero con datos ficticios, define su negocio y sale con una lista verificable de pasos para operar con datos reales. No hay promesa de completar permisos de proveedores ni el despliegue en un tiempo fijo.

## Antes de la clase

Preparar Node y npm compatibles con `package.json`, Git, editor con Claude Code o Codex y un navegador con WebAuthn. Para la etapa real hace falta una base Postgres dedicada y acceso administrativo a las cuentas propias para crear credenciales de lectura. No proyectar claves, clientes, correos ni cifras del negocio del instructor.

## 1. Ver el resultado

Abrir la demo sintética y recorrer Resumen, Marketing, Producto y Email. Cambiar entre las tres apariencias. Explicar qué decisión ayuda a tomar cada bloque; evitar empezar por colores o integraciones.

Ejercicio: elegir una pregunta del negocio, por ejemplo «¿los nuevos clientes llegan al primer resultado?». Escribir qué evento y período la responderían.

## 2. Hacer una copia propia

Crear un repositorio desde el template o hacer un fork. Clonar esa copia y seguir el arranque del README. Abrir el proyecto con el agente y pedir:

> Leé AGENTS.md y usá stats-onboarding. Mi negocio es [descripción]. Quiero medir [pregunta]. Ayudame a completar la configuración sin pedirme secretos en el chat.

Resultado verificable: demo funcionando y ficha del negocio; no basta que el agente diga que instaló todo.

## 3. Definir el perímetro

Elegir moneda, zona horaria, productos de Stripe, cuentas/campañas Meta y evento de valor. Mostrar por qué una cuenta compartida exige filtros explícitos. Distinguir dato ausente de cero y cobro de atribución.

Ejercicio: incluir un registro sintético de otro producto y comprobar que no entra en ventas propias.

## 4. Cerrar la puerta

Seguir `docs/security.md`: base privada, configuración de acceso, contraseña y passkey. Mostrar una petición a la API sin sesión; debe ser rechazada. Explicar que el dispositivo confirma al usuario con huella, cara o PIN y que el servidor valida una firma, no recibe su biometría.

El alumno conserva el acceso administrativo a su infraestructura en un gestor seguro y prueba el acceso desde otro dispositivo compatible con su passkey sincronizada o autenticación por QR. Esta versión no registra una segunda passkey desde el panel. La recuperación es un reset por CLI con acceso a la base que revoca todo; el token de alta vence y se borra, no es un código de recuperación permanente. No grabar ese material.

## 5. Conectar una fuente

Empezar por Stripe o por un archivo de producto normalizado. Usar `stats-connect-sources`; validar un día cerrado contra el origen. Agregar Meta después de tener su scope explícito. Producto y email requieren adaptar los eventos del negocio al contrato de importación, no suponer nombres de tablas universales. Para producto en PostHog hay un comando manual de sincronización que exige eventos canónicos; no instala tracking ni un cron.

## 6. Preparar publicación

Usar `stats-security` para obtener evidencia de build, pruebas de rechazo y lista de pendientes. Configurar un origen HTTPS estable y las variables solo en el servidor. Probar en el destino real antes de declarar listo. La publicación requiere un destino elegido; el agente no crea infraestructura paga ni envía mensajes por haber leído una skill.

## Cierre práctico

Cada alumno entrega: URL privada o demo local, captura sin datos personales, configuración sin secretos, una conciliación y evidencia de rechazo sin sesión. Los pendientes deben tener causa y siguiente paso. Una pantalla bonita no acredita ni datos correctos ni acceso protegido.

## Adaptaciones por negocio

| Negocio | Evento de valor inicial | Fuentes posibles |
|---|---|---|
| SaaS | Primer resultado completado | Stripe, eventos propios/PostHog, Meta, proveedor de email |
| Curso | Primera lección completada | Pasarela, plataforma educativa, Meta, proveedor de email |
| Consultoría | Entregable aceptado | Cobros, CRM/registro propio, adquisición y email |

La pasarela o plataforma distinta necesita un adaptador probado. No prometer que un token conecta automáticamente todos los negocios.
