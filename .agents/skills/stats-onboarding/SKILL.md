---
name: stats-onboarding
description: Configura Business Stats Kit para un negocio y guía desde la demo hasta una instalación privada con alcance y métricas definidos.
---

Leé `AGENTS.md`, `README.md` y **`docs/build-guide.md`**, la secuencia canónica de construcción. Conservá las decisiones existentes y retomá desde la primera etapa incompleta; no cargues todas las skills ni repitas setups ya hechos.

1. Identificá copia, rama, remoto y estado. Si sólo hay una URL, prepará una carpeta nueva o la copia propia del alumno, sin sobrescribir instalaciones ni asumir permiso para publicar en el repo original. Sin terminal/archivos, explicá el límite: leer el enlace no instala nada.
2. En una copia nueva: `npm ci`, `npm run demo:setup`, `npm run doctor`, `npm run dev`. Verificá la etiqueta DEMO en `http://localhost:4321`. `demo:setup` conserva archivos existentes; no bajar una instalación live a demo para ocultar un fallo.
3. Pedí sólo lo que falte: una oferta, moneda/zona, pregunta prioritaria, pasarela, publicidad y evento de valor. Elegí la receta de negocio en `docs/recipes/`. Clasificá necesidades como incluida/requiere adaptación/no necesaria. No presentar Mercado Pago, Resend, UTM o notificaciones como conectores implementados.
4. Guardá decisiones, métricas, fuentes, exclusiones y pendientes en `.local/business.md`, comprobando primero que Git lo ignore, o en una ubicación privada fuera del checkout; nunca secretos ni registros personales. No crear `docs/business.md` con información privada en el template. Configurá `business.config.ts` con scope demostrado y sin claves.
5. Elegí diseño sintético con `stats-design`. Para fuentes existentes, `stats-connect-sources`; para desarrollo nuevo, `stats-adapter`. Primero contrato/fixtures y pruebas; después acceso protegido, conexión y conciliación con `stats-reconcile`.
6. Seguí las etapas de base/acceso de `docs/build-guide.md` y `docs/security.md`. Diferenciá local y dominio final; una passkey local no valida el origen final. El dueño ingresa contraseña y bootstrap en privado. No ejecutar reset para reanudar una instalación. Credenciales o interacción física faltantes son pendientes concretos, no motivo para relajar acceso.
7. Para publicación y operación, respetá el destino autorizado y las pruebas de `stats-security`/`stats-maintenance`. No crear suscripciones, desplegar ni modificar sistemas externos por inferencia del onboarding. Si ya existe autorización concreta, continuar sin confirmaciones repetidas.

Aceptación: demo observada, ficha recuperable, estilo elegido, alcance por fuente y evidencia diferenciada entre configuración, mocks y cuenta real. Cada etapa termina con resultado observable o bloqueo concreto. La ausencia de credenciales no impide completar diseño y código comprobables localmente; un build no acredita seguridad ni conciliación en producción.
