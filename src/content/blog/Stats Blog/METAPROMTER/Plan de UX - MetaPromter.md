**Plan de UX/UI para MetaPrompter**

Como Senior Web Designer, el objetivo es construir una herramienta que sea un **taller de arquitectura de software**: una interfaz que guíe al usuario con precisión quirúrgica, eliminando fricción y maximizando la claridad. El diseño debe ser invisible, permitiendo que el usuario se concentre en las decisiones de alto nivel.

**1. Filosofía de Diseño**

| Principio | Aplicación |
| --- | --- |
| **Minimalismo Pragmático** | Cada elemento tiene un propósito. Eliminamos ruido visual (chartjunk) para enfocar la atención en la toma de decisiones. El espacio en blanco es una herramienta de diseño, no un desperdicio. |
| **Jerarquía y Flujo** | La interfaz guía al usuario a través del proceso de 7 pasos. Una barra de progreso visible, títulos claros y transiciones suaves crean una sensación de avance y control. |
| **Consistencia y Confianza** | El uso de **shadcn/ui** garantiza que todos los componentes (botones, inputs, tarjetas) se comporten y se vean de manera uniforme. Esto genera confianza y reduce la carga cognitiva. |
| **Feedback Inmediato** | Cada acción del usuario, desde seleccionar una opción hasta generar el prompt final, debe tener una respuesta visual clara. El panel de vista previa del prompt en vivo es un ejemplo perfecto de este principio. |
| **Accesibilidad (A11y)** | No es opcional. Usamos componentes accesibles de **Radix UI** (la base de shadcn/ui) y seguimos las pautas WCAG 2.1 AA. |

**Referencia**: El repositorio [next-shadcn-dashboard-starter](https://github.com/kiranism/next-shadcn-dashboard-starter) (6,000+ estrellas) implementa estos principios con una estructura de carpetas basada en funcionalidades. El repositorio [marleyDip/NextJS-Admin-Dashboard-ShadCN-Tailwind-CSS](https://github.com/marleyDip/NextJS-Admin-Dashboard-ShadCN-Tailwind-CSS) demuestra cómo diseñar un dashboard escalable con componentes reutilizables, theming, modo oscuro y elementos interactivos.

**2. Sistema de Diseño y Componentes**

| Elemento | Elección | Justificación |
| --- | --- | --- |
| **Sistema de diseño** | shadcn/ui | Componentes accesibles, sin opinión, copiados localmente. Sin conflictos de versiones. |
| **Framework CSS** | Tailwind CSS v4 | Utilidades para iteración rápida sin runtime CSS-in-JS. |
| **Iconos** | Lucide React | Conjunto consistente, integrado con shadcn/ui. |
| **Gráficos** | Recharts | Para vista previa de dashboards. Simple, componible, con tooltips y leyendas animadas. |
| **Tablas** | TanStack Table | Para datos estructurados (ej. tablas de usuarios). Sorting, paginación, filtrado. |
| **Formularios** | React Hook Form + Zod | Validación tipada y eficiente. |

**Referencia**: El repositorio [AndriianChestnykh/ui-poc3](https://github.com/AndriianChestnykh/ui-poc3-portfolio-as-a-service-next-shadcn-admin-dashboard) utiliza Next.js 16, TypeScript, Tailwind CSS v4 y Shadcn UI con temas personalizables (Tangerine, Neo Brutalism, Soft Pop) y layouts flexibles (sidebar colapsable, anchos variables).

**3. Arquitectura de Front-end**

**3.1 Estructura de Carpetas (Feature-Based con Colocación)**

Inspirada en next-shadcn-dashboard-starter y la arquitectura de colocación:

text

src/

├── app/

│ ├── (steps)/ # Grupo de rutas para el flujo principal

│ │ ├── step-1/page.tsx

│ │ ├── ...

│ │ └── step-7/page.tsx

│ ├── api/ # Rutas de API (generación de prompts, etc.)

│ ├── layout.tsx # Root layout con ThemeProvider

│ └── page.tsx # Redirige a /step-1

├── components/

│ ├── ui/ # Componentes de shadcn/ui (generados)

│ ├── shared/ # Header, Sidebar, StepWizard

│ └── steps/ # Componentes específicos de cada paso

├── lib/

│ ├── store/ # Zustand store

│ ├── validations/ # Esquemas Zod

│ └── prompts/ # Lógica de generación de prompts

├── hooks/ # Hooks personalizados

├── types/ # Definiciones TypeScript

└── styles/ # Estilos globales

**3.2 Layout de Dos Paneles**

El layout principal sigue el patrón de **dos paneles**:

| Panel | Contenido | Comportamiento |
| --- | --- | --- |
| **Izquierda (Configuración)** | Preguntas del paso actual, formularios, opciones | Scrollable, ancho fijo (50%) |
| **Derecha (Referencias + Preview)** | Referencias contextuales, vista previa del prompt en vivo | Scrollable, ancho fijo (50%), colapsable en móvil |

**Referencia**: El repositorio [NaveenDA/shadcn-nextjs-dashboard](https://github.com/NaveenDA/shadcn-nextjs-dashboard) implementa un layout profesional con sidebar de navegación, diseño responsivo mobile-first y tipado completo.

**4. Flujo de Usuario y Navegación**

**4.1 Barra de Progreso (StepWizard)**

* Muestra los 7 pasos con numeración y títulos cortos.
* El paso actual se resalta con color primario.
* Los pasos completados son clickeables para navegación libre.
* Los pasos no completados están deshabilitados.

**4.2 Transiciones entre Pasos**

* **Framer Motion** para animaciones suaves de entrada/salida.
* Transición de desvanecimiento + desplazamiento vertical (300ms).
* Desactivar transiciones durante el cambio de tema (disableTransitionOnChange).

**4.3 Microinteracciones**

| Elemento | Interacción |
| --- | --- |
| Botones | Hover: escala 1.02, sombra sutil. Click: escala 0.98. |
| Inputs | Focus: anillo de color primario (ring-2). |
| Tarjetas | Hover: sombra elevada, borde sutil. |
| Tooltips | Aparecen con retraso de 200ms, posición superior. |

**Referencia**: El repositorio [marleyDip/NextJS-Admin-Dashboard-ShadCN-Tailwind-CSS](https://github.com/marleyDip/NextJS-Admin-Dashboard-ShadCN-Tailwind-CSS) incluye componentes interactivos como dropdowns, modales, tooltips, skeleton loaders y más.

**5. Gestión de Tema: Modo Claro/Oscuro**

**5.1 Implementación Técnica**

Usamos next-themes para manejar el tema con 2 líneas de código:

tsx

// app/layout.tsx

import { ThemeProvider } from 'next-themes'

export default function Layout({ children }) {

return (

<html suppressHydrationWarning>

<body>

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>

{children}

</ThemeProvider>

</body>

</html>

)

}

**5.2 Toggle de Tema**

tsx

// components/shared/ThemeToggle.tsx

"use client"

import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {

const { setTheme } = useTheme()

return (

<DropdownMenu>

<DropdownMenuTrigger asChild>

<Button variant="outline" size="icon">

<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

<span className="sr-only">Toggle theme</span>

</Button>

</DropdownMenuTrigger>

<DropdownMenuContent align="end">

<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>

<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>

<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>

</DropdownMenuContent>

</DropdownMenu>

)

}

**Referencia**: El artículo de Medium sobre theming en shadcn UI explica este patrón en detalle.

**5.3 Paleta de Colores**

| Rol | Light | Dark |
| --- | --- | --- |
| Fondo | #ffffff | #0a0a0a |
| Superficie | #f8f9fa | #1a1a1a |
| Borde | #e5e7eb | #2a2a2a |
| Texto primario | #111827 | #f9fafb |
| Texto secundario | #6b7280 | #9ca3af |
| Primario | #3b82f6 | #60a5fa |

**Referencia**: El dashboard de AndriianChestnykh usa el tema **shadcn neutral** por defecto e incluye presets de color inspirados en Tweakcn.

**6. Internacionalización (i18n): Toggle Inglés/Español**

**6.1 Implementación con next-intl**

tsx

// i18n/request.ts

import { getRequestConfig } from 'next-intl/server'

import { cookies } from 'next/headers'

export default getRequestConfig(async () => {

const cookieStore = await cookies()

const locale = cookieStore.get('NEXT\_LOCALE')?.value || 'es'

return {

locale,

messages: (await import(`../messages/${locale}.json`)).default

}

})

**6.2 Componente LanguageSwitcher**

tsx

// components/shared/LanguageSwitcher.tsx

"use client"

import { useRouter } from 'next/navigation'

import { useLocale } from 'next-intl'

import { Button } from "@/components/ui/button"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Languages } from "lucide-react"

export function LanguageSwitcher() {

const router = useRouter()

const locale = useLocale()

const switchLanguage = (newLocale: string) => {

document.cookie = `NEXT\_LOCALE=${newLocale}; path=/; max-age=31536000`

router.refresh()

}

return (

<DropdownMenu>

<DropdownMenuTrigger asChild>

<Button variant="outline" size="icon">

<Languages className="h-[1.2rem] w-[1.2rem]" />

<span className="sr-only">Toggle language</span>

</Button>

</DropdownMenuTrigger>

<DropdownMenuContent align="end">

<DropdownMenuItem onClick={() => switchLanguage('es')} className={locale === 'es' ? 'bg-accent' : ''}>

🇪🇸 Español

</DropdownMenuItem>

<DropdownMenuItem onClick={() => switchLanguage('en')} className={locale === 'en' ? 'bg-accent' : ''}>

🇬🇧 English

</DropdownMenuItem>

</DropdownMenuContent>

</DropdownMenu>

)

}

**Referencia**: El repositorio [codes-sharan/multilingual-nextjs-app](https://github.com/codes-sharan/multilingual-nextjs-app) implementa este patrón con cookie-based language preference y soporte para múltiples idiomas.

**7. Sistema de Spacing y Tipografía**

**7.1 Escala de Espaciado (Basada en Tailwind)**

| Token | Valor | Uso |
| --- | --- | --- |
| p-2 / m-2 | 8px | Espaciado mínimo entre elementos |
| p-4 / m-4 | 16px | Espaciado estándar entre componentes |
| p-6 / m-6 | 24px | Espaciado entre secciones |
| p-8 / m-8 | 32px | Espaciado de página |
| gap-4 | 16px | Grid gaps |
| space-y-4 | 16px | Stack vertical |

**7.2 Escala Tipográfica**

| Nivel | Tamaño | Peso | Uso |
| --- | --- | --- | --- |
| H1 | 32px | 700 | Título de página |
| H2 | 24px | 600 | Título de sección |
| H3 | 18px | 600 | Subtítulo |
| Body | 16px | 400 | Texto principal |
| Small | 14px | 400 | Texto secundario, tooltips |
| Muted | 12px | 400 | Metadatos, fechas |

**Familia tipográfica**: Inter (variable) – cargada desde Google Fonts.

**8. Gestión de Estado y Datos**

**8.1 Store con Zustand**

tsx

// lib/store/index.ts

import { create } from 'zustand'

import { persist } from 'zustand/middleware'

interface MetaPrompterState {

// Estado de cada paso

project: ProjectData

strategy: StrategyData

architecture: ArchitectureData

// ... más secciones

// Acciones

updateProject: (data: Partial<ProjectData>) => void

updateStrategy: (data: Partial<StrategyData>) => void

// ... más acciones

}

export const useStore = create<MetaPrompterState>()(

persist(

(set) => ({

// estado inicial y acciones

}),

{ name: 'metaprompter-storage' }

)

)

**8.2 Consumo de Datos**

* **Datos estáticos**: Referencias, opciones de configuración → importados desde archivos JSON.
* **Datos dinámicos**: Búsqueda de referencias → fetch a /api/search.
* **Generación de prompt**: POST a /api/generate con el estado completo.

**8.3 Hooks Personalizados**

tsx

// hooks/useStepNavigation.ts

export function useStepNavigation() {

const currentStep = useStore(state => state.currentStep)

const goToStep = useStore(state => state.goToStep)

const nextStep = useStore(state => state.nextStep)

const prevStep = useStore(state => state.prevStep)

const isStepComplete = useStore(state => state.isStepComplete)

return { currentStep, goToStep, nextStep, prevStep, isStepComplete }

}

// hooks/usePromptPreview.ts

export function usePromptPreview() {

const state = useStore(state => state)

const [preview, setPreview] = useState('')

useEffect(() => {

const generatePreview = async () => {

const response = await fetch('/api/generate-preview', {

method: 'POST',

body: JSON.stringify(state)

})

const data = await response.json()

setPreview(data.prompt)

}

generatePreview()

}, [state])

return preview

}

**9. Microinteracciones y Animaciones**

| Elemento | Animación | Librería |
| --- | --- | --- |
| Cambio de paso | Fade + slide vertical (300ms) | Framer Motion |
| Aparición de elementos | Fade + scale (200ms) | Framer Motion |
| Toggle de tema | Rotación de icono (300ms) | CSS transitions |
| Hover en tarjetas | Elevación + sombra (150ms) | Tailwind transitions |
| Loading skeletons | Pulse animation | Tailwind animation |
| Tooltips | Fade + scale (150ms) | Radix UI |

**Referencia**: El repositorio [marleyDip/NextJS-Admin-Dashboard-ShadCN-Tailwind-CSS](https://github.com/marleyDip/NextJS-Admin-Dashboard-ShadCN-Tailwind-CSS) incluye skeleton loaders, hover cards, popovers y scroll areas.

**10. Integración de Tecnologías Compatibles**

| Tecnología | Versión | Propósito |
| --- | --- | --- |
| Next.js | 16 (App Router) | Framework principal |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | v4 | Estilos |
| shadcn/ui | latest | Componentes UI |
| Zustand | latest | Estado global |
| React Hook Form | latest | Formularios |
| Zod | latest | Validación |
| TanStack Table | v8 | Tablas de datos |
| Recharts | latest | Gráficos |
| Framer Motion | latest | Animaciones |
| next-intl | latest | Internacionalización |
| next-themes | latest | Modo oscuro |

**11. Despliegue y Compatibilidad**

**11.1 Estrategia de Despliegue**

| Entorno | Plataforma | Comando |
| --- | --- | --- |
| Desarrollo | Local | pnpm dev |
| Staging | Vercel (preview) | Automático en PR |
| Producción | Vercel | vercel --prod |

**11.2 Variables de Entorno**

env

# .env.local

NEXT\_PUBLIC\_APP\_URL=http://localhost:3000

TAVILY\_API\_KEY=xxx # Para búsqueda de referencias

**11.3 Docker (Opcional)**

dockerfile

FROM node:18-alpine AS builder

WORKDIR /app

COPY package\*.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next

COPY --from=builder /app/public ./public

COPY --from=builder /app/package\*.json ./

RUN npm install -g pnpm && pnpm install --prod

EXPOSE 3000

CMD ["pnpm", "start"]

**Referencia**: El repositorio [AndriianChestnykh/ui-poc3](https://github.com/AndriianChestnykh/ui-poc3-portfolio-as-a-service-next-shadcn-admin-dashboard) incluye despliegue instantáneo con Vercel.

**12. Resumen de Referencias**

| Recurso | Enlace | Aportación |
| --- | --- | --- |
| next-shadcn-dashboard-starter | [GitHub](https://github.com/kiranism/next-shadcn-dashboard-starter) | Estructura de carpetas, Zustand, TanStack Query |
| shadcn-dashboard-landing-template | [GitHub](https://github.com/shadcnstore/shadcn-dashboard-landing-template) | Personalización de temas en vivo, Recharts |
| AndriianChestnykh admin dashboard | [GitHub](https://github.com/AndriianChestnykh/ui-poc3) | Next.js 16, Tailwind v4, temas personalizables |
| marleyDip dashboard | [GitHub](https://github.com/marleyDip/NextJS-Admin-Dashboard-ShadCN-Tailwind-CSS) | Componentes reutilizables, theming, dark mode |
| next-themes | [GitHub](https://github.com/pacocoursey/next-themes) | Modo oscuro en 2 líneas |
| next-intl multilingual | [GitHub](https://github.com/codes-sharan/multilingual-nextjs-app) | i18n con cookie-based preference |