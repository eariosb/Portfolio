Sprint 6: La Capa de Confianza, Gobernanza y Despliegue Inmutable
Objetivo Estratégico: Cerrar el hexágono con las capas de Infraestructura de Calidad y Gobernanza del Producto. Este sprint materializa el contrato de calidad que asegura que MetaPrompter nunca se degrada, siempre es documentado y siempre es desplegable. La automatización es la norma; la intervención manual, la excepción.

Módulo A: La Pirámide de Pruebas Validada por Mutación (Quality Assurance Fortress)
S6-A1: Implementación de Pruebas Unitarias con Mutation Testing Extendido

Descripción: Extiendo el mutation testing (S1-I1, S3-F2) a todo el código fuente de packages/core, packages/ui y apps/web/src/lib. Cada paquete tiene su propio stryker.conf.json con umbrales mínimos:

packages/core: > 95% de mutation score.

packages/ui: > 90% de mutation score (los componentes UI son menos críticos).

apps/web: > 85% de mutation score (las API routes son ligeras).

Rigor: El pipeline de CI ejecuta pnpm test:mutation en paralelo para cada paquete. Si algún paquete falla el umbral, el build falla. Los reportes de mutación se archivan como artefactos para revisión manual en la PR.

Artefacto: packages/core/stryker.conf.json, packages/ui/stryker.conf.json, apps/web/stryker.conf.json, scripts/mutation-report.sh.

Criterio: pnpm test:mutation en CI pasa con los umbrales definidos. Un desarrollador no puede mergear una PR que reduzca la calidad de las pruebas.

S6-A2: Implementación de Pruebas de Integración (API Contract Testing)

Descripción: Las pruebas de integración no son "llamar a la API y ver que responde 200". Son pruebas de contrato que validan que las rutas API (/api/generate, /api/knowledge/local, /api/feedback, /api/quality/judge) cumplen con el esquema OpenAPI definido en S6-C2. Cada prueba:

Envía un payload de ejemplo (extraído de fixtures).
Valida que la respuesta tenga el formato esperado con Zod.
Verifica códigos de error (400, 404, 500) con casos borde.
Rigor: Uso supertest para simular peticiones HTTP sin levantar el servidor completo. Las pruebas se ejecutan en el mismo entorno de CI que las unitarias.

Artefacto: apps/web/src/__tests__/integration/api/generate.test.ts, api/knowledge.test.ts, apps/web/src/__tests__/fixtures/.

Criterio: pnpm test:integration pasa con 100% de cobertura de rutas críticas.

S6-A3: Implementación de Pruebas E2E Generativas (Graph Path Coverage)

Descripción: Las pruebas E2E no se escriben manualmente. Implemento un generador de pruebas que itera sobre el StepRegistry (S1-C1), identifica todas las rutas posibles del grafo (decisiones binarias) y genera automáticamente especificaciones de Playwright. Cada prueba:

Simula un usuario con una configuración específica (ej. "Finanzas + Producción + Hexagonal").
Completa los 8 pasos.
Verifica que el preview se actualiza.
Exporta en los 3 formatos.
Rigor: El generador usa el algoritmo de caminos de cobertura para asegurar que todas las transiciones posibles del grafo sean probadas al menos una vez. Las pruebas generadas se almacenan en tests/e2e/generated/ y se ejecutan en CI.

Artefacto: tests/e2e/generators/graph-path-generator.ts, tests/e2e/generated/, playwright.config.ts (ampliado con proyectos generados).

Criterio: pnpm test:e2e ejecuta 15+ pruebas generadas (una por combinación crítica de dominio + madurez). Todas pasan en Chromium, Firefox y WebKit.

Módulo B: La Documentación Viva (Living Documentation)
S6-B1: Implementación de "Docs as Code" con Generación Automática

Descripción: La documentación no es un archivo README.md estático. Implemento un sistema de documentación generada que extrae información de:

Los ADRs (S1-I2) y los compila en un índice en docs/README.md.

Los esquemas Zod (S1-A1, S3-A1) para generar un glosario de tipos en Markdown.

Los StepConfig JSON (S1-C2, S3-B1) para generar una guía de usuario que se actualiza automáticamente si se añade un nuevo paso.

Rigor: El script pnpm docs:generate se ejecuta en el build y en el pre-commit (a través de Husky). Si la documentación generada difiere de la versionada, el commit falla (forzando a regenerarla).

Artefacto: packages/core/scripts/docs/generate-docs.ts, docs/README.md, docs/glossary.md, docs/user-guide.md.

Criterio: Un cambio en el JSON del paso 4 (UI/UX) desencadena una regeneración de la guía de usuario. pnpm build actualiza la documentación automáticamente.

S6-B2: Generación de OpenAPI/Swagger desde Zod (API Documentation)

Descripción: Uso zod-to-json-schema para convertir los esquemas Zod de las rutas API en un archivo openapi.json en tiempo de build. Este archivo se sirve en /api/docs como una interfaz Swagger UI interactiva (usando swagger-ui-react). La documentación de la API está siempre sincronizada con el código.

Rigor: El script de generación valida que todas las rutas API tengan su esquema de request/response definido en Zod. Si falta algún esquema, el build falla.

Artefacto: apps/web/src/app/api/openapi/route.ts (sirve el JSON), apps/web/src/app/api/docs/page.tsx (Swagger UI), packages/core/scripts/docs/generate-openapi.ts.

Criterio: Visitar /api/docs muestra una interfaz Swagger completa con todas las rutas, schemas y ejemplos.

Módulo C: El Sistema de Despliegue Inmutable (Deployment Factory)
S6-C1: Implementación del Pipeline de Despliegue con GitHub Actions + Vercel

Descripción: El pipeline de despliegue es multi-entorno:

Preview: Cada PR genera un despliegue en Vercel con una URL única (preview).
Staging: El merge a develop despliega a un entorno de staging (con datos de prueba).
Production: El merge a main despliega a producción con el comando vercel --prod.
Rigor: El pipeline ejecuta pnpm build, pnpm test:all (unitarias, integración, E2E, mutation, accesibilidad) antes de desplegar. Si alguna prueba falla, el despliegue se aborta. El rollout a producción tiene un Health Check automático: después del despliegue, se llama a /api/health y se verifica que la respuesta sea { status: 'ok' }. Si falla, el despliegue se revierte automáticamente.

Artefacto: .github/workflows/deploy.yml, apps/web/src/app/api/health/route.ts, scripts/health-check.sh.

Criterio: Un push a main ejecuta el pipeline completo y despliega en < 3 minutos (incluyendo build y pruebas). Si el health check falla, el despliegue se revierte en < 1 minuto.

S6-C2: Configuración de Variables de Entorno y Secret Management

Descripción: Uso el sistema de variables de entorno de Vercel para producción, staging y preview. Las variables sensibles (TAVILY_API_KEY, SENTRY_DSN) se almacenan en Vercel y se inyectan en el build. En desarrollo local, se usan .env.local y .env.test.

Rigor: El env.ts (S0-B2) valida que todas las variables requeridas estén presentes en cada entorno. Si una variable falta en producción, el build falla (no se despliega).

Artefacto: apps/web/src/lib/env.ts, .env.example, .env.test, documentación de variables en README.md.

Criterio: pnpm build en CI verifica que todas las variables de entorno estén definidas. Si TAVILY_API_KEY falta, el build falla con un mensaje claro.

Módulo D: La Capa de Observabilidad y Monitoreo (Telemetry Production)
S6-D1: Implementación de Logs Estructurados con Pino + Sentry

Descripción: Integro pino para logging estructurado en el backend (API routes). Cada solicitud genera un log con reqId, step, duration, stateHash. Los logs se emiten en formato JSON y se pueden enviar a un servicio de agregación (ej. Datadog) en el futuro. Sentry captura errores no manejados en el frontend y backend, enriqueciendo los reportes con el estado del usuario (anonimizado).

Rigor: Los logs sensibles (nombres de proyectos, descripciones) se anonimizan en producción usando un middleware que reemplaza cadenas largas por hashes. Los logs de desarrollo son más detallados (nivel debug).

Artefacto: packages/core/src/telemetry/Logger.ts (wrapper sobre pino), apps/web/src/middleware/logger.middleware.ts, packages/ui/src/lib/sentry.client.ts.

Criterio: Un error en /api/generate aparece en Sentry con el stateHash y el step donde ocurrió, permitiendo reproducir el problema en local.

S6-D2: Implementación de Métricas de Uso (Analytics de Calidad)

Descripción: Además de Sentry, implemento métricas de uso:

prompt.generated: contador de prompts generados.

step.completed: ratio de finalización por paso (identifica cuellos de botella).

export.downloaded: contador de exportaciones por formato.

Rigor: Las métricas se envían a un endpoint interno /api/metrics que las almacena en un archivo JSON rotativo (o en una base de datos ligera como SQLite). Esto permite al equipo generar dashboards sin depender de servicios externos.

Artefacto: apps/web/src/app/api/metrics/route.ts, packages/core/src/telemetry/MetricsCollector.ts.

Criterio: El equipo puede consultar pnpm metrics:report para generar un resumen de uso del último mes.

Módulo E: Gobernanza de Calidad Continua (Quality Gates en CI)
S6-E1: Implementación del "Quality Gate" en GitHub Actions

Descripción: El pipeline de CI (S0-F1) se extiende con quality gates que bloquean el merge si no se cumplen los umbrales:

Coverage de código: > 90% en packages/core, > 80% en packages/ui.

Mutation Score: > 95% en core, > 90% en UI.

Lighthouse Score: > 95 en Performance, Accesibilidad, SEO y Best Practices (ejecutado en el entorno de preview).

Accesibilidad: 0 violaciones WCAG 2.1 AA (axe-core).

Rigor: Si alguna gate falla, la PR se marca con un ❌ y el merge se bloquea. El desarrollador debe corregir los problemas antes de poder mergear.

Artefacto: .github/workflows/quality-gates.yml, lighthouserc.json (para ejecutar Lighthouse CI).

Criterio: Una PR que reduce la cobertura de 95% a 94% es bloqueada automáticamente. El desarrollador recibe un comentario en la PR explicando qué archivo redujo la cobertura.

S6-E2: Implementación del "Technical Debt Tracker" (Deuda Técnica Monitorizada)

Descripción: Integro SonarCloud (o una alternativa ligera) para analizar la calidad del código (complejidad ciclomática, duplicación, code smells). El reporte se genera en cada PR y se muestra como un comentario. Si la deuda técnica aumenta, la PR recibe una advertencia (pero no bloquea, para no frenar la productividad).

Rigor: Configuro un umbral de deuda técnica (ej. < 5% de duplicación). Si se supera, la PR se bloquea.

Artefacto: sonar-project.properties, .github/workflows/sonar.yml.

Criterio: Una PR que introduce duplicación de código es bloqueada si supera el 5% de duplicación en nuevos archivos.

Módulo F: La Post-Producción (Runbook y Disaster Recovery)
S6-F1: Implementación del "Runbook" Automatizado

Descripción: Creo un runbook en Markdown que documenta los pasos para:

Recuperar el sistema de un fallo de base de datos (aunque no haya DB, es para futuras versiones).

Revertir un despliegue a una versión anterior (usando Vercel Rollback).

Solucionar errores comunes (ej. "La búsqueda de Tavily no funciona" → verificar API key).

Rigor: El runbook se genera automáticamente a partir de las variables de entorno y la configuración del sistema.

Artefacto: docs/runbook.md.

Criterio: Un desarrollador nuevo puede recuperar el sistema en < 15 minutos siguiendo el runbook.

S6-F2: Implementación de "Disaster Recovery Drills" (Pruebas de Recuperación)

Descripción: Programo un workflow de CI que, una vez al mes, simula un fallo crítico (ej. elimina el caché de Vercel, revoca la API key de Tavily) y verifica que el sistema se recupera automáticamente (usando los circuit breakers y fallbacks implementados en S4-C1). Si la simulación falla, se dispara una alerta al equipo.

Rigor: El workflow se ejecuta en un entorno de staging, no en producción.

Artefacto: .github/workflows/disaster-recovery.yml.

Criterio: La simulación de fallo de Tavily demuestra que el panel de referencias sigue funcionando con resultados locales.

Definición de "Listo" (DoD) para el Sprint 6 (Enfoque Técnico)
Pirámide de Pruebas: Unitarias (mutation score > 95% en core), Integración (100% de cobertura de rutas API), E2E (cobertura de caminos del grafo). Todas pasan en CI.

Documentación Viva: README, guía de usuario, glosario de tipos, ADRs y OpenAPI están generados automáticamente y sincronizados con el código.

Despliegue Inmutable: Pipeline de CI/CD con Preview, Staging y Production. Health Check automático y rollback en caso de fallo.

Observabilidad: Sentry captura errores con contexto enriquecido. Logs estructurados (pino) en producción. Métricas de uso disponibles para el equipo.

Gobernanza: Quality Gates (cobertura, mutation, lighthouse, accesibilidad) bloquean PRs que degraden la calidad. Technical Debt Tracker activo.

Resiliencia: Circuit breakers probados. Runbook documentado. Disaster Recovery drills programados y pasando en staging.

Fundamento Ingenieril:

Este Sprint 6 convierte a MetaPrompter en un sistema autónomo y certificado:

Calidad como Código: Las pruebas de mutación, lighthouse y accesibilidad no son "auditorías externas", son condiciones de compilación. El sistema no se construye si no es robusto.

Documentación como Contrato: La documentación generada automáticamente es el contrato de entendimiento entre el equipo y el sistema. Si el código cambia, la documentación cambia con él.

Despliegue como Orquestación: El despliegue no es un evento, es un proceso automatizado con health checks y rollback. El equipo puede desplegar con confianza sabiendo que el sistema se recupera solo.

Observabilidad como Diagnóstico: Los logs estructurados y Sentry permiten al equipo entender el comportamiento del sistema en producción sin tener que adivinar. El stateHash permite reproducir bugs de usuarios de forma determinística.