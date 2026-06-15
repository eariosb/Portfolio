# Portfolio — Esneider Ríos

Portafolio profesional bilingüe (ES/EN) de un estadístico especializado en **análisis bayesiano, modelos mixtos, series de tiempo y LegalTech**. Incluye blog técnico (MDX), catálogo de cursos interactivos y un directorio de aplicaciones Shiny y Next.js desplegadas en producción.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · next-intl · Framer Motion

---

## Tabla de contenido

- [Inicio rápido](#inicio-rápido)
- [Scripts disponibles](#scripts-disponibles)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Internacionalización (i18n)](#internacionalización-i18n)
- [Rutas](#rutas)
- [Gestión de contenido](#gestión-de-contenido)
  - [Agregar un proyecto](#agregar-un-proyecto)
  - [Agregar un curso](#agregar-un-curso)
  - [Agregar un post al blog](#agregar-un-post-al-blog)
- [Proyectos en producción](#proyectos-en-producción)
- [Calidad y validación](#calidad-y-validación)
- [Deploy](#deploy)
- [Paleta de colores](#paleta-de-colores)
- [Convenciones de diseño](#convenciones-de-diseño)
- [Roadmap](#roadmap)
- [Licencia y contacto](#licencia-y-contacto)

---

## Inicio rápido

Requiere **Node.js ≥ 20** y npm.

```bash
cd portfolio
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) → redirige automáticamente a `/es`.

---

## Scripts disponibles

| Comando                  | Descripción                                                              |
|---------------------------|---------------------------------------------------------------------------|
| `npm run dev`              | Servidor de desarrollo con hot-reload                                      |
| `npm run build`            | Build de producción (Next.js)                                              |
| `npm run start`            | Sirve el build de producción                                               |
| `npm run lint`             | ESLint sobre el código fuente                                              |
| `npm run preflight`        | Verifica dependencias, configuración e i18n (`scripts/preflight.mjs`)     |
| `npm run preflight:fix`    | Igual que `preflight`, pero aplica correcciones automáticas               |
| `npm run sprint`           | Validación completa: preflight + TypeScript + coherencia de datos         |

Antes de cada despliegue se recomienda ejecutar:

```bash
npm run sprint
```

---

## Arquitectura del proyecto

```
portfolio/
├── public/
│   ├── icon/                  # Favicons y assets de marca
│   └── images/
│       ├── projects/          # SVG/PNG de tarjetas de proyectos
│       └── courses/           # SVG/PNG de tarjetas de cursos
├── scripts/
│   ├── preflight.mjs          # Chequeos de salud del proyecto
│   └── sprint-check.mjs       # Validación end-to-end pre-deploy
├── messages/                  # Diccionarios de traducción (next-intl)
└── src/
    ├── app/
    │   ├── layout.tsx, page.tsx, not-found.tsx   # Shell raíz
    │   └── [locale]/
    │       ├── page.tsx                # Home
    │       ├── portafolio|portfolio/   # Catálogo de proyectos
    │       ├── cursos|courses/         # Catálogo de cursos
    │       ├── blog/[slug]/            # Posts MDX
    │       ├── sobre-mi|about/         # Bio profesional
    │       └── contacto|contact/       # Formulario / datos de contacto
    ├── components/             # UI compartida (Navbar, Footer, ProjectCard, etc.)
    │   ├── art/                # Arte generativo (GaussianArt)
    │   └── icons/              # Iconos de marca (BrandIcons)
    ├── content/blog/           # Posts en MDX
    ├── data/
    │   ├── projects.ts         # Fuente única de verdad: proyectos
    │   └── courses.ts          # Fuente única de verdad: cursos
    ├── i18n/                   # Configuración de rutas y locale
    └── lib/                    # Utilidades (blog parsing, helpers)
```

---

## Internacionalización (i18n)

El sitio usa **next-intl** con enrutamiento basado en prefijo de locale (`/es`, `/en`). Las rutas localizadas se definen en `src/i18n/routing.ts`:

```ts
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/about": { es: "/sobre-mi", en: "/about" },
    "/portfolio": { es: "/portafolio", en: "/portfolio" },
    "/blog": "/blog",
    "/courses": { es: "/cursos", en: "/courses" },
    "/contact": { es: "/contacto", en: "/contact" },
  },
});
```

Las traducciones de UI viven en `messages/*.json`. Todo el contenido de datos (`projects.ts`, `courses.ts`, posts MDX) sigue el patrón `{ es: "...", en: "..." }` para mantener ambos idiomas sincronizados en la misma fuente.

---

## Rutas

| Página        | ES                  | EN                  |
|---------------|---------------------|---------------------|
| Home          | `/es`               | `/en`               |
| Portafolio    | `/es/portafolio`    | `/en/portfolio`     |
| Blog          | `/es/blog`          | `/en/blog`          |
| Cursos        | `/es/cursos`        | `/en/courses`       |
| Sobre mí      | `/es/sobre-mi`      | `/en/about`         |
| Contacto      | `/es/contacto`      | `/en/contact`       |

---

## Gestión de contenido

Todo el contenido editorial vive como datos tipados en `src/data/` o como MDX en `src/content/blog/`, sin necesidad de tocar componentes.

### Agregar un proyecto

Edita `src/data/projects.ts` y agrega un objeto al array `projects`:

```ts
{
  id: "mi-app",
  name: { es: "Mi App", en: "My App" },
  description: { es: "...", en: "..." },
  url: "https://mi-app.shinyapps.io/...",
  image: "/images/projects/mi-app.svg",  // colócala en public/images/projects/
  tags: ["R", "Shiny"],
  category: "shiny",   // "shiny" | "web" | "ml"
  featured: true,      // true => aparece destacado en home
  tech: ["R", "Shiny"],
}
```

### Agregar un curso

Edita `src/data/courses.ts` siguiendo el mismo patrón que los proyectos, incluyendo el array `modules` (cada módulo con `title`, `duration` y `topics` bilingües):

```ts
{
  id: "mi-curso",
  title: { es: "...", en: "..." },
  description: { es: "...", en: "..." },
  level: "basic" | "intermediate" | "advanced",
  duration: "10h",
  image: "/images/courses/mi-curso.svg",
  tags: ["R", "Bayesiano"],
  url: "https://mi-curso.vercel.app/",
  modules: [
    {
      id: "m1",
      title: { es: "...", en: "..." },
      duration: "2h",
      topics: { es: ["..."], en: ["..."] },
    },
  ],
}
```

### Agregar un post al blog

Crea `src/content/blog/mi-post.mdx` con frontmatter bilingüe:

```mdx
---
title: "Título en español"
titleEn: "Title in English"
date: "2026-01-15"
tags: ["R", "Bayesiano"]
excerpt: "Resumen breve..."
excerptEn: "Short summary..."
readingTime: 8
---

Contenido del post en Markdown / MDX...
```

---

## Proyectos en producción

| Proyecto | Tipo | URL |
|---|---|---|
| MLM Studio | Shiny | https://rios.shinyapps.io/MLM-Studio/ |
| TimeSight (Análisis de Series de Tiempo) | Shiny | https://rios.shinyapps.io/AnalisisSeriesTiempo/ |
| La Tienda — Inteligencia de Precios | Shiny | https://rios.shinyapps.io/la_tienda/ |
| @RIOS — Simulación y Optimización | Shiny | https://rios.shinyapps.io/RIOS-simMCMC/ |
| Ingeniería de Software Estadístico | Next.js (docs) | https://statistical-software-engineering.vercel.app/ |
| Introducción a los Modelos Mixtos | Curso interactivo | https://intro-modelos-mixtos.vercel.app/ |
| Bioestadística para Profesionales de la Salud | Curso interactivo | https://curso-estadistica-salud-six.vercel.app/ |
| Modelos de Regresión para Series de Tiempo | Curso interactivo | https://seriesdetiempo.vercel.app/ |
| LegalTech Colombia | Curso interactivo | https://legaltech-colombia.vercel.app/ |
| SymFonos — Caos Visual de tu Música | Next.js / WebGL | https://symfonosvisualizer.vercel.app/ |

> Esta tabla refleja el estado del catálogo en `src/data/projects.ts` y `src/data/courses.ts`. Pendientes de activar: InfoGraph (límite de 5 apps del plan gratuito de shinyapps.io), Messias y SpinLoyalty (conexiones y detalles aún por definir).

---

## Calidad y validación

- **`npm run lint`** — reglas de `eslint-config-next` + TypeScript.
- **`npm run preflight`** — verifica versiones de dependencias, configuración de `next-intl` y consistencia de rutas/locales. Usa `--fix` para auto-corregir lo posible.
- **`npm run sprint`** — corre preflight, `tsc --noEmit` y validaciones de coherencia de datos (`projects.ts`/`courses.ts`) en un solo paso. Recomendado antes de cada PR/deploy.

---

## Deploy

Despliegue continuo en **Vercel** (plan gratuito):

```bash
npx vercel --prod
```

Cada push a la rama principal dispara un build automático. Verifica `npm run sprint` localmente antes de hacer push para evitar builds rotos.

---

## Paleta de colores

| Rol              | HEX       | Uso                                  |
|------------------|-----------|---------------------------------------|
| Fondo principal  | `#0A1128` | Background general                     |
| Tarjetas         | `#1B2B5E` | Cards, paneles, navbar                 |
| Acento primario  | `#2A5CFF` | Botones, links, highlights              |
| Acento eléctrico | `#00C2FF` | Detalles, badges, gráficos              |
| Texto secundario | `#B0C4FF` | Subtítulos, descripciones               |
| Texto principal  | `#F8FAFF` | Títulos, texto de alto contraste        |

---

## Convenciones de diseño

- **Imágenes de tarjetas** (proyectos/cursos): SVG 600×400 (cursos) o 800×500 (proyectos), fondo degradado oscuro + grid sutil + título centrado, siguiendo los archivos existentes en `public/images/{projects,courses}/` como plantilla.
- **Bilingüe por defecto**: cualquier campo de texto visible al usuario debe incluir `{ es, en }`.
- **Una fuente de verdad**: no dupliques datos de proyectos/cursos en componentes; siempre referencia `src/data/*.ts`.

---

## Roadmap

- [ ] Migrar imágenes de proyectos placeholder a capturas reales.
- [ ] Añadir InfoGraph al catálogo cuando se libere un slot en el plan gratuito de shinyapps.io (límite de 5 apps).
- [ ] Añadir Messias y SpinLoyalty al catálogo una vez se definan sus conexiones.
- [ ] Agregar `@types/react-katex` o declaración de módulo para eliminar el warning de TypeScript en `AnimatedHero.tsx`.
- [ ] Configurar dominio propio en Vercel.

---

## Licencia y contacto

Material con fines educativos y profesionales.

**Esneider Ríos** — Estadístico, Universidad Nacional de Colombia (Sede Medellín)
eariosb@unal.edu.co · WhatsApp +57 304 457 5399
