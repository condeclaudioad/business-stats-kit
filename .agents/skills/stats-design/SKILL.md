---
name: stats-design
description: Diseña o adapta la interfaz de Business Stats Kit preservando métricas, estados y acceso; no conecta proveedores.
---

Leé `AGENTS.md`, `docs/designs.md`, `app/Dashboard.tsx`, `app/globals.css` y `lib/contracts.ts`. Trabajá primero en demo.

1. Identificá la decisión que necesita tomar el usuario y el dispositivo principal. Elegí un diseño existente y explicá qué estructura vas a conservar. Una referencia visual autoriza observar apariencia, no importar sus datos, credenciales o código sin licencia.
2. Separá cambio visual de cambio semántico: color, densidad, orden y tipografía pueden cambiar; nombres, unidades, fórmulas, filtros y cobertura siguen el contrato. Un embudo requiere población e identidad compatibles: no convertir clics Meta y facturas Stripe en una conversión atribuida. Si solo hay una maqueta, etiquetarla y renderizarla exclusivamente en demo.
3. Modificá componentes/tokens con estados de carga, error, vacío, parcial y sesión vencida. No dejar los números anteriores bajo un período nuevo sin indicar la carga. Mantener definiciones y fuentes accesibles en móvil.
4. Comprobá 1440px y 390px, navegación con teclado, contraste, reducción de movimiento, tablas alternativas y números largos. Capturas exclusivamente sintéticas. Probá selector de estilo, secciones, fechas y refresh, además de typecheck/build.
5. Entregá captura, archivos, qué cambió visualmente y evidencia de que conserva métricas. No anunciar nuevo tracking por haber dibujado una tarjeta.

Aceptación: ninguna fórmula modificada por estética; ninguna fixture visible en live; sin scroll horizontal de página; errores/ausencia siguen visibles. Si se pide una métrica nueva, tratala como trabajo de `stats-adapter` o `stats-reconcile`, no una cifra hardcodeada.
