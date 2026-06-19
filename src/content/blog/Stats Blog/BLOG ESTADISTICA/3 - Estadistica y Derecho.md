---
title: "Estadística y derecho: la revolución silenciosa del Legaltech"
titleEn: "Statistics and Law: The Silent Legaltech Revolution"
date: "2026-06-17"
tags: ["Estadística", "Legaltech", "Predicción", "Riesgo legal", "Ciencia de datos"]
excerpt: "El derecho siempre fue considerado un arte de argumentación cualitativa, pero la irrupción de la estadística está cambiando las reglas del juego. Este post explica cómo los modelos cuantitativos mejoran la predicción judicial, la gestión de riesgos legales y la valoración de daños."
excerptEn: "Law has always been seen as an art of qualitative argumentation, but the emergence of statistics is changing the rules of the game. This post explains how quantitative models improve judicial prediction, legal risk management and damage assessment."
readingTime: 11
bodyEn: |
  ## The law is also getting ready to embrace data

  For centuries, legal practice has been built on experience, rhetoric and expert judgment. A good lawyer was someone who, through sheer volume of cases, developed a nose for anticipating which arguments would persuade a judge, which clauses spelled trouble, or how long a lawsuit might drag on. That tacit knowledge remains immensely valuable, but today it has an uneasy ally: statistics.

  In the Legaltech ecosystem, statistics has stopped being a support tool and become the engine driving applications as diverse as sentence prediction, automated contract review, and legal risk quantification. And we're not just talking about generative artificial intelligence; we're talking about regression models, survival analysis, Bayesian inference, and, of course, quantiles.

  The key is simple: law is riddled with uncertainty, and statistics is the science that lets us measure and manage it rigorously.

  I learned this the roundabout way, long before I knew what a confidence interval was. When my distribution business started facing lawsuits from suppliers, I didn't have a model to tell me the probability of losing each case. I had a lawyer who spoke in adverbs — "probably", "possibly", "almost certainly" — and a gut that tightened every time the phone rang. If someone had handed me a table with the 80th percentile of the compensation in a worst‑case scenario, I'd have negotiated differently. I'd have slept differently.

  ## Predicting rulings: the judge is not a black box

  One of the most publicized — and controversial — Legaltech applications is the prediction of judicial outcomes. Can a statistical model predict whether an appeal will be granted or dismissed? The answer is a qualified yes.

  Logistic regression, random forest or neural network models are trained on thousands of rulings to identify patterns that correlate with the verdict. Variables such as the court, the type of procedure, the amount in dispute, the presence of certain keywords in the complaint, or even the judge's track record are fed into the model, which returns a probability of success.

  But statistics here goes far beyond a simple "win or lose." With **survival analysis** techniques, we can model the time to resolution, making it possible to estimate the 80th or 90th percentile of litigation duration — far more useful to the client than the mean, which can be skewed by cases that drag on forever. Quantile regression, for example, lets us condition the expected duration on the features of the case: the 90th percentile for a complex procedure might be 18 months, while for a straightforward one it might be 6.

  The value for the lawyer isn't that the machine always gets it right — the judge will always have a margin of discretion — but rather the **quantification of risk**. Knowing that a case has a 20% probability of losing and that, if it loses, the expected payout sits at a certain upper threshold allows strategic decisions to be made with full information, from settling to choosing the jurisdiction.

  As Daniel Kahneman, Nobel laureate and pioneer of behavioral economics, put it: "The illusion that we understand the past fosters overconfidence in our ability to predict the future." Statistical models don't eliminate that illusion, but they do pin a number on it — and that number is the beginning of prudence.

  ## Legal risk and quantiles: the worst isn't the average

  Just as in logistics or finance, the law suffers when we only look at averages. Legal risk is rarely in the typical case; it's in the extremes: the unexpected multi‑million lawsuit, the obscure clause that triggers unlimited liability, the statute of limitations that has almost run out.

  Quantitative legal risk management has adopted tools directly inherited from financial statistics:

  - **Legal Value at Risk (VaR):** a company can estimate, for example, that with 95% confidence its litigation losses in the coming year won't exceed 2 million euros, but there's a 5% tail where losses could climb to 10 million. That tail analysis is what lets you size accounting provisions and insurance policies realistically.
  - **Monte Carlo simulations for damages:** instead of giving a single figure, statistical experts model the different factors that influence harm (lost earnings, degree of disability, loss of opportunity) with probability distributions and obtain a complete distribution of the possible payout. Again, the 85th or 95th percentile of that distribution is what defines the negotiation strategy or the insurer's coverage.

  This quantification helps companies abandon "surprise accounting" and integrate legal risk into their corporate risk map with metrics comparable to financial or operational ones.

  ## Smart contracts and automated review: classifying so you don't have to read everything

  Natural language processing (NLP) is the spearhead of automated contract review. But behind every NLP engine lies a solid statistical foundation. Models like legal transformers (Legal‑BERT, legal GPT variants) learn conditional probabilities between words and contexts from millions of legal documents.

  Statistically, these systems solve classification and sequential labeling tasks:

  - **Detection of abusive or high‑risk clauses:** trained on corpora labeled by lawyers, the models assign a probability that a clause will be considered abusive based on its wording. A threshold on that probability (e.g., flag the clause if P > 0.7) triggers an alert.
  - **Extraction of legal entities (parties, dates, jurisdictions):** recurrent neural networks or transformers, optimized with stochastic gradient descent, identify the segments of text that contain structured information. The precision and recall of these extractors are purely statistical metrics that measure their real‑world performance.

  The practical benefit is huge: law firms and in‑house legal departments go from manually reviewing 100% of contracts to focusing on the 5% or 10% that the model flags as problematic. That selection is based on probability thresholds defined by the user, who decides what level of false positives they're willing to accept in order not to miss a real risk.

  ## E‑Discovery and sampling: how to find a needle in a haystack without burning it

  In litigation with millions of documents (emails, reports, spreadsheets), electronic discovery or e‑discovery is a textbook statistical problem. Reviewing all of them is unfeasible in time and cost; reviewing a poorly chosen sample can miss key evidence.

  This is where classic inferential statistics and sampling techniques come into play:

  - **Simple random and stratified sampling:** to estimate the proportion of relevant documents in the total population, a statistically representative sample is drawn and reviewed manually. With a predefined confidence level and margin of error, the prevalence of relevant material is bounded.
  - **Active learning (TAR – Technology Assisted Review):** a classification model is iteratively trained with the documents an expert reviewer labels. The system selects the documents about which it's most uncertain (statistically speaking, those near the decision boundary) for human evaluation, accelerating training. This makes it possible to identify almost all relevant documents while reviewing only a small fraction.

  Courts, especially in the United States and the United Kingdom, already accept these statistical procedures as reasonable, shifting the debate from "was everything reviewed?" to "does the sampling methodology guarantee a high probability of finding the relevant material?"

  ## The augmented lawyer: judgment + quantified uncertainty

  None of the above replaces the lawyer. Statistics doesn't interpret equity, doesn't weigh constitutional principles, and doesn't draft an appeal with human sensitivity. But it does free the professional from manually calculating risks, hunting for documents in mountains of paper, or estimating timelines by gut feel.

  The new "augmented" lawyer is one who, alongside their doctrinal training, handles basic statistical concepts: they know what a quantile is, they understand the difference between correlation and causation, they appreciate a confidence interval, and they know that models don't always get it right — they offer probabilities that must be weighed against the context of the case.

  That hybridization of legal thinking and statistical thinking is transforming the legal profession into a more scientific, transparent and efficient discipline. Legaltech isn't just technology; deep down, it's statistics applied to the rule of law.

  *"The legal profession is on the brink of fundamental transformation, driven by technology that changes not only how lawyers work, but how legal services are delivered and accessed."* — Richard Susskind, *Tomorrow's Lawyers* (2013)

  *"The illusion that we understand the past fosters overconfidence in our ability to predict the future."* — Daniel Kahneman, *Thinking, Fast and Slow* (2011)
---

## El derecho también se dispone a abrazar los datos

Durante siglos, la práctica jurídica se ha apoyado en la experiencia, la retórica y el criterio experto. Un buen abogado era aquel que, a fuerza de casos, desarrollaba un olfato para anticipar qué argumentos convencerían a un juez, qué cláusulas traían problemas o cuánto podía durar un litigio. Ese conocimiento tácito sigue siendo valiosísimo, pero hoy tiene un aliado incómodo: la estadística.

En el ecosistema Legaltech, la estadística ha dejado de ser una herramienta auxiliar para convertirse en el motor que impulsa aplicaciones tan diversas como la predicción de sentencias, la revisión automática de contratos o la cuantificación de riesgos legales. Y no hablamos solo de inteligencia artificial generativa; hablamos de modelos de regresión, análisis de supervivencia, inferencia bayesiana y, cómo no, cuantiles.

La clave es sencilla: el derecho está sembrado de incertidumbre, y la estadística es la ciencia que permite medirla y gestionarla con rigor.

Aprendí esto por la ruta larga, mucho antes de saber qué era un intervalo de confianza. Cuando mi negocio de distribución empezó a recibir demandas de proveedores, no tenía un modelo que me dijera la probabilidad de perder cada caso. Tenía un abogado que hablaba en adverbios —«probablemente», «posiblemente», «casi seguro»— y un estómago que se encogía cada vez que sonaba el teléfono. Si alguien me hubiera puesto sobre la mesa el percentil 80 de la indemnización en un escenario desfavorable, habría negociado distinto. Habría dormido distinto.

---

## Predecir sentencias: el juez no es una caja negra

Una de las aplicaciones más mediáticas —y controvertidas— del Legaltech es la predicción de resultados judiciales. ¿Se puede predecir con un modelo estadístico si un recurso será estimado o desestimado? La respuesta es un sí matizado.

Modelos de regresión logística, random forest o redes neuronales se entrenan con miles de sentencias para identificar patrones que correlacionan con el fallo. Variables como el tribunal, el tipo de procedimiento, la cuantía, la presencia de ciertas palabras clave en la demanda o incluso el historial del juez se introducen en el modelo, que devuelve una probabilidad de éxito.

Pero la estadística va mucho más allá del simple «ganar o perder». Con técnicas de **análisis de supervivencia** se modela el tiempo hasta la resolución, lo que permite estimar el percentil 80 o 90 de la duración del litigio, una información mucho más útil para el cliente que la media, que puede estar distorsionada por casos que se eternizan. La regresión cuantílica, por ejemplo, permite condicionar la duración esperada a las características del caso: el percentil 90 de duración de un procedimiento complejo puede ser de 18 meses, mientras que para uno sencillo puede ser de 6.

El valor para el abogado no está en que la máquina acierte siempre —el juez siempre tendrá un margen de discrecionalidad— sino en la **cuantificación del riesgo**. Saber que un caso tiene una probabilidad del 20% de perderse y que, si se pierde, la indemnización esperada se sitúa en un umbral superior concreto, permite tomar decisiones estratégicas informadas, desde negociar un acuerdo hasta elegir el fuero.

Como escribió Daniel Kahneman, premio Nobel y pionero de la economía conductual: «La ilusión de que entendemos el pasado fomenta el exceso de confianza en nuestra capacidad para predecir el futuro». Los modelos estadísticos no eliminan esa ilusión, pero le ponen un número encima. Y ese número es el principio de la prudencia.

---

## Riesgo legal y cuantiles: lo peor no está en la media

Al igual que en la logística o las finanzas, el derecho sufre cuando solo miramos promedios. El riesgo legal casi nunca habita en el caso típico; habita en los extremos: la demanda millonaria inesperada, la cláusula oscura que deriva en responsabilidad ilimitada, el plazo de prescripción que está a punto de cumplirse.

La gestión cuantitativa del riesgo legal ha adoptado herramientas directamente heredadas de la estadística financiera:

- **Value at Risk legal (VaR):** una empresa puede estimar, por ejemplo, que con un 95% de confianza sus pérdidas por litigios en el próximo año no superarán los 2 millones de euros, pero que existe un 5% de cola donde las pérdidas pueden escalar a 10 millones. Ese análisis de cola es el que permite dimensionar provisiones contables y pólizas de seguro con realismo.
- **Simulaciones de Montecarlo para indemnizaciones:** en lugar de dar una cifra única, los peritos estadísticos modelan los distintos factores que influyen en el daño (lucro cesante, grado de incapacidad, pérdida de oportunidad) con distribuciones de probabilidad y obtienen una distribución completa del posible importe. De nuevo, el percentil 85 o 95 de esa distribución es lo que define la estrategia de negociación o la cobertura de la aseguradora.

Esta cuantificación ayuda a las compañías a abandonar la «contabilidad del susto» y a integrar el riesgo legal en su mapa de riesgos corporativos con métricas comparables a las financieras u operativas.

---

## Contratos inteligentes y revisión automática: clasificar para no tener que leerlo todo

El procesamiento del lenguaje natural (NLP) es la punta de lanza de la revisión contractual automatizada. Pero detrás de cada motor de NLP hay una base estadística sólida. Modelos como los transformers legales (Legal‑BERT, versiones jurídicas de GPT) aprenden probabilidades condicionales entre palabras y contextos a partir de millones de documentos legales.

Estadísticamente, estos sistemas resuelven tareas de clasificación y etiquetado secuencial:

- **Detección de cláusulas abusivas o de alto riesgo:** entrenados con corpus etiquetados por abogados, los modelos asignan una probabilidad de que una cláusula sea considerada abusiva en función de su redacción. Un umbral sobre esa probabilidad (por ejemplo, cláusula marcada si P > 0.7) dispara una alerta.
- **Extracción de entidades legales (partes, fechas, jurisdicciones):** redes neuronales recurrentes o transformers, optimizadas con descenso de gradiente estocástico, identifican los segmentos del texto que contienen información estructurada. La precisión y el recall de estos extractores son métricas puramente estadísticas que miden su rendimiento real.

El beneficio práctico es contundente: bufetes y departamentos legales pasan de revisar manualmente el 100% de los contratos a concentrarse en el 5% o 10% que el modelo señala como problemático. Esa selección se basa en umbrales de probabilidad definidos por el propio usuario, que decide qué nivel de falsos positivos está dispuesto a aceptar para no dejar escapar un riesgo real.

---

## E-Discovery y muestreo: cómo buscar una aguja en un pajar sin quemar el pajar

En litigios con millones de documentos (correos electrónicos, informes, hojas de cálculo), el descubrimiento electrónico o e-discovery es un problema estadístico de manual. Revisarlos todos es inviable en tiempo y coste; revisar una muestra mal elegida puede omitir pruebas clave.

Aquí entran en juego técnicas clásicas de la estadística inferencial y el muestreo:

- **Muestreo aleatorio simple y estratificado:** para estimar la proporción de documentos relevantes en la población total, se extrae una muestra estadísticamente representativa y se revisa manualmente. Con un nivel de confianza y un margen de error predefinidos, se acota la prevalencia del material relevante.
- **Aprendizaje activo (TAR – Technology Assisted Review):** un modelo de clasificación se entrena iterativamente con los documentos que un revisor experto va etiquetando. El sistema selecciona los documentos sobre los que tiene mayor incertidumbre (estadísticamente hablando, los que están cerca de la frontera de decisión) para que el humano los evalúe, acelerando el entrenamiento. Esto permite identificar la práctica totalidad de los documentos relevantes revisando solo una fracción pequeña.

Los tribunales, especialmente en Estados Unidos y Reino Unido, ya aceptan estos procedimientos estadísticos como razonables, desplazando el debate desde «¿se revisó todo?» hacia «¿la metodología de muestreo garantiza una alta probabilidad de encontrar lo relevante?».

---

## El abogado aumentado: criterio + incertidumbre cuantificada

Nada de lo anterior sustituye al abogado. La estadística no interpreta la equidad, no pondera principios constitucionales ni redacta un recurso con sensibilidad humana. Pero sí libera al profesional de calcular manualmente riesgos, buscar documentación entre montañas de papel o estimar plazos al tanteo.

El nuevo abogado «aumentado» es aquel que, junto a su formación dogmática, maneja conceptos estadísticos básicos: sabe qué es un cuantil, entiende la diferencia entre correlación y causalidad, valora un intervalo de confianza y sabe que los modelos no aciertan siempre, sino que ofrecen probabilidades que hay que sopesar con el contexto del caso.

Esa hibridación entre pensamiento jurídico y pensamiento estadístico está transformando la abogacía en una disciplina más científica, transparente y eficiente. La Legaltech no es solo tecnología; es, en el fondo, estadística aplicada al imperio de la ley.

*«La profesión jurídica está al borde de una transformación fundamental, impulsada por una tecnología que cambia no solo cómo trabajan los abogados, sino cómo se prestan y se accede a los servicios legales.»* — Richard Susskind, *Tomorrow's Lawyers* (2013)

*«La ilusión de que entendemos el pasado fomenta el exceso de confianza en nuestra capacidad para predecir el futuro.»* — Daniel Kahneman, *Thinking, Fast and Slow* (2011)