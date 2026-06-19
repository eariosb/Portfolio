Sprint 1: Fundación del Kernel Semántico y Orquestador de Decisiones
Objetivo Estratégico: Construir el "Núcleo Atómico" de MetaPrompter. Este núcleo debe ser un sistema puro, determinístico, validado estáticamente y ajeno a cualquier framework de UI. Al finalizar este sprint, el 100% de la lógica de negocio (reglas de transición, validaciones de dominio, consistencia del grafo) estará encapsulado en paquetes @core que pueden ser probados sin un navegador, migrados a otro frontend o incluso ejecutados en un worker.

Módulo A: Lenguaje Ubicuo y Agregados de Dominio (DDD Estratégico)
S1-A1: Definición de Agregados Raíz y Value Objects con Zod + Branded Types

Descripción: Abandono los tipos planos de TypeScript. Implemento los agregados raíz (Project, Strategy, Architecture, Engineering, Design, Security, Testing, Deployment) como esquemas Zod inmutables. Cada agregado utiliza Branded Types (ej. type ProjectName = string & { __brand: 'ProjectName' }) para diferenciar semánticamente un nombre de proyecto de una cadena genérica. Las invariantes de negocio se aplican mediante .superRefine() en Zod: ej. si maturity === 'prototipo', el teamSize no puede superar 5; si domain === 'finanzas', compliance debe incluir SOX o PCI.

Rigor: Los agregados no exponen setters públicos. Solo se instancian mediante fábricas estáticas (Project.create(input)) que parsean y validan la entrada, devolviendo un Result<Project, ZodError> (patrón Result) en lugar de lanzar excepciones, para manejo funcional de errores.

Artefacto: packages/core/src/domain/aggregates/project.aggregate.ts, packages/core/src/domain/value-objects/, packages/core/src/domain/shared/result.ts.

Criterio: pnpm type-check falla si se intenta asignar un string a una variable de tipo ProjectName. El validador de Zod rechaza un proyecto con maturity: 'prototipo' y teamSize: 20.

S1-A2: Implementación del "State" Global como Composición de Agregados

Descripción: El estado global de MetaPrompter no es un objeto plano. Es una composición inmutable de los agregados raíz, envuelta en una interfaz MetaPrompterState. Esta interfaz expone version: string (para migraciones), currentStepId: string, y las propiedades de cada agregado. Ninguna propiedad puede ser null o undefined; se usan valores por defecto semánticos (ej. domain: 'general').

Rigor: Uso zod.infer<typeof StateSchema> para derivar el tipo TypeScript, garantizando que el tipo y la validación runtime estén sincronizados al 100% (Single Source of Truth).

Artefacto: packages/core/src/domain/state/state.aggregate.ts, packages/core/src/domain/state/state.schema.ts.

Criterio: El esquema Zod del State se utiliza para validar la hidratación desde localStorage en el Sprint 2, evitando estados corruptos.

Módulo B: Puertos del Hexágono (Contracts de Comunicación)
S1-B1: Definición de los Puertos (Ports) del Motor y Conocimiento

Descripción: Defino las interfaces abstractas que el núcleo expone al mundo exterior y las que necesita del mundo exterior. DecisionEnginePort: define transition(state, action), getAvailableSteps(state), validateStep(state). KnowledgePort: define query(term, context) (aunque su implementación real viene en S4, el contrato asegura que el motor no depende de implementaciones concretas).

Rigor: Uso el principio de Dependency Inversion (DIP). Los adaptadores (UI, APIs externas) dependerán de estos puertos, no del núcleo. Documento cada puerto con TSDoc detallado (parámetros, retornos, excepciones).

Artefacto: packages/core/src/ports/decision-engine.port.ts, packages/core/src/ports/knowledge.port.ts.

Criterio: El DecisionEngine concreto (Módulo E) implementa DecisionEnginePort. La UI (Sprint 2) solo inyecta esta interfaz, permitiendo mocks en pruebas.

Módulo C: Registro de Estrategias (Eliminación del Spaghetti YAML/JSON)
S1-C1: Implementación del "Step Strategy Registry" (Patrón de Estrategia + Chain of Responsibility)

Descripción: Rechazo el uso de JSON/YAML para lógica condicional. Cada paso se registra en un Registry mediante un archivo .strategy.ts que exporta un objeto StepStrategy<TState>. Este objeto contiene:

id: string, title, description, staticConfig: StepConfig (opciones, labels).

isVisible(state): boolean (lógica para mostrar el paso condicionalmente).

applyEffects(state): Partial<TState> (efectos colaterales al seleccionar opciones).

validate(state): ValidationReport (retorna Blockers[] y Warnings[]).

Rigor: Aplico el patrón Chain of Responsibility para resolver dependencias entre pasos de diferentes dominios (ej. el paso de Seguridad debe registrarse después del paso de Compliance). El Registry es un Singleton inmutable que se construye en tiempo de compilación mediante un bundler que recoge todos los .strategy.ts de un directorio.

Artefacto: packages/core/src/strategies/registry.ts, packages/core/src/strategies/step0.strategy.ts, ..., packages/core/src/strategies/index.ts (punto de entrada para el registro dinámico).

Criterio: Puedo registrar una nueva estrategia para un dominio "salud" simplemente creando salud.strategy.ts e importándolo en index.ts, sin modificar una sola línea del motor central (Open/Closed Principle).

S1-C2: Configuración Estática en JSON (Solo Datos, Cero Lógica)

Descripción: El contenido textual, las opciones fijas, los iconos y las URLs de referencia se mantienen en archivos JSON estáticos. Estos archivos son meros repositorios de datos que el StepStrategy consume. La lógica de "si seleccionas X, entonces muestra Y" está estrictamente prohibida en el JSON.

Rigor: El JSON se valida con un esquema Zod específico (StepConfigSchema) en tiempo de compilación, garantizando que todas las referencias a IDs de opciones existan.

Artefacto: packages/core/src/config/steps/step0.config.json, packages/core/src/config/steps/step1.config.json, etc.

Criterio: Cambiar un label en el JSON no requiere recompilar el kernel, solo reiniciar el servidor de desarrollo.

Módulo D: Validación Estática del Grafo (Integridad Matemática)
S1-D1: Implementación del Validador Topológico (Kahn's Algorithm)

Descripción: Escribo un validador que ejecuta en el build step (pnpm validate:graph). Toma el Registry (Módulo C) y construye un grafo dirigido de dependencias entre pasos (usando los next definidos en las estrategias). Aplica el Algoritmo de Kahn para:

Detectar nodos inalcanzables (dead code).
Detectar ciclos (A→B→C→A).
Verificar que todos los next apunten a un id existente en el Registry.
Rigor: El validador devuelve un reporte estructurado en JSON. Si encuentra un error, el proceso de CI (S0-F1) falla con un código de salida distinto de 0. Esto convierte los errores de grafo en errores de compilación, no en errores de runtime.

Artefacto: packages/core/src/validation/graph-validator.ts, scripts/validate-graph.ts (invocado por pnpm validate:graph).

Criterio: Si un paso declara next: 'step5' pero step5 no existe en el Registry, pnpm build falla inmediatamente con "❌ Graph validation failed: Transition to unknown node 'step5'".

Módulo E: Motor de Decisión Inmutable (Pure Reducer)
S1-E1: Implementación del DecisionEngine como Función Pura (Reducer)

Descripción: El motor no es una clase con estado. Es un conjunto de funciones puras exportadas. La función principal es transition(state: State, action: Action): TransitionResult. Action puede ser { type: 'SELECT_OPTION', stepId, optionId, value } o { type: 'NAVIGATE', targetStepId }. El motor calcula el nuevo estado aplicando applyEffects de la estrategia correspondiente y determina el siguiente paso válido.

Rigor: Uso el patrón Reducer (similar a Redux). El motor no tiene efectos secundarios (no llama a APIs, no escribe en localStorage). Es 100% determinístico: dado el mismo estado y acción, siempre retorna el mismo resultado. Esto permite usar jest con deepFreeze para pruebas de inmutabilidad.

Artefacto: packages/core/src/engine/decision-engine.ts, packages/core/src/engine/actions.ts, packages/core/src/engine/types.ts.

Criterio: transition procesa 50 pasos anidados en < 5ms (benchmark unitario). El estado resultante es una copia profunda inmutable (usando immer o spread operators anidados).

S1-E2: Implementación del Selector de Pasos Disponibles (Derived State)

Descripción: El motor expone un selector getAvailableSteps(state): StepAvailability[] que itera sobre el Registry, ejecuta isVisible(state) para cada paso, y retorna un array con el estado de cada paso (locked, available, completed). Este selector es puro y se utiliza en la UI para renderizar la barra de progreso (Sprint 2).

Rigor: Los selectores están memoizados (usando reselect o funciones de memoización manual) para evitar recalcular en cada renderizado de React.

Artefacto: packages/core/src/engine/selectors.ts.

Criterio: Si el estado cambia, getAvailableSteps recalcula solo cuando los campos relevantes para isVisible cambian.

Módulo F: Sistema de Validación Transversal (Business Rules Engine)
S1-F1: Implementación del "Rules Engine" (Patrón Especificación)

Descripción: No se trata de una función detectInconsistencies monolítica. Implemento un Rules Engine donde cada regla es una clase que implementa la interfaz IRule<TState> con métodos evaluate(state): RuleResult. Las reglas se agrupan por categoría (escalabilidad, compliance, viabilidad técnica). Ejemplos:

MicroservicesTeamSizeRule: si style === 'microservices' y team.backend + team.data < 3, retorna Blocker.

ComplianceEncryptionRule: si compliance.includes('hipaa') y encryption === 'none', retorna Blocker.

Rigor: Las reglas se inyectan en el motor mediante el Registry de estrategias (S1-C1). El motor ejecuta todas las reglas aplicables al estado actual al final de cada transition y adjunta los resultados al TransitionResult.

Artefacto: packages/core/src/rules/base.rule.ts, packages/core/src/rules/compliance.rules.ts, packages/core/src/rules/scalability.rules.ts, packages/core/src/rules/engine.ts.

Criterio: El Rules Engine tiene cobertura de mutación > 95% en S1-I1. Una violación de una regla Blocker impide que el motor permita la transición al siguiente paso.

Módulo G: Gestión de Estado con Slices y Persistencia Versionada
S1-G1: Implementación del Store con Zustand "Slices Pattern"

Descripción: Rechazo el store monolítico. Divido el store en slices usando zustand/vanilla y el patrón de fábrica de slices. Cada slice (ProjectSlice, StrategySlice, ArchitectureSlice, UISlice) contiene su propio estado parcial y las acciones que lo modifican. El store raíz combina los slices mediante zustand/vanilla's combine o mediante la creación manual de un StoreApi.

Rigor: Los slices son agnósticos del motor. Las acciones de los slices solo actualizan el estado local; no invocan al DecisionEngine. La UI orquesta la interacción: captura el evento, actualiza el slice, y luego llama al motor para obtener el nuevo paso (si aplica). Esto separa la mutación de estado de la lógica de navegación.

Artefacto: packages/core/src/store/slices/project.slice.ts, packages/core/src/store/slices/strategy.slice.ts, ..., packages/core/src/store/index.ts (combinador).

Criterio: El store raíz tiene un tipo compuesto inferido correctamente por TypeScript. useStore.getState().project.name es accesible.

S1-G2: Persistencia Estratégica con Migración de Esquema (Schema Versioning)

Descripción: Uso zustand/middleware/persist pero con un mecanismo de migración robusto. El estado persistido incluye un campo _version: string. Implemento un objeto migrations donde cada clave es una versión y el valor es una función (state) => newState. Al hidratar, el middleware verifica la versión almacenada y aplica las migraciones secuencialmente hasta alcanzar la versión actual del código.

Rigor: La validación de la hidratación se realiza con Zod (S1-A2). Si el estado almacenado no puede ser parseado ni siquiera después de las migraciones, el sistema resetea al estado por defecto de forma controlada (no crashea).

Artefacto: packages/core/src/store/middleware/persist.config.ts (contiene migrations y onRehydrateStorage).

Criterio: Si un usuario abre MetaPrompter 6 meses después, con un estado de versión 0.1.0, el sistema lo migra a 1.0.0 sin pérdida de datos y sin errores en consola.

Módulo H: Preparación de Contratos de Calidad (Interfaces para Sprints Futuros)
S1-H1: Definición de Interfaces para Token Budget y Prompt Linting

Descripción: Aunque la generación real del prompt es del Sprint 3, defino hoy las interfaces de los servicios de calidad. ITokenBudget con método compress(text, level): CompressedText y IPromptLinter con método audit(prompt): QualityReport. Estas interfaces se ubicarán en el dominio y serán implementadas en S3 y S5. Esto evita el "Refactoring Hell" y establece el contrato desde el nacimiento.

Rigor: Creo un Spike Técnico (prueba de concepto) que integra tiktoken (o gpt-tokenizer) y calcula el token count de un estado de prueba. Esto no se usa en producción aún, pero demuestra que la integración es viable y que la interfaz es correcta.

Artefacto: packages/core/src/quality/token-budget.interface.ts, packages/core/src/quality/linter.interface.ts, packages/core/src/quality/spike/token-counter.spike.ts.

Criterio: El spike se ejecuta en el CI (pero no bloquea) y genera un reporte de "Tokens estimados para un proyecto promedio: X".

Módulo I: Gobernanza de Calidad del Kernel (Mutation Testing y ADR)
S1-I1: Implementación de Mutation Testing (StrykerJS) sobre el Kernel

Descripción: Las pruebas unitarias tradicionales no garantizan calidad. Configuro StrykerJS en packages/core con el framework de pruebas Jest. Stryker muta el código (cambia > por <, elimina if, etc.) y ejecuta las pruebas. Si las pruebas pasan con el código mutado, significa que son débiles. Exijo un Mutation Score > 95% para todo el código del kernel (Módulos A-H).

Rigor: El reporte de Stryker se genera en HTML y se archiva como artefacto en el CI. Las mutaciones supervivientes se revisan obligatoriamente en la PR.

Artefacto: packages/core/stryker.conf.json, scripts/mutation-report.sh.

Criterio: pnpm test:mutation en CI falla si el puntaje es inferior a 95%. Esto garantiza que las reglas de negocio y el motor son increíblemente robustos.

S1-I2: Documentación del Kernel mediante ADR (Architecture Decision Record)

Descripción: Documento las decisiones arquitectónicas críticas tomadas en este sprint en formato ADR (Contexto, Decisión, Consecuencias). Los ADRs generados son:

ADR-001: Elección de Registry de Estrategias sobre YAML/JSON dinámico.

ADR-002: Motor como funciones puras vs Clases con estado.

ADR-003: Slices Pattern vs Store monolítico.

Rigor: Los ADRs se escriben en Markdown y se almacenan en docs/decisions/. El CI verifica que los ADRs tengan el estado "Aceptado" y estén enlazados a las tareas de Jira (si se usa).

Artefacto: docs/decisions/ADR-001-strategy-registry.md, docs/decisions/ADR-002-pure-engine.md, docs/decisions/ADR-003-slices.md.

Criterio: Un nuevo desarrollador que lea estos ADRs entiende el por qué de la arquitectura en 15 minutos, sin necesidad de preguntar al equipo.

Definición de "Listo" (DoD) para el Sprint 1 (Enfoque Técnico)
Integridad Matemática: El pnpm validate:graph pasa sin errores en CI, garantizando que el grafo de 8 pasos es acíclico y todos los nodos son alcanzables.

Inmutabilidad Comprobada: El estado global (MetaPrompterState) es tratado como inmutable. Las pruebas unitarias utilizan deepFreeze y verifican que transition no mute el estado original.

Rendimiento: El benchmark unitario de transition para 50 pasos anidados < 4ms.

Cobertura de Mutación: El Mutation Score de packages/core es > 95%.

Contratos: Las interfaces DecisionEnginePort y KnowledgePort están documentadas y son utilizadas por el motor.

Migración: El sistema de persistencia puede migrar un estado v0 a v1 sin pérdida de datos (probado con fixtures).

ADRs: Los 3 ADRs arquitectónicos están mergeados en main y enlazados a los módulos correspondientes en el código.

