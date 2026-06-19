**1. Referentes en GitHub: La Base de la Excelencia**

Hemos analizado los repositorios más destacados que utilizan nuestro stack tecnológico (Next.js, shadcn/ui, Tailwind CSS). Estos son los faros que guiarán nuestro diseño:

* [**next-shadcn-dashboard-starter**](https://github.com/Kiranism/next-shadcn-dashboard-starter): Un referente moderno que utiliza **Next.js 16** y **shadcn/ui**. Su valor reside en su estructura de carpetas basada en funcionalidades y su integración con herramientas como **Zustand** para el estado y **TanStack Query** para la gestión de datos. Es el modelo a seguir para una base de código escalable y mantenible.
* [**Shadcn Dashboard + Landing Page Template**](https://github.com/shadcnstore/shadcn-dashboard-landing-template): Este template es una obra maestra de diseño. Incluye más de **30 páginas** y una **personalización de temas en vivo** con tweakcn. Su enfoque en la **experiencia de desarrollador (DX)** con soporte para Vite y Next.js, y su uso de **Recharts** para visualizaciones, lo convierten en una fuente de inspiración clave.
* [**Shadboard**](https://github.com/Qualiora/shadboard): Construido con **Next.js 15** y **React 19**. Su característica más destacada es el **"Customizer"**, una herramienta que permite cambiar dinámicamente el estilo y los colores del dashboard. Esta idea de personalización en vivo es fundamental para MetaPrompter, permitiendo a los usuarios ver el impacto de sus decisiones de diseño en tiempo real.
* [**NextJS-Admin-Dashboard-ShadCN-Tailwind-CSS**](https://github.com/marleyDip/NextJS-Admin-Dashboard-ShadCN-Tailwind-CSS): Especializado en la creación de **componentes de UI reutilizables**, mostrando diseños responsivos, theming, modo oscuro y elementos interactivos. Su enfoque en la reutilización y la consistencia es el pilar de nuestro sistema de diseño.

Estos repositorios nos proporcionan el "cómo" técnico. Ahora, definamos el "qué" y el "por qué" de nuestra experiencia de usuario.

**2. Filosofía de Diseño: Principios Rectores**

El diseño de MetaPrompter se guiará por los siguientes principios, asegurando que la herramienta sea tan poderosa como elegante:

* **Minimalismo Pragmático**: Cada elemento en la pantalla tiene un propósito. Eliminamos el ruido visual (lo que Tufte llamaría "chartjunk") para enfocar la atención del usuario en la toma de decisiones. El espacio en blanco es una herramienta de diseño, no un desperdicio.
* **Jerarquía y Flujo**: La interfaz guía al usuario de forma natural a través del proceso de 7 pasos. Una barra de progreso visible, títulos claros y transiciones suaves crean una sensación de avance y control.
* **Consistencia y Confianza**: El uso de un sistema de diseño como **shadcn/ui** garantiza que todos los componentes (botones, inputs, tarjetas) se comporten y se vean de manera uniforme. Esto genera confianza y reduce la carga cognitiva.
* **Feedback Inmediato**: Cada acción del usuario, desde seleccionar una opción hasta generar el prompt final, debe tener una respuesta visual clara. El panel de vista previa del prompt en vivo es un ejemplo perfecto de este principio.
* **Accesibilidad (A11y)**: No es opcional. Usaremos los componentes accesibles de **Radix UI** (la base de shadcn/ui) y seguiremos las pautas WCAG 2.1 AA para garantizar que la herramienta sea usable por todos.

**3. Arquitectura del Front-end**

Basándonos en los referentes, definimos una arquitectura robusta y escalable.

* **Stack Tecnológico**:
  + **Framework**: Next.js 16 (App Router)
  + **Lenguaje**: TypeScript
  + **Estilos**: Tailwind CSS v4
  + **Componentes UI**: shadcn/ui (basado en Radix UI)
  + **Gestión de Estado**: Zustand
  + **Gráficos**: Recharts (para la vista previa de dashboards)
  + **Formularios y Validación**: React Hook Form + Zod
* **Estructura de Carpetas (Feature-Based)**:
  Inspirada en next-shadcn-dashboard-starter, organizaremos el código por funcionalidades para una mejor escalabilidad.

text

src/

├── app/ # Rutas de Next.js (App Router)

│ ├── (steps)/ # Grupo de rutas para el flujo principal

│ │ ├── step-1/

│ │ ├── ...

│ │ └── step-7/

│ ├── api/ # Rutas de API (para generación de prompts, etc.)

│ └── layout.tsx

├── components/ # Componentes reutilizables

│ ├── ui/ # Componentes de shadcn/ui

│ ├── shared/ # Componentes compartidos (Header, Sidebar)

│ └── steps/ # Componentes específicos de cada paso

├── lib/ # Lógica de negocio y utilidades

│ ├── store/ # Store de Zustand

│ ├── validations/ # Esquemas de Zod

│ └── prompts/ # Lógica de generación de prompts

├── hooks/ # Hooks personalizados

├── types/ # Definiciones de tipos TypeScript

└── styles/ # Estilos globales

**4. Plan de Implementación UX/UI**

**4.1. Layout Global: El Taller de Arquitectura**

* **Barra Lateral (Sidebar)**: Actuará como el índice del "taller". Mostrará los 7 pasos del proceso, resaltando el paso actual y permitiendo la navegación entre pasos completados. Será colapsable para maximizar el espacio de trabajo en pantallas pequeñas.
* **Área Principal**: Se dividirá en dos paneles principales:
  + **Panel de Configuración (Izquierda)**: Es el "banco de trabajo". Aquí el usuario interactúa con las preguntas, selecciona opciones y completa la información de cada paso.
  + **Panel de Referencias y Vista Previa (Derecha)**: Es el "tablero de inspiración". Muestra información contextual, citas de expertos, y lo más importante: una **vista previa en vivo del prompt** que se está construyendo.

**4.2. El Corazón de la Interacción: La Generación del Prompt**

* **Estado Reactivo**: Usaremos **Zustand** para manejar un estado global que contenga todas las respuestas del usuario. Este estado se actualiza en tiempo real.
* **Vista Previa en Vivo**: El panel derecho mostrará el prompt generado en formato Markdown. Utilizaremos una librería como react-markdown para renderizarlo con estilo, dando al usuario una sensación de logro y control continuos.
* **Acción Final**: Un botón prominente "Generar Prompt" consolidará todo el trabajo. Al hacer clic, se mostrará un modal con el prompt final listo para ser copiado.

**4.3. Microinteracciones y Detalles**

* **Transiciones**: Usaremos **Framer Motion** para animar suavemente los cambios entre pasos y la aparición de elementos, haciendo la experiencia más fluida y menos "a saltos".
* **Estados de Carga**: Implementaremos esqueletos (skeletons) de carga para el panel de vista previa, indicando que el sistema está procesando la información.
* **Tooltips y Ayuda**: Cada pregunta compleja tendrá un tooltip con una breve explicación o un ejemplo, manteniendo la interfaz limpia pero informativa.
* **Modo Oscuro**: Es un estándar moderno. Lo implementaremos con la funcionalidad nativa de shadcn/ui y Tailwind, ofreciendo una experiencia cómoda en cualquier entorno