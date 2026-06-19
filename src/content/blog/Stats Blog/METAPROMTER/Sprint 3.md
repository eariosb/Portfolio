Sprint 3: La Línea de Ensamblaje Semántico (Compilación y Extensión del Dominio)
Objetivo Estratégico: Completar la cobertura del dominio del software (pasos 3 al 7) mediante el registro de nuevas estrategias en el kernel, e implementar el "Prompt Compiler" —un orquestador que construye el prompt final como un conjunto de capas semánticas priorizadas, comprimibles por presupuesto de tokens y renderizables en tiempo real sin bloquear la interfaz.

Módulo A: Extensión del Lenguaje Ubicuo (Agregados de Ingeniería, UI/UX, Seguridad, Testing, Despliegue)
S3-A1: Implementación de Agregados de Dominio (Pasos 3-7) en el Kernel

Descripción: Extiendo el sistema de agregados (S1-A1) para cubrir los pasos faltantes. Defino los esquemas Zod para Engineering, Design, Security, Testing y Deployment. Cada agregado encapsula sus invariantes de negocio:

Engineering: exige que solid sea true si maturity es 'produccion'.

Design: si tuftePrinciples es true, chartLibrary no puede ser 'echarts' (por su alta densidad de chartjunk).

Security: si compliance incluye 'hipaa', encryption debe ser 'aes256' y auditLogs debe ser true.

Testing: unitCoverage no puede ser 100 si integration es false (cobertura total sin integración es insostenible).

Deployment: si docker es true, orchestration no puede ser 'none'.

Rigor: Uso zod.superRefine para validaciones cruzadas entre campos del mismo agregado. Ninguna de estas reglas vive en la UI; son puras del dominio.

Artefacto: packages/core/src/domain/aggregates/engineering.aggregate.ts, design.aggregate.ts, security.aggregate.ts, testing.aggregate.ts, deployment.aggregate.ts.

Criterio: El pnpm type-check falla si se intenta instanciar un agregado Security con compliance: ['hipaa'] y encryption: 'none'.

Módulo B: Registro de Estrategias para los Pasos 3-7 (Configuración y Lógica Dinámica)
S3-B1: Implementación de StepStrategy para Ingeniería (Paso 3)

Descripción: Registro la estrategia del paso 3 en el Registry (S1-C1). Su staticConfig JSON define los campos: solid (toggle), typing (toggle), dependencyInjection (toggle), errorHandling (select: 'result' | 'exceptions'), logging (select: 'json' | 'text'), maxLineLength (number input). La lógica applyEffects define que si maturity es 'prototipo', solid se desmarca automáticamente (por pragmatismo). isVisible siempre retorna true.

Rigor: Las opciones del JSON tienen referencias a los IDs que coinciden con las claves del Zod Schema.

Artefacto: packages/core/src/strategies/step3.strategy.ts, packages/core/src/config/steps/step3.config.json.

Criterio: El DynamicForm (S2-D1) renderiza el paso 3 con toggles y selects sin código específico.

S3-B2: Implementación de StepStrategy para UI/UX (Paso 4)

Descripción: Registro la estrategia del paso 4. Campos: designSystem (select: shadcn, mui, antd, tremor), chartLibrary (select: recharts, nivo, visx, echarts), tuftePrinciples (toggle), darkMode (toggle), animations (toggle), colorPalette (select dinámico cargado desde un JSON externo de paletas). applyEffects: si tuftePrinciples es true, se fuerza chartLibrary: 'recharts' (por su simplicidad y data-ink ratio).

Rigor: La lista de colorPalette se carga desde un archivo JSON estático para permitir añadir nuevas paletas sin recompilar el kernel.

Artefacto: packages/core/src/strategies/step4.strategy.ts, packages/core/src/config/steps/step4.config.json, packages/core/src/config/palettes.json.

Criterio: El campo colorPalette muestra opciones visuales (miniaturas de color) gracias al renderer de UI (Sprint 2), pero la lógica de selección es pura.

S3-B3: Implementación de StepStrategy para Seguridad (Paso 5)

Descripción: Registro la estrategia del paso 5. Campos: auth (select: jwt, oauth2, apikey, none), rbac (toggle), secrets (select: env, vault), encryption (select: aes256, none), auditLogs (toggle), rateLimiting (toggle). validate (del strategy) invoca al Rules Engine (S1-F1) para comprobar ComplianceEncryptionRule. isVisible depende de state.project.domain y state.strategy.compliance (si no hay compliance, el paso es opcional).

Rigor: La lógica isVisible usa el estado del dominio, no variables de UI. Es testeable unitariamente sin DOM.

Artefacto: packages/core/src/strategies/step5.strategy.ts, packages/core/src/config/steps/step5.config.json.

Criterio: Si el usuario selecciona compliance: [] (ninguno), el paso 5 se oculta automáticamente en el StepWizard (S2-B1).

S3-B4: Implementación de StepStrategy para Testing (Paso 6)

Descripción: Registro la estrategia del paso 6. Campos: unitCoverage (select: 80, 90, 100), integration (toggle), contract (toggle), e2e (toggle), securityScan (toggle). applyEffects: si e2e es true, automáticamente fuerza integration: true (dependencia técnica). validate comprueba que si unitCoverage es 100, integration debe ser true (criterio de calidad realista).

Artefacto: packages/core/src/strategies/step6.strategy.ts, packages/core/src/config/steps/step6.config.json.

Criterio: El Rules Engine (S1-F1) lanza un Warning si unitCoverage es 100 y integration es false.

S3-B5: Implementación de StepStrategy para Despliegue (Paso 7)

Descripción: Registro la estrategia del paso 7. Campos: docker (toggle), orchestration (select: docker-compose, kubernetes, none), ci (select: github-actions, gitlab-ci, none), docs (toggle), adr (toggle). validate: si docker es false, orchestration no puede ser 'kubernetes'. applyEffects: si maturity es 'escala', fuerza orchestration: 'kubernetes' como sugerencia (aunque el usuario puede anularla).

Artefacto: packages/core/src/strategies/step7.strategy.ts, packages/core/src/config/steps/step7.config.json.

Criterio: El GraphValidator (S1-D1) verifica que el paso 7 no tenga dependencias cíclicas y sea el nodo terminal del grafo (no tenga next).

Módulo C: El Compilador de Prompts (Prompt Assembler)
S3-C1: Implementación del PromptAssembler (Patrón Builder Semántico)

Descripción: Rechazo Handlebars (introduce lógica en la vista y es frágil). Implemento un Builder que construye el prompt por capas semánticas. Cada capa (ContextLayer, StackLayer, PrinciplesLayer, DesignLayer, SecurityLayer, TestLayer, DeployLayer) implementa la interfaz ILayer con el método render(state, options): string. El PromptAssembler recibe el estado, el nivel de compresión (Minimalista/Estándar/Exhaustivo) y orquesta las capas.

Rigor: Las capas son inmutables y no tienen estado. El Builder usa el patrón Fluent Interface: new PromptAssembler().withLayer(new ContextLayer()).withCompression('standard').assemble(state).

Artefacto: packages/core/src/compiler/assembler/PromptAssembler.ts, packages/core/src/compiler/layers/ILayer.ts.

Criterio: Cambiar el orden de las capas (ej. poner Seguridad antes que UI/UX) es tan simple como reordenar la llamada a .withLayer().

S3-C2: Implementación del "Token Budget Compressor" (Estrategias de Compresión)

Descripción: Cada capa tiene un método compress(text, level). Implemento tres estrategias concretas usando tiktoken (para gpt-4o):

Minimalista: Aplica un MapReduce semántico que extrae sujeto-verbo-objeto de las oraciones, elimina adjetivos y ejemplos, y reduce las listas a elementos separados por comas (sin descripciones).

Estándar: Renderiza el texto completo pero elimina duplicados y referencias cruzadas redundantes.

Exhaustivo: Renderiza todo el texto con ejemplos literales y citas completas.

Rigor: El compressor corre en un Web Worker (Módulo E) para no bloquear la UI. El token count se calcula en tiempo real y se muestra en el preview.

Artefacto: packages/core/src/compiler/compression/TokenBudget.ts, packages/core/src/compiler/compression/strategies/minimalist.ts, standard.ts, exhaustive.ts.

Criterio: Un prompt en modo Minimalista nunca excede los 400 tokens; Estándar < 1000; Exhaustivo < 2500 (validado con pruebas unitarias sobre fixtures de estado).

S3-C3: Implementación del "Critical Path Injector" (Priorización Semántica)

Descripción: El assembler no concatena en orden de pasos. Incorpora un Scorer que evalúa cada capa y le asigna un peso (0-100) basado en reglas heurísticas:

Si maturity === 'produccion', la capa de Seguridad obtiene +30 puntos.

Si domain === 'finanzas', la capa de Compliance obtiene +40 puntos.

Si style === 'microservices', la capa de Infraestructura (Despliegue) obtiene +20 puntos.

Si tuftePrinciples === true, la capa de UI/UX obtiene +15 puntos.

Las capas con mayor puntuación se inyectan al principio absoluto del prompt, garantizando que el agente IA vea primero lo más crítico (mitigando el "Lost-in-the-Middle").

Artefacto: packages/core/src/compiler/scoring/CriticalPathScorer.ts.

Criterio: Un proyecto financiero en producción genera un prompt que comienza con "Cumplimiento SOX/PCI" antes que "Principios de Ingeniería".

Módulo D: El Reactor de Vista Previa (Live Preview Reactor)
S3-D1: Implementación del "Derived State Reactor" con Web Worker

Descripción: La vista previa en vivo no se calcula en el hilo principal. Creo un Web Worker (usando comlink para comunicación) que aloja el PromptAssembler (Módulo C). El componente PromptPreview envía el estado (o un hash del estado) al worker, y el worker retorna el prompt renderizado y el token count. Mientras el worker procesa, se muestra un Skeleton Loader (Sprint 5).

Rigor: El worker se instancia solo si el navegador lo soporta. Si falla (Safari antiguo), fallback al hilo principal con un setTimeout para no bloquear.

Artefacto: packages/ui/src/workers/prompt.worker.ts (usando comlink), packages/ui/src/hooks/usePromptPreview.ts.

Criterio: Escribir en un input (que cambia el estado) dispara el worker. La UI no se congela; el preview se actualiza en < 200ms (objetivo).

S3-D2: Memoización Profunda y Selectores de Suscripción

Descripción: El usePromptPreview utiliza useDeferredValue para evitar re-renderizados frenéticos al teclear. Además, usa useShallow de Zustand para suscribirse solo a los campos que afectan el prompt (ignora campos de UI como isDarkMode). El worker recibe un hash del estado (calculado con object-hash). Si el hash no cambia, el worker no se ejecuta (caché por hash).

Rigor: El hash se calcula en el hilo principal (rápido). La memoización evita llamadas innecesarias al worker.

Artefacto: packages/ui/src/selectors/prompt.selectors.ts, actualización de usePromptPreview.

Criterio: Al cambiar el tema (claro/oscuro), el preview NO se regenera (no afecta al contenido). Al cambiar el domain, el preview se regenera inmediatamente.

S3-D3: Renderizado del Preview (Markdown Reactivo)

Descripción: El panel derecho renderiza el Markdown retornado por el worker usando react-markdown con remark-gfm (tablas, listas de tareas) y rehype-highlight (syntax highlighting para bloques de código). El preview tiene un scroll infinito y un botón "Copiar" que usa navigator.clipboard.

Rigor: El componente PromptPreview es un componente puro que recibe markdown y tokenCount por props. No tiene lógica de negocio.

Artefacto: packages/ui/src/components/preview/PromptPreview.tsx, packages/ui/src/components/preview/CodeBlock.tsx.

Criterio: El Markdown se renderiza con estilos coherentes al sistema de diseño (shadcn) y el token count se muestra en una badge superior (ej. "1200 tokens").

Módulo E: Orquestación de la Compilación en el Backend (API Route)
S3-E1: Implementación de /api/generate como "Compilador Remoto"

Descripción: La generación del prompt final para exportación (no preview) se hace en el servidor. La ruta POST /api/generate recibe el estado, invoca al PromptAssembler directamente (sin worker, en Node.js), y retorna el prompt en Markdown. Además, ejecuta opcionalmente el LLM-as-Judge (S5) de forma asíncrona para enriquecer la respuesta con feedback de calidad.

Rigor: La ruta valida el estado entrante con el esquema Zod global del State (S1-A2) antes de compilar. Si el estado no pasa la validación, retorna 400 con los errores detallados.

Artefacto: apps/web/src/app/api/generate/route.ts.

Criterio: POST /api/generate con un estado válido retorna { prompt: string, tokenCount: number, qualityScore?: number } en < 500ms (sin LLM).

Módulo F: Validación de Integridad del Ensamblaje (Quality Gates del Compilador)
S3-F1: Implementación del "Placeholder Validator" (Anti-Hallucination Layer)

Descripción: Después de ensamblar el prompt, el compilador ejecuta un validador que busca patrones de plantilla sin reemplazar (ej. {{project.name}} o {{#if ...}}). Si encuentra algún placeholder sin resolver, lanza un error en el build (o en el worker) indicando qué campo faltó en el estado. Esto evita que el prompt generado contenga "agujeros" sintácticos.

Rigor: El validador usa regex para {{...}} y {{{...}}}. Si se detecta uno, el ensamblaje falla con un CompilationError detallado.

Artefacto: packages/core/src/compiler/validators/placeholder.validator.ts.

Criterio: Si el desarrollador olvida mapear un campo en una capa, el preview muestra "Error de compilación: Placeholder {{project.name}} sin resolver".

S3-F2: Pruebas de Mutación sobre el Compilador (Stryker)

Descripción: Extiendo el Mutation Testing (S1-I1) al compilador. Si una mutación (ej. cambiar > por < en el CriticalPathScorer) no es detectada por las pruebas unitarias, el mutation score baja. Exijo > 95% para el compilador también.

Artefacto: packages/core/stryker.conf.json (ampliado para incluir compiler/**/*.ts).

Criterio: pnpm test:mutation sobre packages/core incluye el compilador y pasa con > 95%.

Definición de "Listo" (DoD) para el Sprint 3 (Enfoque Técnico)
Dominio Completo: Los agregados de los pasos 3-7 están implementados y validados con Zod. Todas las invariantes de negocio están en el kernel.

Registro Completo: Las 5 nuevas estrategias están registradas en el StepRegistry. El GraphValidator (S1-D1) verifica que el grafo de 8 pasos es acíclico y completo.

Compilador Operativo: El PromptAssembler puede generar un prompt en 3 modos de compresión (Minimalista, Estándar, Exhaustivo) con priorización semántica. El Critical Path Injector está activo y testeado.

Preview Reactivo: El panel derecho muestra el preview en vivo actualizado en < 200ms, con token count visible. El worker no bloquea la UI.

Validación de Placeholders: El compilador lanza un error explícito si algún placeholder queda sin resolver.

Cobertura de Mutación: El compilador y los nuevos agregados tienen Mutation Score > 95%.

API de Generación: /api/generate retorna el prompt compilado y valida el estado entrante contra el esquema Zod global.