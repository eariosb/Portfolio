Sprint 0: Fundación del Ecosistema de Ingeniería (Cero Lógica de Negocio)
Objetivo Estratégico: Establecer un entorno de desarrollo reproducible, verificado matemáticamente y blindado contra errores de principiante. Al finalizar este sprint, el repositorio tendrá una arquitectura de carpetas reflejando el hexágono, un sistema de tipos inferido globalmente, un pipeline CI/CD que blinda la calidad y un contrato de entorno inexpugnable.

Módulo A: Gobierno del Monorepo y Topología de Paquetes
S0-A1: Implementación de Monorepo con pnpm Workspaces + Turborepo

Descripción: Estructuro el repositorio como un monorepo multi-paquete. Defino los workspaces: apps/web (Frontend Next.js), packages/core (Lógica pura/Engine), packages/ui (Componentes shadcn/ui compartidos), packages/types (Tipos globales), packages/config-eslint, packages/config-ts. La raíz contiene el pnpm-workspace.yaml y el turbo.json que orquesta las tareas (build, test, lint, type-check) con caché remoto (Vercel Remote Cache) para acelerar CI.

Rigor: El package.json raíz fuerza la versión de pnpm mediante "packageManager": "pnpm@9.0.0". El turbo.json define pipelines estrictos: build depende de ^build (topológico), test depende de build (evita probar código no compilado).

Artefacto: pnpm-workspace.yaml, turbo.json, package.json (raíz), estructura de carpetas apps/, packages/.

Criterio: pnpm install en la raíz instala todas las dependencias de todos los workspaces. pnpm turbo build ejecuta el build de todos los paquetes respetando el orden topológico.

S0-A2: Configuración de Path Aliases (Resolución de Módulos Hexagonal)

Descripción: Configuro los compilerOptions.paths en el tsconfig.json raíz para que los imports sean semánticos y reflejen el hexágono. Ejemplo: @core/* apunta a packages/core/src/*, @ui/* apunta a packages/ui/src/*, @web/* apunta a apps/web/src/*. Esto elimina los ../../../ y prepara el terreno para una futura extracción de paquetes si se necesita.

Rigor: Uso "baseUrl": "." y rutas relativas desde la raíz del monorepo.

Artefacto: tsconfig.base.json (compartido), apps/web/tsconfig.json (extiende el base).

Criterio: El IDE (VSCode) resuelve los imports sin errores y permite "Go to Definition" a través de los paquetes.

Módulo B: Blindaje del Sistema de Tipos (TypeScript Estricto)
S0-B1: Configuración de TypeScript con Modo "Berserker"

Descripción: Activación de todas las banderas estrictas posibles: strict: true, noUncheckedIndexedAccess: true (fuerza manejo de undefined en arrays), exactOptionalPropertyTypes: true (diferencia entre prop?: string y prop: string | undefined), verbatimModuleSyntax: true (obliga a usar import type para tipos). Prohíbo any mediante la regla de ESLint correspondiente.

Rigor: El tsconfig no permite incremental: true en CI para evitar stale cache.

Artefacto: packages/config-ts/tsconfig.strict.json.

Criterio: El comando pnpm type-check en cualquier workspace falla si existe un any implícito o un acceso a índice sin verificación.

S0-B2: Implementación de "Env Validator" con Zod (Contrato del Entorno)

Descripción: Creo un módulo que valida las variables de entorno (.env.local, .env.production) contra un esquema Zod estricto en el startup de la aplicación y en el build. Si falta una variable o tiene formato incorrecto (ej. PORT no es número), el proceso de next build falla inmediatamente.

Rigor: Uso zod para parsear process.env. Las variables públicas deben tener prefijo NEXT_PUBLIC_. El validador se ejecuta en apps/web/src/lib/env.ts y se importa en next.config.ts.

Artefacto: packages/core/src/env/schema.ts, apps/web/src/lib/env.ts.

Criterio: Si TAVILY_API_KEY falta, el servidor de desarrollo lanza un error claro: ❌ Missing required env: TAVILY_API_KEY.

Módulo C: Fundación de la Capa de Presentación (UI System)
S0-C1: Implementación del Sistema de Diseño (shadcn/ui + Tailwind CSS)

Descripción: Inicializo Tailwind CSS v4 en apps/web. Configuro el tailwind.config.ts con la paleta neutral y los tokens personalizados (spacing, font-family Inter). Ejecuto pnpm dlx shadcn@latest init con el estilo "New York" y color "Neutral". Los componentes se instalan en packages/ui/src/components/ para ser compartidos.

Rigor: Los estilos globales (globals.css) importan las directivas de Tailwind y las variables CSS de shadcn. Configuro @layer base para establecer estilos de reseteo tipográficos.

Artefacto: packages/ui/src/styles/globals.css, packages/ui/src/components/button.tsx, apps/web/tailwind.config.ts.

Criterio: Al ejecutar pnpm dev, el componente <Button> de shadcn se renderiza con el estilo correcto y el modo oscuro funciona mediante la clase dark en el html.

S0-C2: Configuración de next-themes (Sistema de Modo Oscuro/Claro)

Descripción: Implemento next-themes como un Provider en el layout raíz. Utilizo el atributo attribute="class" y defaultTheme="system". Configuro el ThemeToggle en el header global que usa useTheme() para cambiar entre light, dark y system.

Rigor: Aseguro que no haya "flash of incorrect theme" (FOUC) usando suppressHydrationWarning en el <html> y un script inline de prevención en el <head>.

Artefacto: apps/web/src/app/providers/theme-provider.tsx, apps/web/src/components/shared/ThemeToggle.tsx.

Criterio: Al recargar la página en modo oscuro, el fondo es oscuro desde el primer paint, sin parpadeo blanco.

Módulo D: Calidad de Código y Gobernanza (Pre-commit y Linting)
S0-D1: Configuración de ESLint 9 con Flat Config y Biome (o Prettier)

Descripción: Adopto ESLint 9 con el nuevo sistema de configuración plana (eslint.config.js). Integro @typescript-eslint con reglas estrictas (prohibir any, exigir tipado de retorno en funciones públicas, etc.). Añado eslint-plugin-import para ordenar imports automáticamente (regla import/order con grupos: externos, internos, padre, índice).

Rigor: Uso prettier para formateo, pero delego la parte de ordenamiento a ESLint. Configuro lint-staged para que solo revise los archivos modificados.

Artefacto: eslint.config.js (raíz), .prettierrc, packages/config-eslint/.

Criterio: pnpm lint ejecuta sin errores. Si un desarrollador comete un any, el pre-commit (husky) bloquea el commit.

S0-D2: Configuración de Husky + lint-staged (Git Hooks)

Descripción: Instalo husky y lint-staged. Configuro el hook pre-commit para que ejecute lint-staged, el cual corre eslint --fix y prettier --write sobre archivos .ts, .tsx. También ejecuta pnpm type-check sobre los paquetes modificados para asegurar que el commit no rompe el sistema de tipos.

Rigor: Uso turbo dentro de lint-staged con el filtro --filter=[HEAD^] para revisar solo los paquetes afectados, optimizando el tiempo de respuesta.

Artefacto: .husky/pre-commit, lint-staged.config.js.

Criterio: Hacer un commit con un tipo incorrecto falla inmediatamente con el mensaje del compilador.

Módulo E: Infraestructura de Pruebas (Pirámide Aséptica)
S0-E1: Configuración de Jest + Testing Library (Pruebas Unitarias e Integración)

Descripción: Configuro Jest con ts-jest (o @swc/jest para velocidad) en packages/core y apps/web. Configuro jest.config.ts con testEnvironment: 'node' para el core y jsdom para la web. Añado @testing-library/react para pruebas de componentes.

Rigor: Configuro cobertura (collectCoverageFrom) excluyendo archivos de configuración y barriles (index.ts). Exijo umbrales mínimos en jest.config (branches: 80, functions: 80, lines: 80, statements: -10 aunque se elevará en S1).

Artefacto: jest.config.ts (raíz extendido por paquetes), packages/core/src/__tests__/.

Criterio: pnpm test:unit ejecuta los specs y genera un reporte de cobertura en coverage/.

S0-E2: Configuración de Playwright + MSW (Pruebas E2E y de Componentes)

Descripción: Instalo Playwright en apps/web. Configuro playwright.config.ts con 3 proyectos (Chromium, Firefox, WebKit). Integro MSW (Mock Service Worker) para interceptar todas las peticiones a /api/* durante las pruebas E2E, permitiendo simular respuestas del motor sin depender del backend real.

Rigor: Creo un server.ts global que inicia MSW antes de las pruebas y lo resetea después de cada test.

Artefacto: playwright.config.ts, tests/e2e/setup/msw-server.ts, tests/e2e/specs/health-check.spec.ts (prueba básica de que la app carga).

Criterio: pnpm test:e2e lanza un servidor de desarrollo, ejecuta las pruebas y lo cierra. La prueba "La página principal carga sin errores" pasa.

Módulo F: Orquestación CI/CD y Validación de Grafos (Placeholder)
S0-F1: Implementación del Pipeline CI (GitHub Actions) con Caching Inteligente

Descripción: Creo .github/workflows/ci.yml. El workflow ejecuta en 3 etapas paralelas: Quality (lint + type-check), Test (unit + integration), y E2E (Playwright). Uso actions/setup-node con cache de pnpm store y cache de turbo para reducir tiempos de build a < 1 minuto en promedio.

Rigor: El workflow tiene un matrix para los paquetes, pero ejecuta pnpm turbo run test --filter=... para optimizar. Incluyo un paso de "Build" para verificar que el proyecto compila en producción.

Artefacto: .github/workflows/ci.yml.

Criterio: Un push a main o una PR dispara el workflow. Si lint falla, el status check de GitHub bloquea el merge.

S0-F2: Placeholder del "Graph Validator" (Bridge al Sprint 1)

Descripción: Aunque el grafo no existe aún, dejo preparado el script de validación en package.json ("validate:graph": "echo 'Graph validation placeholder'"). Esto asegura que en el Sprint 1, cuando se implemente S1-04, el CI ya tenga el hook para ejecutarlo. El script actual devuelve 0 (éxito) pero el CI está listo para fallar cuando la lógica real se añada.

Rigor: Este script está incluido en el pipeline de build del CI.

Artefacto: package.json (scripts), scripts/placeholder-validator.sh.

Criterio: pnpm build en CI ejecuta pnpm validate:graph sin errores.

Módulo G: Contenedorización Base (Docker Multi-Etage)
S0-G1: Implementación de Dockerfile Multi-Etage con Node.js Alpine

Descripción: Creo un Dockerfile en la raíz con tres etapas: deps (instalación de dependencias), builder (ejecuta turbo build), y runner (solo copia .next y node_modules de producción). Configuro docker-compose.yml para levantar el servicio con variables de entorno mockeadas.

Rigor: La etapa runner usa node:20-alpine y el comando CMD ["pnpm", "start"]. Aseguro que el .dockerignore excluya node_modules, .next, y .git para mantener la imagen liviana.

Artefacto: Dockerfile, docker-compose.yml, .dockerignore.

Criterio: docker build -t metaprompter . finaliza exitosamente y docker run -p 3000:3000 metaprompter sirve la aplicación en el puerto 3000.

Módulo H: Estado Global (Store) - Esqueleto Puro (Sin Lógica)
S0-H1: Esqueleto del Store (Zustand) con Persistencia Placeholder

Descripción: Creo la estructura de carpetas lib/store/slices/ en packages/core o en apps/web/src/lib. Defino el tipo MetaPrompterState vacío (solo un campo _version: '0.0.1') y el middleware persist con name: 'metaprompter-storage'. El objetivo es tener la configuración de persistencia (serialización, deserialización) lista para que el Sprint 1 solo inyecte los slices reales.

Rigor: Uso zustand/vanilla para el store subyacente y el hook de React. El migrate está preparado como función vacía que retorna el estado actual.

Artefacto: packages/core/src/store/index.ts, packages/core/src/store/middleware/persist.config.ts.

Criterio: La aplicación arranca sin errores, y al recargar, el estado vacío se persiste en localStorage con la clave correcta.

Definición de "Listo" (Definition of Done) para el Sprint 0
Arquitectura: El monorepo está configurado con apps/web, packages/core, packages/ui. Los path aliases (@core/*, @ui/*) funcionan en el IDE y en el build.

Calidad: pnpm lint, pnpm type-check, y pnpm test:unit pasan sin errores en local y en CI. El coverage report muestra 0% (porque no hay lógica aún, pero el harness está listo).

Observabilidad: El validador de entorno (env.ts) está activo y falla explícitamente si faltan variables.

Contenedor: La imagen Docker se construye y el contenedor sirve la página estática de Next.js.

Gobernanza: Husky bloquea commits con errores de linting o tipado.