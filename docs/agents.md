# Trabajar con Claude Code o Codex

Antes de empezar, leé [la guía de la clase y alcance real](start-here.md). Para publicar, seguí [la guía de Vercel](deploy-vercel.md).

El repo trae siete skills y cuatro roles de agente. Las skills describen cómo hacer el trabajo; los roles permiten separar implementación y revisión cuando tu herramienta lo admite. No hace falta usarlos todos ni abrir varias sesiones para configurar una demo.

## Empezar pegando el enlace

> Quiero instalar https://github.com/condeclaudioad/business-stats-kit para mi negocio. Si ya hay una copia, preservala; si no, clonala en una carpeta nueva. Leé AGENTS.md y usá stats-onboarding. Primero dejame la demo funcionando, después ayudame a definir una oferta, elegir diseño y conectar una fuente por vez. No me pidas claves en el chat. Mostrame qué está incluido y qué requiere adaptación.

Una vez clonado, abrir esa carpeta en el agente. La instalación puede necesitar Git/Node y permisos locales. El repositorio no aporta credenciales de infraestructura ni de proveedores.

## Elegir la skill

| Pedido | Skill | Resultado comprobable |
|---|---|---|
| «Quiero arrancar con mi negocio» | `stats-onboarding` | Demo y ficha del negocio, alcance y pendientes |
| «Quiero conectar Stripe/Meta o importar» | `stats-connect-sources` | Fuente configurada y conciliación o pendiente concreto |
| «Uso Mercado Pago/Resend/otro proveedor» | `stats-adapter` | Contrato y adaptador probado; sin fingir conexión |
| «Quiero que se vea como este diseño» | `stats-design` | UI sintética responsive sin cambiar fórmulas |
| «No coincide con el proveedor» | `stats-reconcile` | Diferencia explicada por IDs/reglas y prueba del arreglo |
| «Quiero acceso privado o publicar» | `stats-security` | Matriz de acceso y comprobación del origen elegido |
| «Se dejó de actualizar» | `stats-maintenance` | Diagnóstico, corrección probada y operación documentada |

La fuente canónica está en `.agents/skills/<nombre>/SKILL.md`; `.claude/skills/<nombre>` enlaza cada carpeta. Si tu cliente no conserva symlinks o no descubre skills, pedile leer el archivo explícitamente. La invocación automática depende del cliente, no de una promesa de este repo.

## Roles de revisión e implementación

Claude Code tiene definiciones de proyecto en `.claude/agents/` conforme a su [documentación oficial](https://code.claude.com/docs/en/sub-agents), consultada el27/10/2026. Incluyen implementador y revisores de datos, acceso y diseño. Los revisores tienen solo herramientas de lectura: pueden analizar evidencia y código; un coordinador con navegador/shell ejecuta las comprobaciones y les entrega resultados. No afirmar que hicieron pruebas de ejecución por leerlas.

Para Codex, `.agents/briefs/` contiene los mismos encargos en texto portable. El coordinador debe pasarlos a su mecanismo disponible de delegación; estos archivos no configuran subagentes automáticamente. También pueden ejecutarse secuencialmente en una sola conversación. Los modelos, permisos y herramientas dependen de tu instalación.

Ejemplo de encargo acotado:

> Usá el brief `.agents/briefs/stats-data-reviewer.md` para revisar el conector que acabamos de cambiar. Objetivo: que una página duplicada no duplique facturas. Archivos: lib/provider-connectors.ts y tests/connectors.test.ts. Solo lectura; reportá escenarios reproducibles, no cambies los archivos ni consultes cuentas reales.

## Prompts específicos

**Diseño:** «Usá stats-design. Quiero un tablero oscuro con un embudo de ejemplo en demo. Mantené definiciones y datos ausentes. Probá móvil y escritorio y entregá capturas ficticias. No inventes atribución en live».

**Oferta nueva:** «Usá stats-onboarding y la receta docs/recipes/pdf.md. Vendo un PDF; quiero distinguir venta de descarga. Decime qué puedo medir de verdad y qué requiere instrumentación».

**Fuente nueva:** «Usá stats-adapter. Necesito Mercado Pago para una oferta. Definí estados, moneda, pertenencia, reembolsos y deduplicación. Implementá primero con fixtures y dejá explícito lo no probado en mi cuenta».

**Conciliación:** «Usá stats-reconcile. La tarjeta difiere del origen. Compará un día cerrado con mismos filtros, fechas y moneda. No cambies la fórmula para hacer coincidir el total. Guardá datos reales fuera de Git».

**Producción:** «Usá stats-security y docs/recipes/vercel.md. Prepará la configuración y las pruebas de acceso para mi dominio. No tomes la demo como evidencia de seguridad real. Indicame dónde ingreso los secretos en privado».

## Entrega que conviene exigir

Cambios y archivos, resultados observados, pruebas ejecutadas, qué cuenta/proveedor sigue sin comprobar y siguiente paso concreto. Un agente no conoce tu negocio por el nombre de una carpeta. Corregí la ficha cuando cambie el alcance; no repetir toda la configuración ni registrar secretos para recordar decisiones.
