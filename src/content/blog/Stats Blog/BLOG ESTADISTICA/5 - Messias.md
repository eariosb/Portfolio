---
title: "Messias: predicción bayesiana de fútbol con tres modelos que se hablan entre sí"
titleEn: "Messias: Bayesian Football Prediction with Three Models That Talk to Each Other"
date: "2025-01-20"
tags: ["Bayesiano", "Stan", "brms", "Fútbol", "footBayes"]
excerpt: "La clave de Messias no es usar un único modelo de predicción, sino combinar tres modelos bayesianos especializados: Doble Poisson para goles, Bradley-Terry-Davidson para resultados, y Binomial Negativa Jerárquica para córneres. Te cuento la arquitectura y las decisiones estadísticas."
excerptEn: "The key to Messias is not a single prediction model, but the combination of three specialized Bayesian models: Double Poisson for goals, Bradley-Terry-Davidson for match results, and Hierarchical Negative Binomial for corners. Here is the architecture and the statistical reasoning behind it."
readingTime: 12
bodyEn: |
  ## Why three models and not one
  When I started designing Messias, the temptation was obvious: one big model that predicted everything. Statistical reality is more complicated than that.
  Goals, 1X2 results, and corners each have different probabilistic natures. Treating them with the same model forces compromises that degrade precision across the board.
  The solution: **three specialized models** that share information only where it makes sense. This modularity isn't an aesthetic choice — it's a statistical necessity.
  I learned this lesson the hard way long before I knew what a conjugate prior was. Back when I ran the distribution business, I made the mistake of building a single spreadsheet to forecast everything: daily sales, inventory restocking, and even supplier payment dates. The model broke apart the first month because the assumptions that worked for sales volatility collapsed when applied to payment behavior. Goals and corners, I later understood, are no different: they obey distinct random processes, and forcing them into one box is asking for trouble.
  ## Model 1: Bayesian Double Poisson for goals
  The main model uses the Double Poisson distribution, a standard in the academic literature since Dixon and Coles (1997), implemented through `footBayes::stan_foot`.
  What makes it Bayesian — and superior — is that team attack and defense strengths are treated as **latent variables updated match by match**. A team on a hot streak is captured automatically; a sudden collapse is incorporated without manual intervention.
  ```r
  library(footBayes)
  model_goals <- stan_foot(
    data = matches_data,
    model = "double_pois",
    dynamic_type = "seasonal"
  )
	```

The key diagnostics: **R-hat < 1.01** guarantees convergence of the MCMC chains. **ESS > 400** ensures precision in parameter estimation. Without these checks, the model is a black box no better than a coin flip dressed in formulas.

## Model 2: Bradley-Terry-Davidson for 1X2 results

This model solves a problem that goal-based models handle poorly: **the probability of a draw**.

The Bradley-Terry model compares teams in pairwise fashion. The Davidson extension adds a specific parameter for draws, capturing the fact that ties are not merely "neither wins nor loses" — they are events with their own dynamic, often underestimated by Poisson variants.

```r
model_result <- btd_foot(
  data = matches_data,
  predict = upcoming_matches
)
```
## Model 3: Hierarchical Negative Binomial for corners

Corners are more frequent than goals and exhibit **overdispersion** — their variance exceeds the mean, violating the standard Poisson assumption.

The Negative Binomial captures this overdispersion. The model is hierarchical (implemented with `brms`) because it recognizes systematic differences across leagues and between teams:

```r

library(brms)
model_corners <- brm(
  corners ~ (1 | league) + (1 | team_home) + (1 | team_away),
  family = negbinomial(),
  data = corners_data,
  chains = 4, iter = 2000
)
```

This partial pooling is one of the quiet strengths of Bayesian hierarchical modeling: teams with fewer observed matches borrow information from the league‑wide distribution, stabilizing their estimates without drowning individual variability. It's a principle that applies well beyond football — from clinical trials with small sample sizes to marketing campaigns in niche markets.

## Weekly automated ETL

The three models are fed with data updated weekly from FBref (results + xG), Understat (game quality data), and Fotmob (real time).

The ETL pipeline extracts, normalizes, cross‑references, and loads into PostgreSQL every Monday. The models retrain in the background — computationally heavy, but invisible to the user. The system doesn't ask for attention; it just delivers updated probabilities on schedule.

## The transparency metric: calibration

The acid test of any predictive model is its **calibration**: when the model says 70%, does the event happen 70% of the time?

Messias' calibration plot compares predicted probabilities against observed frequencies. A perfectly calibrated model traces a flawless diagonal. That transparency is what separates a serious statistical system from a generator of appearances — because in the world of predictions, looking smart means nothing if the numbers don't hold.

As Gneiting and Raftery put it in their seminal paper on forecast evaluation, **"The goal of probabilistic forecasting is to maximize the sharpness of the predictive distributions subject to calibration."** Calibration is the non‑negotiable foundation. Sharpness — how tightly the model concentrates its predictions around the truth — is the reward for getting that foundation right.

_"The goal of probabilistic forecasting is to maximize the sharpness of the predictive distributions subject to calibration."_ — Gneiting, T. & Raftery, A. E. (2007), _Strictly Proper Scoring Rules, Prediction, and Estimation_, Journal of the American Statistical Association.

---

## Por qué tres modelos y no uno

Cuando empecé a diseñar Messias, la tentación era clara: un solo modelo grande que predijera todo. La realidad estadística es más compleja que eso.

Los goles, los resultados 1X2 y los córneres tienen naturalezas probabilísticas diferentes. Tratarlos con el mismo modelo implica hacer concesiones que degradan la precisión en cada uno. La solución: **tres modelos especializados** que comparten información solo donde tiene sentido. Esta modularidad no es una elección estética, es una necesidad estadística.

Aprendí esa lección por las malas mucho antes de saber qué era una prior conjugada. En el negocio de distribución, tuve la mala idea de construir una sola hoja de cálculo para pronosticarlo todo: las ventas diarias, el inventario para reabastecer y hasta las fechas de pago a proveedores. El modelo reventó al primer mes porque los supuestos que servían para la volatilidad de las ventas se caían cuando los aplicaba al comportamiento de pago. Con los goles y los córneres pasa lo mismo: obedecen a procesos aleatorios distintos, y meterlos a la fuerza en la misma caja es pedirle problemas al resultado.

## Modelo 1: Doble Poisson Bayesiano para goles

El modelo principal usa la distribución Doble Poisson, estándar en la literatura académica desde Dixon y Coles (1997), implementada con `footBayes::stan_foot`.

Lo que lo hace bayesiano —y superior— es que las fuerzas de ataque y defensa de los equipos son **variables latentes que se actualizan partido a partido**. Un equipo en racha lo detecta automáticamente; un desplome repentino se incorpora sin intervención manual.

```r
library(footBayes)
model_goals <- stan_foot(
  data = matches_data,
  model = "double_pois",
  dynamic_type = "seasonal"
)
```

El diagnóstico clave: **R-hat < 1.01** garantiza convergencia de las cadenas MCMC. **ESS > 400** asegura precisión en la estimación de parámetros. Sin esos chequeos, el modelo es una caja negra que no vale más que una moneda al aire disfrazada de fórmula.

## Modelo 2: Bradley-Terry-Davidson para resultados 1X2

Este modelo resuelve un problema que los modelos de goles no manejan bien: **la probabilidad de empate**.

El modelo Bradley-Terry compara equipos por pares. La extensión Davidson añade un parámetro específico para empates, capturando que no son simplemente «ni gana ni pierde» —son eventos con su propia dinámica, a menudo subestimados por las variantes Poisson.

```r
model_result <- btd_foot(
  data = matches_data,
  predict = upcoming_matches
)
```

## Modelo 3: Binomial Negativa Jerárquica para córneres

Los córneres son más frecuentes que los goles y tienen **sobredispersión**: su varianza es mayor que la media, lo que viola el supuesto de la Poisson estándar.

La Binomial Negativa captura esta sobredispersión. El modelo es jerárquico (implementado con `brms`) porque entiende que hay diferencias sistemáticas entre ligas y entre equipos:

```r

library(brms)
model_corners <- brm(
  corners ~ (1 | league) + (1 | team_home) + (1 | team_away),
  family = negbinomial(),
  data = corners_data,
  chains = 4, iter = 2000
)
```

Este pooling parcial es una de las fortalezas silenciosas del modelado jerárquico bayesiano: los equipos con pocos partidos observados toman información prestada de la distribución general de la liga, estabilizando sus estimaciones sin ahogar la variabilidad individual. Es un principio que aplica mucho más allá del fútbol: desde ensayos clínicos con muestras pequeñas hasta campañas de marketing en mercados de nicho.

## ETL automático semanal

Los tres modelos se alimentan de datos actualizados semanalmente desde FBref (resultados + xG), Understat (datos de calidad de juego) y Fotmob (tiempo real).

El pipeline ETL extrae, normaliza, cruza y carga en PostgreSQL cada lunes. Los modelos se reentrenan en background, computacionalmente pesado, pero invisible para el usuario. El sistema no pide atención: solo entrega probabilidades actualizadas a tiempo.

## La métrica de transparencia: calibración

La prueba de fuego de cualquier modelo predictivo es su **calibración**: cuando el modelo dice 70%, ¿ocurre el 70% de las veces?

El gráfico de calibración de Messias compara probabilidades predichas con frecuencias observadas. Un modelo perfectamente calibrado muestra una diagonal perfecta. Esa transparencia es lo que diferencia un sistema estadístico serio de un generador de apariencias: en el mundo de las predicciones, parecer inteligente no sirve de nada si los números no aguantan.

Como escribieron Gneiting y Raftery en su artículo fundamental sobre evaluación de pronósticos, **«el objetivo de la predicción probabilística es maximizar la agudeza de las distribuciones predictivas sujeto a calibración»**. La calibración es el piso no negociable. La agudeza —qué tan concentradas son las predicciones alrededor de la verdad— es la recompensa por haber construido bien ese piso.

_«El objetivo de la predicción probabilística es maximizar la agudeza de las distribuciones predictivas sujeto a calibración.»_ — Gneiting, T. & Raftery, A. E. (2007), _Strictly Proper Scoring Rules, Prediction, and Estimation_, Journal of the American Statistical Association.