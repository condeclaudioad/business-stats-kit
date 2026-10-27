---
name: stats-onboarding
description: Configura Business Stats Kit para un negocio y guía desde la demo hasta una instalación privada con alcance y métricas definidos.
---

Leé `AGENTS.md`, `README.md`, `docs/metrics.md` y `business.config.ts` desde la raíz de este repo. Conservá las decisiones existentes y el modo actual.

1. Inspeccioná configuración y entorno por presencia de variables, sin imprimir valores secretos. Arrancá la demo si el usuario está empezando y verificá que sea sintética.
2. Pedí solo lo que falte para definir el negocio: nombre, moneda, zona horaria, pregunta prioritaria, pasarela, cuentas de publicidad y evento de valor. No supongas que cuenta = negocio. Los IDs de scope pueden ingresarse en configuración; las claves nunca en el chat.
3. Configurá `business.config.ts` usando sus tipos y validación reales. No copies productos, clientes ni cuentas de otra instalación. No cambies las fórmulas al cambiar la apariencia.
4. Guardá una ficha sin secretos en `docs/business.md`: pregunta, definiciones, fuentes, exclusiones, moneda/zona, decisión de estilo y pendientes. Diferenciá decidido, configurado y verificado.
5. Para pasar a real, seguí `docs/security.md` antes de conectar datos. Delegá el ingreso de contraseña y token de alta a la persona mediante la terminal/interfaz prevista. La falta de credenciales es un pendiente, no motivo para relajar el acceso.
6. Conectá una fuente por vez con `stats-connect-sources`. Verificá el arranque y reportá lo que el usuario ya puede hacer, la evidencia y los siguientes pasos concretos.

No crear suscripciones de infraestructura, publicar ni modificar sistemas externos por inferencia del onboarding. Si el usuario ya autorizó una acción concreta, ejecutala dentro de ese alcance sin repetir confirmaciones rutinarias.
