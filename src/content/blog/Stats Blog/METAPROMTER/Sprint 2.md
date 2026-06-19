Sprint 2: La Capa de Adaptación de Presentación (UI Adapters)
Objetivo Estratégico: Construir la capa de puertos y adaptadores del lado del cliente. Esta capa debe traducir las interacciones del usuario (clics, escritura) en comandos para el motor puro, y proyectar los estados del motor en elementos visuales. Ni un solo if de lógica de negocio debe existir en los componentes de React; toda la inteligencia reside en el kernel (S1) y los hooks de orquestación que lo envuelven.

Módulo A: La Capa Anti-Corrupción (Hooks de Orquestación)
S2-A1: Implementación de "Facade Hooks" para el Kernel

Descripción: Rechazo el uso directo del store y del motor en los componentes. Creo hooks personalizados (ej. useStepEngine, useProject, useNavigation) que actúan como una Fachada (Facade) sobre el kernel puro (S1).

useStepEngine expone goToNext(), goToPrevious(), goToStep(id). Internamente, obtiene el estado del store, invoca al DecisionEngine.transition(state, action), y despacha el nuevo estado al store.

useProject expone updateProject(field, value) que valida el dato contra el esquema Zod del Agregado (S1-A1) antes de actualizar el slice.

Rigor: Los hooks son la única vía de entrada desde la UI al dominio. Los componentes reciben estos hooks por inyección (dependencia) o los importan desde un archivo central. Esto permite mockearlos en pruebas E2E.

Artefacto: packages/ui/src/hooks/useStepEngine.ts, packages/ui/src/hooks/useProject.ts, packages/ui/src/hooks/useStrategy.ts.

Criterio: Ningún componente importa useStore directamente. Todos usan los hooks de dominio. La función goToNext maneja el caso de borde donde el motor retorna un TransitionResult con blockers (no permite avanzar).

S2-A2: Implementación del "Store Subscriber" (Sincronización Estado ↔ Motor)

Descripción: Creo un suscriptor que escucha los cambios en el store (Zustand) y, si el currentStepId cambia, notifica al sistema de telemetría (S6) y actualiza el título del documento (SEO). Este suscriptor es un efecto secundario controlado que no tiene lógica de decisión, solo lógica de "proyección".

Rigor: Uso zustand's subscribe directamente en un useEffect del layout raíz.

Artefacto: packages/ui/src/lib/store-subscriber.ts.

Criterio: Al cambiar de paso, la pestaña del navegador muestra "MetaPrompter - Paso 2: Arquitectura".

Módulo B: El Orquestador Visual de Navegación (StepWizard)
S2-B1: Implementación del StepWizard como "Proyector de Grafos"

Descripción: El StepWizard no es un array de strings. Es un componente que consume el selector getAvailableSteps(state) del motor (S1-E2) y renderiza dinámicamente los ítems. Cada ítem recibe su estado (locked, available, completed, active) derivado del selector. La barra de progreso se pinta según el índice del paso activo dividido por el total de pasos alcanzables.

Rigor: Los ítems locked tienen un tooltip que muestra el Blocker retornado por el Rules Engine (ej. "No puedes acceder a Seguridad sin definir Compliance"). Los ítems completed son clickeables y disparan goToStep(id).

Artefacto: packages/ui/src/components/navigation/StepWizard.tsx, packages/ui/src/components/navigation/StepWizardItem.tsx.

Criterio: El selector getAvailableSteps se ejecuta en el hook useMemo, con dependencias en los campos que afectan isVisible (definidos en el strategy del S1-C1). La barra de progreso se actualiza sin rerenderizar todo el árbol.

Módulo C: Boundaries y Layout Estructural (Dos Paneles)
S2-C1: Implementación del Layout Hexagonal (Read/Write Boundary)

Descripción: El layout se divide en Panel de Configuración (Input/Write) y Panel de Referencias (Output/Read-only). Establezco un límite estricto: el panel izquierdo solo escribe en el store (mediante los hooks Fachada). El panel derecho solo lee del store (mediante selectores memoizados). No hay comunicación directa entre paneles; todo pasa por el estado global.

Rigor: El panel derecho utiliza useShallow de Zustand para suscribirse solo a las propiedades que necesita (ej. currentStepId, promptPreview). Esto evita rerenderizados al escribir en inputs.

Artefacto: packages/ui/src/layouts/AppLayout.tsx, packages/ui/src/layouts/MainPanel.tsx, packages/ui/src/layouts/ReferencePanel.tsx.

Criterio: Escribir en un input del panel izquierdo NO causa un rerender del panel derecho. Solo el cambio de paso actualiza el panel derecho.

S2-C2: Implementación del Header Global (Controles de Sistema)

Descripción: El Header contiene el Logo (que redirige al paso 0), el ThemeToggle (S0-C2), y el LanguageSwitcher (que cambia el locale mediante next-intl y refresca la ruta). El header es un componente presentacional puro que consume los hooks de sistema.

Rigor: El LanguageSwitcher usa cookies para persistir el idioma y router.refresh() para recargar el layout con las nuevas traducciones.

Artefacto: packages/ui/src/components/navigation/AppHeader.tsx, packages/ui/src/components/navigation/LanguageSwitcher.tsx.

Criterio: Cambiar el tema o el idioma no resetea el estado del store (solo afecta a la capa de presentación).

Módulo D: El Motor de Renderizado de Formularios (DynamicForm)
S2-D1: Implementación del "Field Factory" (Patrón Abstract Factory)

Descripción: No codifico formularios manualmente. Implemento un renderizador dinámico que toma el StepConfig (JSON estático del S1-C2) y el esquema Zod del agregado correspondiente, y genera los campos de React Hook Form (RHF) mediante una fábrica de componentes. La fábrica mapea type: 'text' → Input, type: 'select' → Select, type: 'multiselect' → Combobox, type: 'table' → DynamicTableField (para la tabla de usuarios).

Rigor: El DynamicForm usa useForm de RHF con zodResolver (validación síncrona en cada keystroke). Los valores se sincronizan con el store mediante onChange o onBlur, pero el estado local del formulario (para validación de campos) se mantiene en RHF, no en el store global. Solo al perder el foco o al hacer submit se actualiza el store, para evitar escrituras excesivas.

Artefacto: packages/ui/src/components/forms/DynamicForm.tsx, packages/ui/src/components/forms/fields/FieldFactory.tsx, packages/ui/src/components/forms/fields/TableField.tsx.

Criterio: Un nuevo paso se añade simplemente creando su StepConfig y su Zod Schema en el kernel; el DynamicForm lo renderiza automáticamente sin tocar el código de la UI.

S2-D2: Implementación del "TableField" (Grid dinámica para Usuarios)

Descripción: El paso de Estrategia requiere una tabla de usuarios (rol, necesidad, frecuencia, nivel técnico). Implemento un componente TableField que renderiza una grilla con filas añadibles/eliminables. Cada fila tiene validaciones cruzadas (ej. no se pueden añadir usuarios sin rol). La lógica de validación de la tabla está en el esquema Zod del Agregado de Estrategia (S1-A1).

Rigor: La tabla usa useFieldArray de React Hook Form para gestionar la lista dinámica. La actualización al store se hace al perder el foco o al añadir/eliminar filas.

Artefacto: packages/ui/src/components/forms/fields/TableField.tsx, packages/ui/src/components/forms/fields/TableRow.tsx.

Criterio: Añadir 5 filas y luego hacer clic en "Siguiente" persiste la tabla completa en el store.

Módulo E: Guardias de Navegación (Validación Pre-Transición)
S2-E1: Implementación del "Navigation Guard" (Blocker/Warning UI)

Descripción: El botón "Siguiente" no es un simple <button onClick={goToNext}>. Antes de ejecutar la transición, invoca al método validateStep(state) del motor (S1-E1). Si el motor retorna un Blocker[], el botón se deshabilita y se muestra un mensaje de error derivado del Rules Engine (S1-F1). Si retorna Warning[], el botón se habilita pero se muestra un banner amarillo con las advertencias (ej. "Tu equipo es pequeño para microservicios").

Rigor: Este comportamiento está encapsulado en el hook useStepValidation. El estado de validación se almacena en el slice de UI (para mostrar/ocultar mensajes), no en el dominio.

Artefacto: packages/ui/src/components/navigation/NavigationGuard.tsx, packages/ui/src/components/navigation/ValidationBanner.tsx.

Criterio: Si el usuario olvida completar el campo "Nombre del proyecto", el botón "Siguiente" está gris y muestra un tooltip: "El nombre es obligatorio".

Módulo F: Implementación de los Pasos 0, 1 y 2 (Configuración Pura)
S2-F1: Registro del Paso 0 (Fundación) en el Renderer

Descripción: Creo el StepConfig para el paso 0 en JSON: campos name (text), description (textarea), domain (select con finanzas, salud, retail, etc.), maturity (select con prototipo, mvp, producción, escala), team (group con backend, frontend, data como number inputs). Lo vinculo al ProjectSchema del kernel. La UI del paso 0 se renderiza completamente mediante el DynamicForm.

Rigor: El JSON tiene referencias a los id de los campos que coinciden con las claves del Zod Schema.

Artefacto: packages/core/src/config/steps/step0.config.json, actualización de StepRegistry.

Criterio: El formulario del paso 0 aparece automáticamente en el panel izquierdo sin escribir una línea de JSX específica para ese paso.

S2-F2: Registro del Paso 1 (Estrategia) en el Renderer

Descripción: Creo el StepConfig para el paso 1: campos problem (textarea), users (tabla con columnas role (text), need (text), frequency (select: diario, semanal, mensual), techLevel (select: bajo, medio, alto)), successMetric (text), compliance (multiselect: gdpr, hipaa, sox, pci). El campo users usa el TableField del módulo D2.

Rigor: La validación de que al menos un usuario debe existir está en el StrategySchema del kernel.

Artefacto: packages/core/src/config/steps/step1.config.json.

Criterio: La tabla de usuarios se renderiza con botones "Agregar fila" y "Eliminar" y valida que no quede vacía.

S2-F3: Registro del Paso 2 (Arquitectura) en el Renderer

Descripción: Creo el StepConfig para el paso 2: campos style (select: hexagonal, capas, microservicios, modular), backend (select: fastapi, express, go-chi, aspnet), frontend (select: nextjs, vite, none), database (select: postgresql, mongodb, duckdb), cache (select: redis, none), async (select: celery, bull, rabbitmq, none).

Rigor: Las opciones de backend dependen del domain (ej. si es finanzas, se prioriza .NET). Esta lógica no está en el JSON, sino en el método isVisible de la estrategia del paso en el Registry (S1-C1), que puede modificar el array de opciones pasando un filter basado en el estado.

Artefacto: packages/core/src/config/steps/step2.config.json, actualización de step2.strategy.ts para aplicar efectos condicionales.

Criterio: Si el usuario selecciona domain: 'finanzas', la opción aspnet aparece resaltada como "Recomendada" en el select de backend.

Módulo G: Orquestación de Efectos Visuales (Animaciones Desacopladas)
S2-G1: Implementación de Transiciones como "Efecto Secundario" (Framer Motion)

Descripción: Las animaciones (Framer Motion) son un efecto de UI que no afecta al estado del motor. El contenedor principal del paso (el que cambia) se envuelve en un motion.div con AnimatePresence. La animación se dispara únicamente cuando cambia el currentStepId en el store, no cuando cambia el estado interno del formulario.

Rigor: Uso layoutId para animar elementos comunes entre pasos (ej. el título del paso). Las animaciones tienen transition: { duration: 0.2 } para cumplir con el umbral de <100ms de interacción percibida.

Artefacto: packages/ui/src/components/layout/StepTransition.tsx (wrapper sobre motion.div).

Criterio: Cambiar de paso desencadena una transición suave de entrada/salida. Escribir en un input (que no cambia de paso) no desencadena animación alguna.

Módulo H: Gobernanza de Rendimiento y Accesibilidad (Quality Gates UI)
S2-H1: Implementación de "Selector Memoizado" (Prevención de Rerenders)

Descripción: Creo selectores memoizados con reselect (o usando createSelector de Zustand) para todos los datos que se proyectan en la UI. El panel de referencias (derecho) se suscribe solo al currentStepId y a las referencias locales. El panel izquierdo se suscribe a su propio slice.

Rigor: Configuro React DevTools para verificar que los componentes no se rerenderizan innecesariamente. Establezco una regla de equipo: los componentes de UI deben usar React.memo y los callbacks deben estar envueltos en useCallback.

Artefacto: packages/ui/src/selectors/project.selectors.ts, packages/ui/src/selectors/ui.selectors.ts.

Criterio: Lighthouse > 90 en Performance y Accessibility. El Time to Interactive (TTI) es < 1.5s.

S2-H2: Implementación de axe-core para Accesibilidad en Desarrollo

Descripción: Integro @axe-core/react en el entorno de desarrollo. Si un componente viola una regla de WCAG 2.1 AA (contraste, roles ARIA, etiquetas de formulario), se muestra una advertencia en la consola del navegador durante el desarrollo. Esto no bloquea el build, pero asegura que el equipo corrige los problemas de accesibilidad a medida que se desarrollan.

Rigor: Los componentes de shadcn/ui ya cumplen con Radix UI (accesible), pero validamos los campos personalizados (ej. TableField).

Artefacto: packages/ui/src/lib/axe-setup.ts (solo para NODE_ENV === 'development').

Criterio: Las pruebas E2E (S6) incluyen un paso que ejecuta axe sobre la página completa y falla si hay violaciones críticas.

Definición de "Listo" (DoD) para el Sprint 2 (Enfoque Técnico)
Arquitectura de Adaptadores: Todos los componentes de UI utilizan exclusivamente los Facade Hooks (S2-A1) para interactuar con el estado y el motor. El store no se importa en ningún componente.

Renderizado Dinámico: Los pasos 0, 1 y 2 son renderizados completamente por el DynamicForm (Módulo D). No existe código JSX específico para estos pasos (cero duplicación).

Guardias Activas: El botón "Siguiente" está deshabilitado si el Rules Engine (S1-F1) retorna Blockers. Las advertencias se muestran visualmente.

Performance: El panel derecho (Referencias) no se rerenderiza al escribir en inputs del panel izquierdo. El Lighthouse Score en desarrollo es > 90 (verificado con lighthouse-ci en modo local).

Accesibilidad: axe-core no reporta violaciones críticas en los formularios dinámicos ni en el StepWizard.

Inmutabilidad del Kernel: El kernel (S1) sigue siendo 100% puro. La UI solo invoca transition mediante los hooks Fachada y recibe el nuevo estado.