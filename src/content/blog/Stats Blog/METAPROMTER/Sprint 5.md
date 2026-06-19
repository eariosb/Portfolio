Sprint 5: La Capa de Gobernanza, Serialización y Bucle de Retroalimentación
Objetivo Estratégico: Completar los adaptadores de salida del hexágono, garantizando que el conocimiento generado (prompt y decisiones) pueda ser materializado en formatos interoperables (Markdown, ADR, JSON). Añadir las políticas de Experiencia de Usuario de Alto Rendimiento (Skeletons, Responsive, Accesibilidad validada) e implementar el puerto de telemetría que recolecta feedback anonimizado para cerrar el ciclo de mejora continua.

Módulo A: La Fábrica de Exportación (Serialización Multi-Formato)
S5-A1: Implementación del "Export Adapter Factory" (Patrón Strategy para Formatos)

Descripción: Rechazo la implementación de exportaciones como funciones sueltas. Implemento una fábrica de adaptadores de exportación que implementan la interfaz IExporter<T>. Cada exportador es una estrategia concreta:

MarkdownExporter: Toma el prompt compilado (S3) y genera un archivo .md con frontmatter YAML (metadatos: fecha, versión del kernel, dominio).

ADRExporter: Toma el estado y el historial de decisiones (rechazadas vs seleccionadas) y genera un documento estructurado en Markdown.

JSONExporter: Toma el estado crudo, aplica un Serializer que elimina campos transitorios de UI (ej. ui.isDarkMode, ui.isLoading) y devuelve un JSON plano y compacto.

Rigor: Los exportadores son funciones puras que reciben el estado y retornan un ExportArtifact { mimeType, filename, content }. No tienen efectos secundarios. La descarga se gestiona en el adaptador de UI (Módulo C).

Artefacto: packages/core/src/exporters/interfaces/IExporter.ts, packages/core/src/exporters/MarkdownExporter.ts, ADRExporter.ts, JSONExporter.ts, packages/core/src/exporters/ExporterFactory.ts.

Criterio: ExporterFactory.getExporter('markdown').export(state) retorna un string con el prompt completo y el frontmatter correcto.

S5-A2: Implementación del "ADR Generator" (Compilador de Decisiones Arquitectónicas)

Descripción: El ADR no es un template estático. Es un compilador de decisiones que recorre el grafo de pasos y construye un documento narrativo:

Contexto: Estado actual del proyecto (dominio, madurez, problema).

Decisión: Opciones seleccionadas en cada paso, con justificación extraída del StepStrategy.validate (ej. "Se eligió hexagonal porque el equipo es > 5").

Consecuencias: Impacto en el stack, equipo y plazos (derivado de reglas de escalabilidad).

Alternativas Rechazadas: Opciones no seleccionadas en el paso de Arquitectura (ej. "Se rechazó microservicios por tamaño del equipo").

Rigor: El compilador utiliza el RulesEngine (S1-F1) para inferir las consecuencias y el StepRegistry para obtener las opciones rechazadas. Todo es determinístico.

Artefacto: packages/core/src/exporters/ADRCompiler.ts.

Criterio: El ADR generado incluye explícitamente "Alternativas Rechazadas" con las razones técnicas extraídas del sistema de reglas.

Módulo B: El Sistema de Ayuda Contextual (Tooltips con Conocimiento Vivo)
S5-B1: Implementación del "Contextual Help Adapter" (RAG-powered Tooltips)

Descripción: Los tooltips no son textos estáticos en JSON. Creo un adaptador que, dado un fieldId y el estado actual, consulta al KnowledgePort (S4) y recupera el fragmento más relevante del corpus local. Este fragmento se muestra en un popover (shadcn/ui) enriquecido con el autor y la fuente. El tooltip se renderiza con un botón "Ver más" que abre el modal de referencia completa.

Rigor: La consulta al KnowledgePort se memoiza en el cliente (cache por fieldId + domain). Si no hay resultado, se muestra un texto de fallback desde el StepConfig JSON. El tooltip se dispara solo con hover y focus (accesible).

Artefacto: packages/ui/src/components/forms/ContextualHelp.tsx, packages/ui/src/hooks/useFieldHelp.ts.

Criterio: Al hacer hover sobre el campo "Estilo arquitectónico", aparece un tooltip citando a Robert C. Martin sobre la independencia de frameworks.

Módulo C: Adaptadores de UI para Exportación (Descarga e Interacción)
S5-C1: Implementación del "Download Adapter" (Blob + FileSaver)

Descripción: El botón "Exportar" en la UI no descarga directamente; invoca al ExportAdapter que:

Llama al ExporterFactory correspondiente.
Crea un Blob con el contenido y el MIME type correcto (text/markdown, application/json).
Usa URL.createObjectURL y un enlace <a> programático para disparar la descarga sin bloqueos (evita window.open).
Rigor: La descarga se maneja en un Web Worker o en un requestIdleCallback para no bloquear el hilo principal. El tamaño máximo esperado del JSON es < 50KB, por lo que la descarga es instantánea.

Artefacto: packages/ui/src/lib/download-adapter.ts.

Criterio: Hacer clic en "Descargar Prompt" descarga un archivo .md con el contenido exacto del preview, sin caracteres corruptos (UTF-8).

S5-C2: Implementación del "Export Modal" (Selector de Formatos)

Descripción: Creo un modal que permite al usuario seleccionar el formato de exportación (Markdown, ADR, JSON) y el nivel de detalle (Minimalista/Estándar/Exhaustivo) que afecta al compilador del prompt (S3). El modal muestra una vista previa del contenido antes de descargar (opcional).

Rigor: El modal es un componente puro controlado por el slice de UI (ui.exportModalOpen). No contiene lógica de negocio.

Artefacto: packages/ui/src/components/export/ExportModal.tsx.

Criterio: Cambiar el nivel de detalle en el modal actualiza la vista previa del contenido en tiempo real (usando el worker del Sprint 3).

Módulo D: Políticas de Experiencia de Usuario de Alto Rendimiento (UX Resilience)
S5-D1: Implementación de "Skeleton Loaders" con Suspense Boundaries

Descripción: Reemplazo los spinners genéricos por Skeleton Loaders específicos al componente (ej. skeleton de tarjeta de referencia, skeleton de preview de prompt). Uso React.Suspense para envolver las secciones que cargan datos asíncronos (búsqueda de referencias, compilación del prompt). El fallback es un Skeleton component que imita la estructura final con colores bg-muted animados (pulse).

Rigor: Los skeletons respetan la misma altura y estructura del contenido real para evitar Cumulative Layout Shift (CLS). Uso aspect-ratio y dimensiones fijas en los contenedores. La animación usa @keyframes pulse de Tailwind.

Artefacto: packages/ui/src/components/skeletons/ReferenceSkeleton.tsx, PromptPreviewSkeleton.tsx, packages/ui/src/providers/SuspenseProvider.tsx.

Criterio: Lighthouse mide CLS = 0 al cargar el panel de referencias con skeletons.

S5-D2: Implementación del "Responsive Adapter" (Mobile-First Grid)

Descripción: El layout de dos paneles (S2-C1) se convierte en un Adaptador de Layout que usa CSS Grid con grid-cols-1 en móvil y grid-cols-2 en desktop (lg:grid-cols-2). En móvil, el panel de referencias se colapsa en un Acordeón (shadcn/ui) debajo del panel de configuración. El StepWizard se convierte en un Stepper Horizontal en móvil (usando overflow-x-auto).

Rigor: Uso useMediaQuery (hook personalizado con matchMedia) para cambiar la disposición en lugar de solo CSS, permitiendo animaciones de transición entre estados. Los breakpoints son 640px, 1024px y 1280px.

Artefacto: packages/ui/src/layouts/ResponsiveLayout.tsx, packages/ui/src/hooks/useBreakpoint.ts.

Criterio: En un iPhone SE (375px), el panel de referencias está colapsado detrás de un botón "Mostrar referencias". En desktop, ambos paneles están visibles.

Módulo E: Gobernanza de Accesibilidad (Theme Adapter y Contraste)
S5-E1: Implementación del "Accessibility Governor" (axe-core en CI)

Descripción: Integro @axe-core/playwright en las pruebas E2E (Sprint 6). Cada prueba E2E ejecuta await injectAxe() y await checkA11y() después de cada interacción clave. Si se viola una regla de WCAG 2.1 AA (ej. contraste < 4.5:1), la prueba falla. Esto convierte la accesibilidad en una condición de merge en el CI.

Rigor: Configuro el ThemeAdapter (S0-C2) para que los tokens de color (primario, secundario, muted) estén definidos en CSS Custom Properties y validados por un script que calcula el ratio de contraste contra el fondo. Si un token no cumple, el pnpm build falla (usando color-contrast-checker en Node).

Artefacto: packages/core/scripts/validate-contrast.ts, tests/e2e/a11y/accessibility.spec.ts.

Criterio: El botón primario en modo claro (#3b82f6) sobre fondo blanco tiene un ratio de contraste > 4.5:1 (verificado por script). pnpm test:e2e incluye un paso de axe-core que pasa sin violaciones.

S5-E2: Refinamiento de Tokens de Color (Dark Mode Semántico)

Descripción: En lugar de colores fijos, defino tokens semánticos (--background, --foreground, --primary, --muted) que se mapean a diferentes valores en light y dark. Uso tailwindcss con dark: prefijo, pero centralizo los valores en globals.css usando @layer base. El ThemeAdapter cambia la clase dark en el <html> y el CSS se encarga del resto.

Rigor: Los tokens se extraen de shadcn/ui pero se sobreescriben para cumplir con los estándares de accesibilidad (manteniendo el contraste en modo oscuro). Uso oklch para colores perceptuales en lugar de rgb.

Artefacto: packages/ui/src/styles/tokens.css, actualización de tailwind.config.ts para usar las variables CSS.

Criterio: El texto secundario (--muted-foreground) en modo oscuro es #a3a3a3 sobre fondo #0a0a0a, ratio de contraste > 7:1.

Módulo F: Bucle de Retroalimentación y Telemetría (Self-Improvement Loop)
S5-F1: Implementación del "Feedback Port" (Anonymized Telemetry)

Descripción: Creo el puerto IFeedbackPort con el método sendFeedback(data: FeedbackData). El adaptador concreto (TelemetryAdapter) recopila:

promptHash (hash del prompt generado).

stateHash (hash del estado del usuario, para correlacionar con calidad).

userRating (1-5 estrellas).

comment (texto opcional, anonimizado).

qualityScore (del LLM-as-Judge del Sprint 5, si está disponible).

Rigor: El adaptador anonymiza los datos antes de enviarlos: elimina project.name, project.description, cualquier texto libre del usuario (reemplazándolo por categorías semánticas). La IP se trunca. Los datos se envían a /api/feedback que los almacena en un archivo JSON rotativo o en una base de datos (para análisis offline).

Artefacto: packages/core/src/ports/IFeedbackPort.ts, packages/core/src/telemetry/TelemetryAdapter.ts, apps/web/src/app/api/feedback/route.ts.

Criterio: El usuario hace clic en "Calificar" y la petición se envía en segundo plano (sin bloquear la UI). El promptHash permite correlacionar la calificación con la calidad del prompt generado.

S5-F2: Implementación del "Quality Dashboard" (Interno, para el equipo)

Descripción: Creo una ruta interna (protegida por variable de entorno) /admin/quality que muestra un dashboard con:

Promedio de calificaciones de usuarios por dominio.

Prompts con mejor y peor puntuación (anonimizados).

Correlación entre opciones seleccionadas y calidad percibida (ej. "Los proyectos que usan Hexagonal tienen +0.5 estrellas").

Rigor: Este dashboard es estático (generado en build) o se sirve bajo demanda con datos agregados. No expone información sensible.

Artefacto: apps/web/src/app/admin/quality/page.tsx, packages/core/src/telemetry/AnalyticsAggregator.ts.

Criterio: El equipo puede ver métricas agregadas de calidad para tomar decisiones de mejora continua (ej. mejorar la estrategia de UI/UX).

Definición de "Listo" (DoD) para el Sprint 5 (Enfoque Técnico)
Fábrica de Exportación: Los 3 exportadores (Markdown, ADR, JSON) están implementados y producen artefactos correctamente formateados. El ADR incluye alternativas rechazadas extraídas del grafo.

Ayuda Contextual: Los tooltips de campos complejos consultan al KnowledgePort y muestran citas relevantes en lugar de texto estático.

UX Resilience: Los Skeleton Loaders están integrados con React.Suspense. CLS = 0 en los paneles de referencia y preview. El layout es 100% responsive (mobile-first).

Accesibilidad: axe-core se ejecuta en las pruebas E2E (S6) y pasa sin violaciones. Los scripts de contraste validan los tokens de color en el build.

Feedback Loop: El TelemetryAdapter envía datos anonimizados a /api/feedback. El equipo puede consultar métricas agregadas en /admin/quality.

Performance: Lighthouse Score > 95 en todas las categorías (Performance, Accesibilidad, SEO, Best Practices), verificado en CI.

Fundamento Ingenieril:

Este Sprint 5 convierte a MetaPrompter en un ecosistema completo de ciclo de vida del software:

Exportación como Serialización: Tratar la exportación como una capa de serialización (al igual que la persistencia en S1) permite añadir nuevos formatos (ej. PDF, DOCX) sin tocar el dominio.

Ayuda como RAG: Los tooltips no son "texto muerto"; son dinámicos y educativos, integrando el sistema de conocimiento extendido directamente en el acto de llenar formularios.

Accesibilidad como Condición de Compilación: Automatizar la accesibilidad en el CI (con axe-core y contraste) asegura que el producto sea usable por todos, sin excepciones.

Feedback como Combustible para el Modelo: La telemetría anonimizada es la base del "Sistema de Recompensa" (documentado en el Core Técnico). Este bucle permite en el futuro entrenar modelos de recomendación que sugieran opciones óptimas basadas en datos reales de calidad.

