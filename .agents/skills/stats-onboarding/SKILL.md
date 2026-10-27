---
name: stats-onboarding
description: Configura Business Stats Kit para un negocio y guía desde la demo hasta una instalación privada con alcance y métricas definidos.
---

Leé `AGENTS.md`, `README.md`, `docs/metrics.md` y `business.config.ts` desde la raíz de este repo. Conservá las decisiones existentes y el modo actual.

1. Inspeccioná configuración y entorno por presencia de variables, sin imprimir valores secretos. Si el usuario está empezando, usá `npm run demo:setup` (no sobrescribe `.env.local`), `npm run doctor` y arrancá la demo; verificá que sea sintética.
2. Pedí solo lo que falte para definir el negocio: nombre, moneda, zona horaria, pregunta prioritaria, pasarela, cuentas de publicidad y evento de valor. No supongas que cuenta = negocio. Los IDs de scope pueden ingresarse en configuración; las claves nunca en el chat.
3. Configurá `business.config.ts` usando sus tipos y validación reales. No copies productos, clientes ni cuentas de otra instalación. No cambies las fórmulas al cambiar la apariencia.
4. Guardá una ficha sin secretos en `docs/business.md`: pregunta, definiciones, fuentes, exclusiones, moneda/zona, decisión de estilo y pendientes. Diferenciá decidido, configurado y verificado.
5. Para pasar a real, seguí `docs/security.md` y `docs/integrations.md`: `npm run db:setup`, alta por `auth:setup` y `doctor -- --database` antes de conectar datos. Delegá el ingreso de contraseña y token de alta a la persona mediante la terminal/interfaz prevista. La falta de credenciales es un pendiente, no motivo para relajar el acceso.
6. Conectá una fuente por vez con `stats-connect-sources`. Verificá el arranque y reportá lo que el usuario ya puede hacer, la evidencia y los siguientes pasos concretos.

No crear suscripciones de infraestructura, publicar ni modificar sistemas externos por inferencia del onboarding. Si el usuario ya autorizó una acción concreta, ejecutala dentro de ese alcance sin repetir confirmaciones rutinarias.

## Empezar con solo el enlace

Si todavía no hay checkout, identificá la carpeta destino y cloná la URL pública proporcionada sin sobrescribir una carpeta existente. Abrí el proyecto y leé sus instrucciones antes de instalar. No hace falta que el alumno copie archivos uno por uno. Si ya existe una instalación, preservá `.env.local`, rama y cambios locales; no ejecutar setup como si fuese nueva.

Arrancá con una oferta y elegí solo la receta relevante: `docs/recipes/saas.md`, `course.md`, `pdf.md` o `services.md`. Las rutas son relativas a `docs/recipes/`. Diferenciá funciones incluidas de adaptaciones: el template no trae Mercado Pago, notificaciones de ventas, recordatorios, atribución UTM completa ni apertura de PDFs. El refresco del kit no promete la frecuencia del dashboard del instructor.

Aceptación del onboarding: demo abierta y etiquetada; ficha del negocio con fórmula/fuente por métrica; estilo elegido; matriz «incluido / requiere adaptación / no necesario»; modo live solo con acceso verificado. Cada paso debe terminar con resultado observable o bloqueo concreto, no con «configurado» sin prueba. No cerrar como listo para producción por un build.
