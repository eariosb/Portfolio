**Plan de Ingeniería y Arquitectura para MetaPrompter**

**1. Resumen Ejecutivo**

**MetaPrompter** es un asistente web (Next.js) que guía a los usuarios a través de un flujo estructurado de 7 pasos para definir su proyecto de software estadístico y generar un **prompt quirúrgico** para agentes de IA. El sistema integra principios de Clean Architecture, simplicidad radical (Ponytail) y la pedagogía de Juan David Velásquez. El código será modular, testeable, accesible y desplegado en Vercel con opción a Docker. Este plan define la arquitectura, stack, estructura, flujo de datos, seguridad, testing y despliegue.

**2. Objetivos y Alcance**

**2.1 Objetivos Estratégicos**

1. **Guiar** al usuario en la toma de decisiones técnicas y de diseño.
2. **Estructurar** el conocimiento del usuario en un contexto JSON.
3. **Generar** un prompt profesional listo para agentes de IA.
4. **Educar** al usuario mostrando referencias y justificaciones.
5. **Documentar** las decisiones automáticamente (ADR).

**2.2 Alcance Funcional**

* **Flujo de 7 pasos**: Fundación, Estrategia, Arquitectura, Ingeniería, UI/UX, Seguridad, Testing y Despliegue (el paso 0 y 7 se combinan).
* **Panel de referencias** en tiempo real (libros, repositorios, citas).
* **Vista previa** del prompt en vivo.
* **Exportación** del prompt (Markdown, copiar al portapapeles).
* **Historial local** de proyectos (persistencia en localStorage).

**2.3 No Incluido (fuera de alcance inicial)**

* Conexión directa a APIs de IA (se deja para futura integración).
* Autenticación de usuarios (se añadirá si se requiere multi-tenencia).
* Editor de código o ejecución de código generado.

**3. Arquitectura de Alto Nivel**

**3.1 Diagrama de Componentes**

**3.2 Flujo de Datos**

1. El usuario navega por los pasos (spa).
2. Cada paso actualiza el estado global (Zustand).
3. El estado se persiste en localStorage para recuperación.
4. El panel de referencias consulta /api/references con el paso actual.
5. El usuario puede buscar referencias externas vía /api/search (Tavily).
6. Al finalizar, se invoca /api/generate que construye el prompt final a partir del estado.
7. El prompt se muestra y se puede copiar/exportar.

**4. Stack Tecnológico**

| Capa | Tecnología | Justificación |
| --- | --- | --- |
| **Frontend** | Next.js 16 (App Router) | SSR/SSG, routing integrado, rendimiento |
| **Lenguaje** | TypeScript 5 | Tipado estático para robustez |
| **Estilos** | Tailwind CSS + shadcn/ui | Consistencia, accesibilidad, componentes listos |
| **Estado** | Zustand | Ligero, sencillo, persistencia fácil |
| **Persistencia** | localStorage + Zustand persist | Recuperación de sesión |
| **Animaciones** | Framer Motion | Transiciones suaves, experticia UX |
| **Gráficos** | Recharts (opcional) | Para vista previa de diseños |
| **Backend API** | Next.js API Routes | Sin servidor adicional, integración directa |
| **Búsqueda** | Tavily API | RAG en tiempo real |
| **Testing** | Jest + Testing Library + Playwright | Unitario, integración, E2E |
| **Despliegue** | Vercel (primario), Docker (opcional) | Simplicidad, escalabilidad |

**5. Estructura de Carpetas (Feature-Based con Capas)**

text

metaprompter/

├── app/

│ ├── (steps)/

│ │ ├── step0/page.tsx # Fundación

│ │ ├── step1/page.tsx # Estrategia

│ │ ├── step2/page.tsx # Arquitectura

│ │ ├── step3/page.tsx # Ingeniería

│ │ ├── step4/page.tsx # UI/UX

│ │ ├── step5/page.tsx # Seguridad

│ │ ├── step6/page.tsx # Testing

│ │ ├── step7/page.tsx # Despliegue

│ │ └── layout.tsx # Layout con StepWizard

│ ├── api/

│ │ ├── search/route.ts # Búsqueda externa

│ │ ├── generate/route.ts # Generación de prompt

│ │ └── references/route.ts # Referencias locales

│ ├── layout.tsx

│ └── page.tsx # Redirige a /step0

├── components/

│ ├── ui/ # shadcn/ui components (generados)

│ ├── StepWizard.tsx # Barra de progreso

│ ├── StepContainer.tsx # Wrapper para cada paso

│ ├── QuestionCard.tsx # Card con pregunta y opciones

│ ├── ReferencePanel.tsx # Panel lateral de referencias

│ ├── PromptPreview.tsx # Vista previa del prompt

│ └── SearchWidget.tsx # Búsqueda integrada

├── lib/

│ ├── store/

│ │ ├── index.ts # Zustand store principal

│ │ └── persist.ts # Persistencia con localStorage

│ ├── references/

│ │ ├── index.ts # Base de datos de referencias

│ │ └── types.ts # Tipos de referencia

│ ├── prompt/

│ │ ├── templates.ts # Plantillas de prompt

│ │ └── generator.ts # Lógica de generación

│ ├── search/

│ │ └── tavily.ts # Cliente Tavily

│ └── utils/

│ ├── validators.ts # Validación de entrada

│ └── constants.ts # Constantes compartidas

├── hooks/

│ ├── useStepNavigation.ts # Navegación entre pasos

│ └── useReferences.ts # Carga de referencias

├── types/

│ └── index.ts # Tipos globales

├── public/

│ └── images/ # Referencias visuales

├── tests/

│ ├── unit/

│ ├── integration/

│ └── e2e/

├── docker/

│ ├── Dockerfile

│ └── docker-compose.yml

├── docs/

│ └── decisions/ # ADR generados

├── .env.example

├── package.json

├── tsconfig.json

├── tailwind.config.js

├── next.config.js

└── README.md

**Justificación de la estructura:**

* **Feature-Based:** Cada paso es una feature con su propia página, pero comparten lógica a través de hooks y store.
* **Capas:** Separación clara entre UI (components), lógica de negocio (lib) y estado (store).
* **API Routes:** Para lógica que requiere servidor (búsqueda, generación).
* **Tests:** Organizados por tipo para facilitar ejecución selectiva.

**6. Gestión de Estado (Zustand)**

El estado global captura todas las decisiones del usuario.

**6.1 Definición del Store**

typescript

interface MetaPrompterState {

// Paso 0

project: {

name: string;

description: string;

domain: 'finanzas' | 'salud' | 'retail' | 'logistica' | 'educacion' | 'general';

maturity: 'prototipo' | 'mvp' | 'produccion' | 'escala';

team: { backend: number; frontend: number; data: number };

};

// Paso 1

strategy: {

problem: string;

users: { role: string; need: string; frequency: string; techLevel: 'bajo' | 'medio' | 'alto' }[];

successMetric: string;

compliance: ('gdpr' | 'ccpa' | 'hipaa' | 'sox' | 'pci')[];

};

// Paso 2

architecture: {

style: 'hexagonal' | 'layered' | 'microservices' | 'modular';

backend: 'fastapi' | 'express' | 'go-chi' | 'aspnet';

frontend: 'nextjs' | 'vite' | 'none';

database: 'postgresql' | 'mongodb' | 'duckdb';

cache: 'redis' | 'none';

async: 'celery' | 'bull' | 'rabbitmq' | 'none';

};

// Paso 3

engineering: {

solid: boolean;

typing: boolean;

dependencyInjection: boolean;

errorHandling: 'result' | 'exceptions';

logging: 'json' | 'text';

maxLineLength: number;

};

// Paso 4

design: {

designSystem: 'shadcn' | 'mui' | 'antd' | 'tremor';

chartLibrary: 'recharts' | 'nivo' | 'visx' | 'echarts';

tuftePrinciples: boolean;

darkMode: boolean;

animations: boolean;

colorPalette: string; // referencia a paleta

};

// Paso 5

security: {

auth: 'jwt' | 'oauth2' | 'apikey' | 'none';

rbac: boolean;

secrets: 'env' | 'vault';

encryption: 'aes256' | 'none';

auditLogs: boolean;

rateLimiting: boolean;

};

// Paso 6

testing: {

unitCoverage: 80 | 90 | 100;

integration: boolean;

contract: boolean;

e2e: boolean;

securityScan: boolean;

};

// Paso 7

deployment: {

docker: boolean;

orchestration: 'docker-compose' | 'kubernetes' | 'none';

ci: 'github-actions' | 'gitlab-ci' | 'none';

docs: boolean;

adr: boolean;

};

// Métodos para actualizar cada sección

updateProject: (data: Partial<MetaPrompterState['project']>) => void;

updateStrategy: (data: Partial<MetaPrompterState['strategy']>) => void;

// ... etc.

}

**6.2 Persistencia**

typescript

import { persist } from 'zustand/middleware';

export const useStore = create<MetaPrompterState>()(

persist(

(set) => ({

// ... estado inicial y métodos

}),

{

name: 'metaprompter-storage',

getStorage: () => localStorage,

}

)

);

**7. Detalle de Pasos y Lógica de Negocio**

**7.1 Cada Paso es una Página con un Componente Específico**

tsx

// app/(steps)/step4/page.tsx

import StepContainer from '@/components/StepContainer';

import DesignForm from '@/components/forms/DesignForm';

import { useStore } from '@/lib/store';

export default function Step4Page() {

const design = useStore((state) => state.design);

const updateDesign = useStore((state) => state.updateDesign);

return (

<StepContainer step={4} title="Diseño UI/UX">

<DesignForm value={design} onChange={updateDesign} />

</StepContainer>

);

}

**7.2 Lógica de Validación y Navegación**

* Cada paso debe estar completo antes de avanzar (validación en el botón "Siguiente").
* La barra de progreso muestra el avance y permite saltar a pasos completados.
* Hooks useStepNavigation maneja la lógica.

**7.3 Panel de Referencias**

* Se actualiza según el paso actual.
* Muestra libros, repositorios, citas y enlaces relevantes.
* Puede incluir imágenes de dashboards de referencia.

**7.4 Generación del Prompt**

typescript

// lib/prompt/generator.ts

export function generatePrompt(state: MetaPrompterState): string {

const template = getTemplate(state.project.domain, state.architecture.style);

return fillTemplate(template, state);

}

El prompt final combina todas las secciones con un lenguaje estructurado y referencias a las fuentes.

**8. API Routes**

**8.1 /api/references (GET)**

* Devuelve referencias para un paso dado.
* Parámetro: step (0-7).
* Respuesta: array de objetos { title, type, description, link, image? }.

**8.2 /api/search (POST)**

* Recibe query: string y step?: number.
* Usa Tavily API para buscar en la web.
* Devuelve snippets con enlaces y metadata.

**8.3 /api/generate (POST)**

* Recibe el estado completo en el body.
* Construye el prompt usando generatePrompt.
* Opcionalmente, puede enriquecerlo con una llamada a un LLM para pulir el texto.
* Devuelve el prompt en formato Markdown.

**9. Seguridad y Privacidad**

* **Sin secretos en el cliente**: Las claves de Tavily y LLM se almacenan en variables de entorno en el servidor.
* **Validación de entrada**: Todos los campos son validados con Zod antes de procesar.
* **Sanitización**: Se escapan caracteres especiales en los prompts generados.
* **CORS**: Limitado a dominios permitidos (si se despliega en múltiples entornos).
* **Rate limiting**: En rutas de API para prevenir abusos.
* **Auditoría**: Logs de generación de prompts (anonimizados) para mejorar el sistema.

**10. Testing**

| Tipo | Herramienta | Cobertura mínima | Ejecución |
| --- | --- | --- | --- |
| Unitario | Jest + Testing Library | 80% | Cada PR |
| Integración | Jest + Next.js API testing | Rutas críticas | Cada PR |
| E2E | Playwright | Flujo completo de 7 pasos | Antes de despliegue a producción |
| Accesibilidad | axe-core | WCAG 2.1 AA | En CI |

**Ejemplo de test unitario (store)**

typescript

// tests/unit/store.test.ts

import { useStore } from '@/lib/store';

test('updateProject updates project state', () => {

const { getState } = useStore;

getState().updateProject({ name: 'AnalyticsHub' });

expect(getState().project.name).toBe('AnalyticsHub');

});

**11. Despliegue y DevOps**

**11.1 Estrategia de Despliegue**

* **Principal**: Vercel (conexión automática con GitHub).
* **Alternativo**: Docker + Kubernetes para entornos on-premise.

**11.2 Pipeline CI/CD (GitHub Actions)**

yaml

name: CI/CD

on:

push:

branches: [main, develop]

pull\_request:

jobs:

test:

runs-on: ubuntu-latest

steps:

- uses: actions/checkout@v4

- uses: actions/setup-node@v4

- run: npm ci

- run: npm run test:unit

- run: npm run test:integration

- run: npm run test:e2e

- run: npm run lint

- run: npm run type-check

build:

needs: test

runs-on: ubuntu-latest

steps:

- uses: actions/checkout@v4

- run: npm ci

- run: npm run build

- uses: actions/upload-artifact@v4

with:

name: build

path: .next

deploy:

needs: build

if: github.ref == 'refs/heads/main'

runs-on: ubuntu-latest

steps:

- uses: actions/checkout@v4

- uses: amondnet/vercel-action@v25

with:

vercel-token: ${{ secrets.VERCEL\_TOKEN }}

vercel-org-id: ${{ secrets.VERCEL\_ORG\_ID }}

vercel-project-id: ${{ secrets.VERCEL\_PROJECT\_ID }}

vercel-args: '--prod'

**11.3 Docker (Opcional)**

dockerfile

FROM node:18-alpine AS builder

WORKDIR /app

COPY package\*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next

COPY --from=builder /app/public ./public

COPY --from=builder /app/package\*.json ./

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]

**12. Principios de UI/UX Aplicados**

* **Jerarquía clara**: Barra de progreso, título del paso, preguntas secuenciales.
* **Feedback inmediato**: Validación en tiempo real, preview del prompt en vivo.
* **Accesibilidad**: shadcn/ui garantiza contraste y navegación por teclado.
* **Simplicidad**: Sin decoraciones innecesarias, enfoque en la tarea.
* **Referencias visuales**: Imágenes de dashboards de referencia en el panel lateral.
* **Temas**: Soporte para modo claro/oscuro (por defecto en shadcn/ui).

**13. Documentación y ADR**

El MetaPrompter generará automáticamente un ADR al final del flujo, que el usuario puede descargar. Además, se mantendrá documentación:

* **README.md**: Instalación, configuración, desarrollo, despliegue.
* **Guía de usuario**: Cómo usar el asistente paso a paso.
* **Decisiones de arquitectura**: Registro de las decisiones tomadas durante el desarrollo de MetaPrompter.

**14. Conclusión y Próximos Pasos**

Este plan establece una base sólida para construir MetaPrompter. La arquitectura es modular, el stack es moderno y productivo, y el flujo de usuario está claramente definido. Se recomienda comenzar con un MVP que cubra los 7 pasos básicos, sin búsqueda externa ni generación avanzada, validar con usuarios y luego añadir funcionalidades como búsqueda y conexión a LLM.

**Primer Sprint (2 semanas)**:

* Configurar proyecto Next.js, Tailwind, shadcn/ui.
* Implementar store Zustand con persistencia.
* Crear layout y StepWizard.
* Implementar paso 0 (Fundación) con validación.

**Siguiente Sprints**:

* Añadir cada paso secuencialmente.
* Implementar panel de referencias estático.
* Desarrollar generación de prompt básico.
* Añadir búsqueda y mejoras de UX.

**MetaPrompter: Donde la Intención se Convierte en Código de Calidad.**