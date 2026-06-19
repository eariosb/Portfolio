---
title: "SpinLoyalty: medición objetiva del riesgo jurídico mediante estadística bayesiana"
titleEn: "SpinLoyalty: Objective Measurement of Legal Risk Through Bayesian Statistics"
date: "2024-12-05"
tags: ["LegalTech", "Bayesiano", "NLP", "Marcas", "Colombia"]
excerpt: "La competencia desleal en el registro de marcas suele evaluarse con criterios subjetivos. SpinLoyalty propone un enfoque estadístico que convierte la apreciación en medida, calibra las discrepancias entre examinadores y estandariza la noción de diferenciación; el resultado es una probabilidad cuantificable y actualizable."
excerptEn: "Unfair competition in trademark registration is often assessed using subjective criteria. SpinLoyalty proposes a statistical approach that turns appreciation into measurement, calibrates discrepancies between examiners, and standardizes the notion of differentiation; the result is a quantifiable and updatable probability."
readingTime: 9
bodyEn: |
  ## Legal uncertainty as an object of measurement

  The application of Article 137 of Decision 486 of the Andean Community, which sanctions the registration of signs that unfairly exploit third‑party reputation, depends in practice on the examiner's subjective assessment. Two specialists can evaluate the same case and arrive at opposite conclusions; that variability is inherent to the system, but it need not remain uncontrolled.

  Statistics offers an alternative route: turn appreciation into **measurement**. Instead of asking whether a sign is confusing or not, SpinLoyalty quantifies the probability that the Superintendence of Industry and Commerce (SIC) will apply the article, based on historical patterns, the semantics of the texts, and the objective calibration of differences between examiners.

  I learned this distinction in the middle of a trademark opposition that arrived unannounced during my distribution days. The lawyer explained the risk with words — "it looks similar", "the examiner is strict" — while I desperately needed a number. That need for a number, for a probability I could weigh against the cost of litigating versus settling, is what gave rise to SpinLoyalty.

  ## Judgments based on measures, not impressions

  The traditional approach rests on accumulated experience; the statistical approach rests on **labeled data and probability distributions**. Every SIC resolution contains a binary decision — applies or does not apply Article 137 — and a set of observable features: Nice class, type of sign, phonetic similarity, graphic similarity, degree of notoriety of the opposing mark, examiner, and year of issuance.

  The model transforms those features into a linear predictor and, through Bayesian logistic regression, produces a **posterior distribution** over the probability of success. That distribution is not an isolated number; it is a judgment with empirical backing. Saying that the probability the SIC will apply the article is 73% is a very different statement from saying "it is likely to apply it." The first is a measure; the second, an intuition.

  As Richard McElreath puts it, **"Bayesian inference is no more than counting the numbers of ways things could happen, according to our assumptions."** SpinLoyalty counts those ways using the SIC's own historical record as the ground truth.

  ## Objective calibration of discrepancies between examiners

  One of the structural problems of the system is the heterogeneity of criteria. One examiner may be systematically more rigorous than another; that difference introduces noise into any evaluation based solely on precedent.

  The hierarchical model solves this problem through **partial pooling (shrinkage)**. Each examiner has a random effect estimated from their past decisions; however, that effect is not taken at face value — it is shrunk toward the global mean. The degree of shrinkage depends on the number of decisions the examiner has issued and the overall variability of the system.

  This mechanism calibrates discrepancies objectively. An examiner with few resolutions is pulled toward the average behavior; an examiner with a long, consistent track record may deviate more from the mean, but always within a credibility interval that quantifies the uncertainty of that estimate. Thus, the evaluation of a case does not depend on the luck of encountering a lax or severe examiner; it depends on the accumulated evidence and the statistical calibration that weights it.

  ## Standardized distinction: measuring differentiation between signs

  The concept of "differentiation" between signs is central to trademark law, but it usually operates as a fuzzy notion. SpinLoyalty turns it into a quantifiable variable through two complementary mechanisms.

  The first is natural language processing (NLP). The texts of the resolutions are projected into a high‑dimensional vector space; there, the **semantic distance** between the conflicting signs is measured with standard metrics, such as cosine similarity or Euclidean distance. The closer the vectors in that space, the smaller the objective differentiation and the higher the risk that the examiner will find unfair exploitation. The farther apart, the greater the distinction and the lower the probability the article will be applied.

  The second is the standardization of predictor variables. Phonetic, graphic, and conceptual similarities are coded on continuous, comparable scales; that standardization allows the model to learn decision thresholds that do not depend on the subjective qualification of a human analyst. Differentiation ceases to be an impression and becomes a **measured distance** that, together with the other variables, feeds the prediction.

  ## Bayesian hierarchical model: structure and updating

  The core of SpinLoyalty is a Bayesian logistic regression with hierarchical effects. Its specification mirrors the structure of the problem: an examiner effect that captures and calibrates heterogeneity, fixed effects for the case variables, and a linear predictor that combines them into a probability updated with each new resolution.

  The model doesn't just estimate static coefficients. When a new resolution is issued, the posterior updates automatically. If an examiner begins to modify their criteria, the model detects the shift and adjusts the estimate accordingly. The predictions are not frozen: they evolve with the data, just as Andrew Gelman describes: **"Bayesian inference is the process of fitting a probability model to data and summarizing the result by a probability distribution on the parameters of the model."**

  The result is a probability that can be read by a lawyer without statistical training: "There is an 82% probability that the SIC will consider this sign to be unfairly exploiting the reputation of the opposing mark." The numbers speak the same language as the problem; they require no translation.

  *"Bayesian inference is no more than counting the numbers of ways things could happen, according to our assumptions."* — Richard McElreath, *Statistical Rethinking* (2020)

  *"Bayesian inference is the process of fitting a probability model to data and summarizing the result by a probability distribution on the parameters of the model."* — Andrew Gelman, *Bayesian Data Analysis* (2013)
---

## La incertidumbre jurídica como objeto de medición

La aplicación del artículo 137 de la Decisión 486 de la CAN, que sanciona el registro de signos que aprovechen indebidamente la reputación ajena, depende en la práctica de la apreciación subjetiva del examinador. Dos especialistas pueden evaluar el mismo caso y llegar a conclusiones opuestas; esa variabilidad es inherente al sistema, pero no por ello debe permanecer incontrolada.

La estadística ofrece una ruta alternativa: convertir la apreciación en **medida**. En lugar de preguntarse si un signo es o no confundible, SpinLoyalty cuantifica la probabilidad de que la Superintendencia de Industria y Comercio (SIC) aplique el artículo, basándose en patrones históricos, en la semántica de los textos y en la calibración objetiva de las diferencias entre examinadores.

Esa distinción la entendí en carne propia cuando, en la distribuidora, recibí una oposición marcaria sin previo aviso. El abogado me explicaba el riesgo con palabras «se parece», «el examinador es estricto» mientras yo necesitaba desesperadamente un número. Esa necesidad de un número, de una probabilidad que pudiera sopesar contra el costo de litigar o conciliar, fue la que dio origen a SpinLoyalty.

---

## Juicios basados en medidas, no en impresiones

El enfoque tradicional se apoya en la experiencia acumulada; el enfoque estadístico se apoya en **datos etiquetados y en distribuciones de probabilidad**. Cada resolución de la SIC contiene una decisión binaria (aplica o no aplica el artículo 137) y un conjunto de características observables: clase de Niza, tipo de signo, similitud fonética, similitud gráfica, grado de notoriedad de la marca opuesta, examinador y año de emisión.

El modelo transforma esas características en un predictor lineal y, mediante una regresión logística bayesiana, produce una **distribución posterior** sobre la probabilidad de éxito. Esa distribución no es un número aislado; es un juicio con respaldo empírico. Decir que la probabilidad de que la SIC aplique el artículo es del 73 % es una afirmación muy distinta a decir que «es probable que lo aplique». La primera es una medida; la segunda, una intuición.

Como bien lo resume Richard McElreath, **«la inferencia bayesiana no es más que contar el número de formas en que las cosas pueden ocurrir, de acuerdo con nuestros supuestos»**. SpinLoyalty cuenta esas formas usando el propio historial de la SIC como verdad de campo.

---

## Calibración objetiva de discrepancias entre examinadores

Uno de los problemas estructurales del sistema es la heterogeneidad de criterios. Un examinador puede ser sistemáticamente más riguroso que otro; esa diferencia introduce ruido en cualquier evaluación basada únicamente en precedentes.

El modelo jerárquico resuelve este problema mediante **contracción parcial (shrinkage)**. Cada examinador tiene un efecto aleatorio que se estima a partir de sus decisiones pasadas; sin embargo, ese efecto no se toma al pie de la letra, sino que se encoge hacia la media global. El grado de contracción depende de la cantidad de decisiones que haya emitido el examinador y de la variabilidad general del sistema.

Este mecanismo calibra las discrepancias de manera objetiva. Un examinador con pocas resoluciones se aproxima al comportamiento promedio; un examinador con un historial extenso y consistente puede desviarse más de la media, pero siempre dentro de un intervalo de credibilidad que cuantifica la incertidumbre de esa estimación. Así, la evaluación de un caso no depende de la suerte de topar con un examinador laxo o severo; depende de la evidencia acumulada y de la calibración estadística que la pondera.

---

## Distinción estandarizada: medir la diferenciación entre signos

El concepto de «diferenciación» entre signos es central en el derecho marcario, pero suele operar como una noción difusa. SpinLoyalty la convierte en una variable cuantificable mediante dos mecanismos complementarios.

El primero es el procesamiento de lenguaje natural (NLP). Los textos de las resoluciones se proyectan en un espacio vectorial de alta dimensión; allí, la **distancia semántica** entre los signos en conflicto se mide con métricas estándar, como la similitud del coseno o la distancia euclidiana. Cuanto más cercanos son los vectores en ese espacio, menor es la diferenciación objetiva y mayor el riesgo de que el examinador aprecie un aprovechamiento indebido. Cuanto más separados, mayor la distinción y menor la probabilidad de aplicación del artículo.

El segundo es la estandarización de las variables predictoras. Las similitudes fonéticas, gráficas y conceptuales se codifican en escalas continuas y comparables; esa estandarización permite que el modelo aprenda umbrales de decisión que no dependen de la calificación subjetiva de un analista humano. La diferenciación deja de ser una impresión y se convierte en una **distancia medida** que, junto con las demás variables, alimenta la predicción.

---

## Modelo bayesiano jerárquico: estructura y actualización

El núcleo de SpinLoyalty es una regresión logística bayesiana con efectos jerárquicos. Su especificación responde a la estructura del problema: un efecto por examinador que captura y calibra la heterogeneidad, efectos fijos para las variables del caso, y un predictor lineal que los combina en una probabilidad que se actualiza con cada nueva resolución.

El modelo no estima coeficientes estáticos. Cuando se emite una nueva resolución, la posterior se actualiza de forma automática. Si un examinador empieza a modificar su criterio, el modelo detecta el cambio y ajusta la estimación. Las predicciones no están congeladas: evolucionan con los datos, como lo describe Andrew Gelman: **«La inferencia bayesiana es el proceso de ajustar un modelo de probabilidad a los datos y resumir el resultado mediante una distribución de probabilidad sobre los parámetros del modelo»**.

El resultado es una probabilidad que puede leer un abogado sin formación estadística: «Hay un 82 % de probabilidad de que la SIC considere que este signo aprovecha indebidamente la reputación de la marca opositora». Los números hablan el mismo idioma que el problema; no requieren traducción.

*«La inferencia bayesiana es el proceso de ajustar un modelo de probabilidad a los datos y resumir el resultado mediante una distribución de probabilidad sobre los parámetros del modelo.»* - Andrew Gelman, *Bayesian Data Analysis* (2013)