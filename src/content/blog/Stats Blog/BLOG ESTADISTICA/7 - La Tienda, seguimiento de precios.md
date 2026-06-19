---
title: "La Tienda: inteligencia de precios mayoristas con actualización bayesiana y enfoque temporal"
titleEn: "La Tienda: Wholesale Price Intelligence with Bayesian Updating and Temporal Focus"
date: "2024-09-20"
tags: ["Bayesiano", "R", "Shiny", "Precios", "STL", "Mann-Kendall"]
excerpt: "El comerciante minorista necesita decidir hoy cuánto comprar y a qué precio, pero la clave está en lo que ocurrirá en los próximos días. La Tienda combina actualización bayesiana, descomposición estacional y detección de tendencias para anticipar movimientos, ajustar inventarios y evitar sobrecostos por decisiones tardías."
excerptEn: "The retail merchant needs to decide today how much to buy and at what price, but the key lies in what will happen in the coming days. La Tienda combines Bayesian updating, seasonal decomposition and trend detection to anticipate movements, adjust inventories and avoid cost overruns from late decisions."
readingTime: 9
bodyEn: |
  ## The daily challenge of the retail merchant

  The merchant who stocks up at the Medellín Wholesale Market faces a recurring question every morning: do I buy 100 kilos of tomatoes today at $2,500 a kilo or wait until Thursday?

  The answer doesn't depend only on the current price. It depends on what that price implies about the next few days' behavior. A price drop could be the start of a sustained trend or just a one‑time adjustment that will reverse tomorrow. A rise could signal seasonal scarcity or be a transitory spike.

  Statistics provides a framework to answer that question with sound reasoning. It's not about guessing the future, but about measuring uncertainty and recognizing the temporal patterns that underlie price fluctuations.

  I learned this the hard way during my years running a food distribution business. Every morning at the market, the chatter among merchants was the same mix of intuition and rumor: "tomatoes will go up because it rained in the valley," "oil will drop because the harvest is early." Some of that folklore was right, some was wrong, and none of it was reproducible. When I started tracking prices with a notebook, I realized that beneath the daily noise there were rhythms: the monthly spike in beans, the December climb in cooking oil, the March collapse in avocados. That notebook was the seed of La Tienda — a statistical tool that turns the merchant's gut feeling into a measured probability.

  ## The conjugate Normal‑Normal model: real‑time updating

  The statistical core of La Tienda is sequential Bayesian updating via the conjugate Normal‑Normal model. This approach assumes that the "true" price \( \theta \) follows a normal distribution with known variance, and that each new observation updates that belief directly.

  The posterior mean and variance are calculated as:

  $$
  \mu_n = \frac{\mu_0 / \sigma_0^2 + \bar{y} \cdot n / \sigma^2}{1 / \sigma_0^2 + n / \sigma^2}
  $$

  $$
  \sigma_n^2 = \frac{1}{1 / \sigma_0^2 + n / \sigma^2}
  $$

  The advantage of this conjugate model is its computational efficiency. Each new data point obtained through daily scraping updates the posterior distribution without re‑fitting the whole model from scratch. The merchant gets, in real time, an estimate of the current price and a credibility interval that quantifies the uncertainty of that estimate.

  As Andrew Gelman points out, **"Bayesian inference is the process of fitting a probability model to data and summarizing the result by a probability distribution on the parameters of the model."** That probability distribution — updated every morning — is what the merchant holds in his hands to decide, not a crystal ball but a quantified map of possibilities.

  ## Integrated data sources

  The system brings together four public sources that, combined, offer a panoramic view of the Colombian wholesale market:

  - **Wholesale Market of Antioquia**: daily prices for more than 100 products, with a continuous historical record.
  - **DANE‑SIPSA**: wholesale prices at the national level, allowing comparison of regional behavior against the aggregate.
  - **Banco de la República**: Consumer Price Index (CPI) with base 2018, accessible via a public JSON API, to adjust for inflation and purchasing power.
  - **WFP / HDX**: historical series since 2010 for more than 20 staple products, providing long‑term context.

  Integrating these sources is not trivial; it requires cleaning, normalizing and temporally aligning the data. However, the result is a consistent database that feeds the system's three analytical components.

  ## The temporal horizon: what will happen in the coming days

  Knowing today's price is useful, but the purchasing decision looks forward. If tomatoes tend to rise on Thursdays due to higher demand from restaurants, buying on Wednesday is rational. If oil usually drops in February after the harvest, anticipating that decline avoids overpaying.

  La Tienda addresses this temporal dimension through two complementary techniques that, together with Bayesian updating, offer a short‑ and medium‑term view.

  ## STL decomposition: seasonality for inventory management

  STL decomposition (Seasonal‑Trend decomposition using Loess) separates the price series into three components: trend, seasonality, and remainder. This separation makes it possible to quantify behaviors that would otherwise remain hidden in daily fluctuation.

  - **Trend**: the general direction of the price over recent months. A sustained upward trend suggests the merchant should consider larger volume purchases to lock in the price before it rises further.
  - **Seasonality**: recurrent cycles associated with times of the year, harvests, holidays, or commercial seasons. For example, the price of oil increases an average of 12% in December due to higher demand; avocado drops in March as the main harvest enters. Knowing these windows allows inventory scheduling in advance, avoiding shortages during price peaks and overbuying during announced drops.
  - **Remainder**: what's left after extracting trend and seasonality. A large, persistent remainder indicates an unexpected shock — a frost, a transportation strike — which the model detects as an anomalous deviation and flags with a special alert.

  Seasonality is not an academic curiosity; it's an operational tool. Knowing that the price of beans systematically rises in the second week of each month, or that plantain drops during the rainy season, allows the merchant to adjust their purchasing calendar and warehouse space with empirical criteria.

  ## Mann‑Kendall test: early trend detection to avoid overbuying

  Seasonality responds to known patterns; trend captures structural changes. The non‑parametric Mann‑Kendall test detects whether a series exhibits a significant monotonic trend, without requiring assumptions of normality or linearity.

  Its practical utility is clear. If oil has risen for six consecutive weeks, the Mann‑Kendall test signals it well before the merchant perceives it by intuition. That early signal allows adjusting the inventory strategy: if the trend is upward and expected to continue, buy today to avoid a higher price tomorrow. If, on the contrary, the trend is downward, the recommendation is to postpone large purchases and avoid overbuying at prices that are still falling.

  The system doesn't stop at detecting the trend; it estimates its slope and the associated uncertainty. That information translates into an explicit recommendation on the recommended purchase volume for the coming days.

  ## Integrating the components: a unified signal for the decision

  The Bayesian updating provides the current price estimate with its credibility interval. The STL decomposition provides the expected seasonal component for the coming days. The Mann‑Kendall test provides the direction and strength of the underlying trend.

  La Tienda combines these three elements into an opportunity index. When the current price is significantly below the expected value adjusted for trend and seasonality, the system issues a favorable purchase signal. When it is above, it issues a caution signal.

  The merchant doesn't need to interpret the components separately. The interface shows a simple alert, accompanied by the projected time horizon: "The price of tomatoes is 6% below its seasonal average. This condition is expected to hold for the next three days. Consider increasing your purchase to cover the week." That sentence condenses statistics, seasonality and trend into a concrete action.

  ## Inventory and pricing decision: avoiding overbuying and optimizing margins

  The final goal of the analysis is twofold: manage inventory and set retail prices with reasonable margins.

  On the inventory side, the system recommends purchase volumes based on the projected price and uncertainty. If the current price is low and seasonality indicates it will rise in the next ten days, the recommendation is to increase the purchase volume now and reduce daily purchases during the rise. If the current price is high and the trend is downward, the recommendation is to buy only what is necessary for the day and wait for the price to adjust.

  On the retail pricing side, knowing the expected wholesale price allows the merchant to set margins that cover risk. If uncertainty is high (wide credibility interval), the margin must be larger to absorb eventual increases in replacement cost. If uncertainty is low, the margin can be adjusted downward to gain competitiveness without sacrificing profitability.

  Statistics doesn't eliminate market uncertainty; it quantifies it and turns it into input for the decision. The merchant is still the one responsible for buying or not buying, but now they do so with a well‑founded projection of what will happen in the coming days, an estimate of the approaching commercial cycles, and a concrete recommendation to avoid overbuying at high prices or shortages during announced upswings. That is the advantage of turning temporal intuition into a reproducible measure.

  *"The problem with intuition is that it is untestable, unreproducible, and — too often — wrong."* — Rob J. Hyndman & George Athanasopoulos, *Forecasting: Principles and Practice* (3rd edition)

  *"Bayesian inference is the process of fitting a probability model to data and summarizing the result by a probability distribution on the parameters of the model."* — Andrew Gelman, *Bayesian Data Analysis* (2013)
---

## El desafío cotidiano del comerciante minorista

El comerciante que abastece su negocio en la Central Mayorista de Medellín enfrenta una pregunta recurrente cada mañana: ¿compro 100 kilogramos de tomate hoy a $2.500 por kilo o espero al jueves?

La respuesta no depende solo del precio actual. Depende de lo que ese precio implica sobre el comportamiento de los próximos días. Una caída de precio puede ser el inicio de una tendencia prolongada o simplemente un ajuste puntual que se revertirá mañana. Una subida puede anticipar una escasez estacional o ser un pico transitorio.

La estadística proporciona un marco para responder esa pregunta con fundamento. No se trata de adivinar el futuro, sino de medir la incertidumbre y de reconocer los patrones temporales que subyacen a las fluctuaciones de precio.

Aprendí esto por la ruta larga durante mis años en la distribución de bebidas. Cada mañana, en la mayorista, el murmullo entre comerciantes era el mismo: intuición y rumor. «El tomate va a subir porque llovió en el oriente», «el aceite va a bajar porque la zafra vino adelantada». Algo de ese folclor acertaba, otro tanto fallaba, y nada era reproducible. Cuando empecé a registrar precios en un cuaderno, descubrí que debajo del ruido diario había ritmos: el pico mensual del fríjol, la escalada decembrina del aceite, el desplome del aguacate en marzo. Ese cuaderno fue la semilla de La Tienda, una herramienta estadística que convierte el olfato del comerciante en una probabilidad medida.

---

## El modelo conjugado Normal-Normal: actualización en tiempo real

El núcleo estadístico de La Tienda es una actualización bayesiana secuencial mediante el modelo conjugado Normal-Normal. Este enfoque supone que el precio «verdadero» \( \theta \) sigue una distribución normal con varianza conocida, y que cada nueva observación actualiza esa creencia de forma directa.

La media y la varianza posteriores se calculan como:

$$
\mu_n = \frac{\mu_0 / \sigma_0^2 + \bar{y} \cdot n / \sigma^2}{1 / \sigma_0^2 + n / \sigma^2}
$$

$$
\sigma_n^2 = \frac{1}{1 / \sigma_0^2 + n / \sigma^2}
$$

La ventaja de este modelo conjugado es su eficiencia computacional. Cada nuevo dato que se obtiene mediante el scraping diario actualiza la distribución posterior sin necesidad de reajustar todo el modelo desde cero. El comerciante obtiene, en tiempo real, una estimación del precio actual y un intervalo de credibilidad que cuantifica la incertidumbre de esa estimación.

Como señala Andrew Gelman, **«la inferencia bayesiana es el proceso de ajustar un modelo de probabilidad a los datos y resumir el resultado mediante una distribución de probabilidad sobre los parámetros del modelo»**. Esa distribución de probabilidad, actualizada cada mañana, es lo que el comerciante tiene en la mano para decidir. No es una bola de cristal, pero sí un mapa cuantificado de posibilidades.

---

## Fuentes de datos integradas

El sistema aglutina cuatro fuentes públicas que, combinadas, ofrecen una visión panorámica del mercado mayorista colombiano:

- **Central Mayorista de Antioquia**: precios diarios de más de 100 productos, con registro histórico continuo.
- **DANE-SIPSA**: precios mayoristas a nivel nacional, que permiten comparar el comportamiento regional frente al agregado.
- **Banco de la República**: índice de precios al consumidor (IPC) con base 2018, accesible mediante API JSON pública, para ajustar por inflación y poder adquisitivo.
- **WFP / HDX**: series históricas desde 2010 para más de 20 productos básicos, que proporcionan contexto de largo plazo.

La integración de estas fuentes no es trivial; requiere limpieza, normalización y alineación temporal. Sin embargo, el resultado es una base de datos consistente que alimenta los tres componentes analíticos del sistema.

---

## El horizonte temporal: lo que ocurrirá en los próximos días

Conocer el precio de hoy es útil, pero la decisión de compra mira hacia adelante. Si el tomate tiende a subir los jueves por mayor demanda de los restaurantes, comprar el miércoles es racional. Si el aceite suele bajar en febrero por el fin de la zafra, anticiparse a esa caída evita sobrecostos.

La Tienda aborda esta dimensión temporal mediante dos técnicas complementarias que, junto con la actualización bayesiana, ofrecen una visión de corto y mediano plazo.

---

## Descomposición STL: estacionalidad para la gestión de inventario

La descomposición STL (Seasonal-Trend decomposition using Loess) separa la serie de precios en tres componentes: tendencia, estacionalidad y residuo. Esta separación permite cuantificar comportamientos que, de otro modo, permanecerían ocultos en la fluctuación diaria.

- **Tendencia**: la dirección general del precio en los últimos meses. Una tendencia alcista sostenida sugiere que el comerciante debería considerar compras de mayor volumen para fijar precio antes de que siga subiendo.
- **Estacionalidad**: los ciclos recurrentes asociados a épocas del año, cosechas, festividades o temporadas comerciales. Por ejemplo, el precio del aceite aumenta en promedio un 12 % en diciembre por el incremento de la demanda; el del aguacate baja en marzo por la entrada de la cosecha principal. Conocer estas ventanas permite programar el inventario con antelación, evitando la escasez en los picos de precio y la sobrecompra en las caídas anunciadas.
- **Residuo**: lo que queda después de extraer tendencia y estacionalidad. Un residuo grande y persistente indica un shock inesperado —una helada, un paro de transporte— que el modelo detecta como una desviación anómala y genera una alerta especial.

La estacionalidad no es una curiosidad académica; es una herramienta operativa. Saber que el precio del fríjol sube sistemáticamente en la segunda semana de cada mes, o que el del plátano baja en la temporada de lluvias, permite al comerciante ajustar su calendario de compras y su espacio de bodega con criterio empírico.

---

## Prueba de Mann-Kendall: detección temprana de tendencias para evitar sobrecompra

La estacionalidad responde a patrones conocidos; la tendencia capta cambios estructurales. La prueba no paramétrica de Mann-Kendall detecta si una serie presenta una tendencia monotónica significativa, sin requerir supuestos de normalidad ni linealidad.

Su utilidad práctica es clara. Si el aceite ha subido durante seis semanas consecutivas, la prueba de Mann-Kendall lo señala mucho antes de que el comerciante lo perciba por intuición. Esa señal temprana permite ajustar la estrategia de inventario: si la tendencia es alcista y se espera que continúe, comprar hoy para evitar un precio mayor mañana. Si, por el contrario, la tendencia es bajista, la recomendación es posponer las compras grandes y evitar la sobrecompra a precios que aún están en descenso.

El sistema no se limita a detectar la tendencia; estima su pendiente y la incertidumbre asociada. Esa información se traduce en una recomendación explícita sobre el volumen de compra recomendado para los próximos días.

---

## Integración de los componentes: una señal unificada para la decisión

La actualización bayesiana proporciona la estimación del precio actual con su intervalo de credibilidad. La descomposición STL proporciona el componente estacional esperado para los próximos días. La prueba de Mann-Kendall proporciona la dirección y fuerza de la tendencia subyacente.

La Tienda combina estos tres elementos en un índice de oportunidad. Cuando el precio actual está significativamente por debajo del valor esperado ajustado por tendencia y estacionalidad, el sistema emite una señal de compra favorable. Cuando está por encima, emite una señal de precaución.

El comerciante no necesita interpretar los componentes por separado. La interfaz muestra una alerta simple, acompañada del horizonte temporal proyectado: «El precio del tomate está un 6 % por debajo de su media estacional. Se espera que esta condición se mantenga durante los próximos tres días. Considere aumentar la compra para cubrir la semana». Esa frase condensa la estadística, la estacionalidad y la tendencia en una acción concreta.

---

## Decisión de inventario y precio: evitar la sobrecompra y optimizar márgenes

El objetivo final del análisis es doble: gestionar el inventario y fijar precios de venta al público con márgenes razonables.

En el lado del inventario, el sistema recomienda volúmenes de compra en función del precio proyectado y de la incertidumbre. Si el precio actual es bajo y la estacionalidad indica que subirá en los próximos diez días, la recomendación es aumentar el volumen de compra ahora y reducir las compras diarias durante la subida. Si el precio actual es alto y la tendencia es bajista, la recomendación es comprar solo lo necesario para el día y esperar a que el precio se ajuste.

En el lado de la fijación de precios al público, conocer el precio mayorista esperado permite al comerciante establecer márgenes que cubran el riesgo. Si la incertidumbre es alta (intervalo de credibilidad amplio), el margen debe ser mayor para absorber eventuales aumentos en el costo de reposición. Si la incertidumbre es baja, el margen puede ajustarse a la baja para ganar competitividad sin sacrificar rentabilidad.

La estadística no elimina la incertidumbre del mercado; la cuantifica y la convierte en un insumo para la decisión. El comerciante sigue siendo el responsable de comprar o no comprar, pero ahora lo hace con una proyección fundamentada de lo que ocurrirá en los próximos días, con una estimación de los ciclos comerciales que se aproximan y con una recomendación concreta para evitar la sobrecompra en momentos de precio alto o la escasez en temporadas de alza anunciada. Esa es la ventaja de convertir la intuición temporal en una medida reproducible.

*«El problema con la intuición es que no se puede poner a prueba, no es reproducible y, con demasiada frecuencia, está equivocada.»* - Rob J. Hyndman & George Athanasopoulos, *Forecasting: Principles and Practice* (3.ª edición)

*«La inferencia bayesiana es el proceso de ajustar un modelo de probabilidad a los datos y resumir el resultado mediante una distribución de probabilidad sobre los parámetros del modelo.»* - Andrew Gelman, *Bayesian Data Analysis* (2013)