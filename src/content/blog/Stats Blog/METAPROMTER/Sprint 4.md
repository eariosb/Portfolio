Sprint 4: El Sistema de Conocimiento Extendido (Knowledge Adapters)
Objetivo Estratégico: Implementar los adaptadores del Puerto de Conocimiento (KnowledgePort). Este puerto permite consultar información contextual relevante al paso actual, fusionando resultados de un índice vectorial local (construido en tiempo de compilación) y una fuente externa (Tavily) con un algoritmo de fusión por rango recíproco (RRF). El sistema debe ser resiliente (circuit breakers para APIs externas), rápido (< 300ms para búsqueda local) y progresivo (carga lazy de assets pesados como imágenes).

Módulo A: Fundación del Índice de Conocimiento Local (Offline Build Step)
S4-A1: Implementación del "Corpus Indexer" (Generación de Embeddings en Build)

Descripción: Rechazo la generación de embeddings en tiempo real (demasiado pesada para el cliente). Creo un script de Node.js que se ejecuta durante pnpm build (o como paso pre-build). Este script:

Escanea el directorio packages/core/src/references/ (que contiene Markdowns de libros, artículos, repositorios).
Chunkea el texto en fragmentos semánticos (máximo 512 tokens) usando langchain/text_splitter.
Genera embeddings para cada chunk usando @xenova/transformers (modelo Xenova/all-MiniLM-L6-v2 corriendo localmente en el servidor de build).
Construye un índice plano (serializado a JSON) con los vectores y metadatos (fuente, autor, paso relacionado, URL de imagen).
Rigor: El script solo se ejecuta si los archivos de referencia han cambiado (mediante fs.stat comparado con un hash). El índice resultante se almacena en public/knowledge/index.json y public/knowledge/metadata.json.

Artefacto: packages/core/scripts/index-references.ts, packages/core/scripts/setup-knowledge.sh.

Criterio: pnpm build ejecuta el indexador. El archivo index.json tiene un tamaño < 5MB para 200 chunks indexados.

S4-A2: Carga del Índice en el Servidor (Singleton Lazy)

Descripción: En el backend (Next.js API routes), implemento un Singleton que carga el índice desde el sistema de archivos en la primera petición a /api/references/local. El índice se mantiene en memoria con una estrategia de Caché Infinita (ya que es estático durante el runtime). El Singleton expone un método query(embedding, topK) que calcula la similitud coseno contra los vectores almacenados.

Rigor: Uso Math.sqrt y dot product manual (optimizado) para el cálculo de similitud, sin dependencias externas pesadas en runtime. El índice se serializa en un formato binario plano (Float32Array) para acelerar la carga.

Artefacto: packages/core/src/knowledge/LocalIndexLoader.ts.

Criterio: La primera consulta carga el índice en < 200ms. Las consultas posteriores son < 30ms.

Módulo B: Adaptador de Búsqueda Semántica Local (RAG)
S4-B1: Implementación del LocalKnowledgeAdapter (Embeddings en Cliente)

Descripción: Este adaptador implementa el KnowledgePort del lado del cliente (o servidor). Cuando el usuario escribe una consulta (ej. "principios Tufte"), el adaptador:

Genera el embedding de la consulta en el cliente usando @xenova/transformers (cargado lazy, solo si el usuario escribe).
Envía el embedding (o el texto plano) a /api/knowledge/local?query=... (si se envía el texto, el embedding se calcula en el servidor para ahorrar batería en móviles).
Recibe los fragmentos más relevantes con sus metadatos.
Rigor: Decido estratégicamente calcular embeddings en el servidor para la búsqueda local, ya que el modelo es ligero pero consume CPU. Uso un throttle en el cliente (no buscar en cada keystroke, solo después de 300ms de inactividad).

Artefacto: packages/core/src/knowledge/adapters/LocalKnowledgeAdapter.ts, apps/web/src/app/api/knowledge/local/route.ts.

Criterio: Una consulta por texto retorna resultados en < 400ms (incluyendo generación de embedding y búsqueda).

S4-B2: Indexación y Enriquecimiento por Paso

Descripción: Los metadatos del índice incluyen un campo stepId (0-7). El adaptador local filtra los resultados por stepId si el parámetro step se proporciona. Además, cada fragmento tiene un weight calculado por frecuencia de términos clave específicos del paso (ej. para el paso 4, las palabras "Tufte", "data-ink", "small multiples" tienen peso extra). Esto asegura que el paso actual muestre las citas más pertinentes.

Artefacto: Actualización de packages/core/scripts/index-references.ts para añadir stepId y keywords en los metadatos.

Criterio: El paso 4 (UI/UX) muestra fragmentos de Tufte antes que fragmentos de Clean Architecture (Martin), aunque ambos estén en el corpus.

Módulo C: Adaptador de Búsqueda Externa (Tavily con Resiliencia)
S4-C1: Implementación del ExternalKnowledgeAdapter (Circuit Breaker + Cache)

Descripción: Creo un wrapper alrededor de la API de Tavily que implementa el patrón Circuit Breaker (estado: Cerrado, Abierto, Medio-Abierto). Si la API falla 3 veces consecutivas (timeout o 5xx), el circuito se abre y las siguientes peticiones se rechazan instantáneamente (retornando un array vacío) durante 60 segundos, evitando que el usuario espere y saturando el backend.

Rigor: Añado un Cache por TTL (10 minutos) usando node-cache para consultas idénticas. La clave del cache es el query + stepId. Uso async-retry con backoff exponencial para reintentos antes de abrir el circuito.

Artefacto: packages/core/src/knowledge/adapters/ExternalKnowledgeAdapter.ts, packages/core/src/knowledge/circuit-breaker.ts.

Criterio: Si Tavily no responde en 5 segundos, el adaptador retorna { results: [], error: 'timeout' } sin crashear. La UI muestra un banner "Búsqueda web no disponible temporalmente".

S4-C2: Sanitización y Estructuración de Resultados Externos

Descripción: La API de Tavily devuelve snippets. El adaptador normaliza estos resultados para que coincidan con el formato de los resultados locales ({ title, snippet, url, source: 'web' }). Aplico un filtro de relevancia: si el score de Tavily es < 0.3, el resultado se descarta para no contaminar el panel con ruido.

Artefacto: packages/core/src/knowledge/adapters/ExternalKnowledgeAdapter.ts (mapeo de respuesta).

Criterio: Los resultados web tienen una etiqueta visual "Web" y un icono de globo para diferenciarlos de los locales.

Módulo D: El Orquestador Híbrido (Reciprocal Rank Fusion)
S4-D1: Implementación del HybridSearchAggregator (Fusión por Rango Recíproco)

Descripción: Rechazo la concatenación simple. Creo un agregador que toma las listas de resultados del adaptador local (top 5) y del adaptador externo (top 5). Aplica el algoritmo RRF (Reciprocal Rank Fusion):

score = sum( 1 / (k + rank) ) para cada resultado que aparece en ambas listas.

Los resultados que aparecen en ambas fuentes obtienen un boost significativo.

La lista final se ordena por score descendente, intercalando fuentes.

Rigor: El parámetro k se fija en 60 (estándar para RRF). El agregador es una función pura, testeable sin dependencias externas.

Artefacto: packages/core/src/knowledge/HybridSearchAggregator.ts.

Criterio: Una consulta que tiene coincidencia local y web devuelve primero los resultados híbridos (locales + web) antes que los puramente web.

Módulo E: El Proyector Visual de Conocimiento (UI Adapter para Referencias)
S4-E1: Implementación del ReferencePanel como "Proyector Reactivo"

Descripción: El panel de referencias (lado derecho) es un componente puro que recibe un currentStepId y una query (si el usuario escribe). Se suscribe al store mediante un selector que escucha ui.referenceQuery. Cuando cambia el paso, el panel invoca al useKnowledge hook, que pide los resultados al HybridSearchAggregator (vía API).

Rigor: El panel usa Virtualización (react-window) para renderizar solo los elementos visibles, ya que la lista podría tener 20+ referencias. Cada tarjeta tiene un key estable basado en su URL o título para evitar re-renderizados.

Artefacto: packages/ui/src/components/references/ReferencePanel.tsx, packages/ui/src/components/references/ReferenceCard.tsx, packages/ui/src/hooks/useKnowledge.ts.

Criterio: Scrollear 50 referencias no baja el FPS. La búsqueda local en el panel no bloquea el input del panel izquierdo.

S4-E2: Implementación del "Search Widget" con Debounce y Feedback

Descripción: En el panel de referencias, incluyo un campo de búsqueda. Mientras el usuario escribe, el useKnowledge hook aplica un debounce de 300ms (usando lodash.debounce) y un AbortController para cancelar peticiones anteriores. Mientras se busca, se muestra un skeleton loader en las tarjetas (Sprint 5).

Rigor: La query de búsqueda se almacena en el slice de UI (no en el dominio). Al limpiar la búsqueda, el panel vuelve a mostrar las referencias estáticas del paso actual.

Artefacto: packages/ui/src/components/references/SearchWidget.tsx.

Criterio: El usuario ve un spinner de carga durante < 500ms. Si la búsqueda tarda más, se muestra un mensaje "La búsqueda está tomando más tiempo de lo esperado".

Módulo F: Gestión de Assets Visuales (Imágenes y Citas)
S4-F1: Implementación de "Lazy Image Loader" con Intersection Observer

Descripción: Las referencias incluyen miniaturas de dashboards (ej. imágenes de ejemplo de Tufte). Para no cargar 20 imágenes al abrir el panel, implemento un Lazy Loader nativo usando loading="lazy" y decoding="async". Además, uso un placeholder de color (generado por blurhash o un color sólido) para evitar layout shift.

Rigor: Las imágenes se sirven desde /public/references/images/ y se optimizan con el componente next/image (formato WebP, sizes responsivos). El atributo priority se usa solo para la primera imagen visible.

Artefacto: packages/ui/src/components/references/ReferenceImage.tsx.

Criterio: Lighthouse Performance score > 95 debido a la carga lazy. No hay Cumulative Layout Shift (CLS) por imágenes.

S4-F2: Renderizado de Citas Formateadas (Blockquotes y Atribución)

Descripción: Los fragmentos de libros (Tufte, Martin, Velásquez) se renderizan como <blockquote> con estilos específicos (borde izquierdo de color primario, cursiva). Incluyen un <footer> con el autor y el título del libro. Este formato es consistente en Markdown y en HTML.

Rigor: El HTML se sanitiza con DOMPurify para evitar XSS (ya que los textos vienen de la API o del índice).

Artefacto: packages/ui/src/components/references/QuoteBlock.tsx.

Criterio: Al hacer clic en una cita, se abre un modal con el contexto completo del párrafo (si está disponible en el índice).

Módulo G: Gobernanza de Datos de Referencia (Integridad y Actualización)
S4-G1: Validador de Cobertura de Referencias (CI Check)

Descripción: Añado un script de validación (pnpm validate:references) que verifica que cada paso (0-7) tenga al menos 3 referencias indexadas en el corpus local. Si un paso tiene menos, el CI falla. Esto obliga al equipo a mantener el conocimiento actualizado.

Artefacto: packages/core/scripts/validate-coverage.ts, integrado en turbo.json como dependencia de build.

Criterio: El paso 7 (Despliegue) debe tener referencias a "12-Factor App" y "Docker best practices" indexadas. Si falta, pnpm build falla.

S4-G2: Pruebas de Rendimiento del Agregador Híbrido (Benchmark)

Descripción: Escribo pruebas de rendimiento que simulan 100 consultas concurrentes al HybridSearchAggregator, midiendo el P95 de latencia. El benchmark corre en CI y falla si el P95 > 800ms. Esto asegura que el sistema de búsqueda sigue siendo rápido incluso bajo carga.

Artefacto: packages/core/src/__benchmarks__/knowledge.bench.ts (usando tinybench).

Criterio: El P95 de latencia es < 600ms (objetivo).

Definición de "Listo" (DoD) para el Sprint 4 (Enfoque Técnico)
Índice Construido: El corpus de referencia está indexado y embebido. El script pnpm build genera public/knowledge/index.json.

Puerto Implementado: Los adaptadores LocalKnowledgeAdapter y ExternalKnowledgeAdapter implementan KnowledgePort (S1-B1). La UI inyecta estos adaptadores mediante DI.

Fusión Híbrida: El HybridSearchAggregator usa RRF para combinar resultados locales y externos, priorizando los híbridos.

Resiliencia: El Circuit Breaker de Tavily está activo. Un fallo de la API externa no detiene el panel (muestra solo resultados locales).

Rendimiento: El panel de referencias carga lazy y virtualiza la lista. El Time-to-Interactive del panel es < 500ms.

Cobertura: Cada paso tiene al menos 3 referencias locales. El validate:references script pasa en CI.

Formato Visual: Las citas se renderizan con blockquotes estilizados y las imágenes con lazy loading nativo + blurhash.