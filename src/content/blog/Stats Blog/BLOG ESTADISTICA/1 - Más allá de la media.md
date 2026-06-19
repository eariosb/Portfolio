---
title: "Más allá de la media: por qué los extremos son la verdadera señal de alerta en los datos"
titleEn: "Beyond the Mean: Why Extremes Are the Real Early Warning Signal in Data"
date: "2026-06-17"
tags: ["Estadística", "Análisis de datos", "Calidad", "Riesgo", "Outliers"]
excerpt: "La estadística tradicional se centra en la media, pero en la práctica los eventos críticos —fallos, oportunidades, riesgos— ocurren en las colas. Este post explica por qué monitorizar los extremos es tan importante como conocer el promedio, y cómo hacerlo con rigor estadístico."
excerptEn: "Traditional statistics focuses on the mean, but in practice critical events — failures, opportunities, risks — happen in the tails. This post explains why monitoring extremes is as important as knowing the average, and how to do it with statistical rigor."
readingTime: 10
bodyEn: |
  ## An intuition that practice confirms

  Any analyst with experience in operational environments —factories, logistics, retail, finance, healthcare— has felt this: reports full of means and standard deviations don't always capture what really matters. A process can have a great average, yet the real trouble hides in the extreme values — the shipment that arrived three days late, the part that failed after just 100 hours, the customer who generated 80% of the complaints.

  The question is fair: are we wrong to put so much effort into estimating the mean? The answer, as so often in statistics, is nuanced. The mean is a useful tool, but it's incomplete. The extremes —the tails of the distribution— are where the events that trigger alarms, generate losses or open opportunities usually live. And modern statistics has specific methods to deal with them.

  I learned this the hard way long before I knew what a quantile was. Back when I ran the cash register in a restaurant, I ordered avocados every week based on average consumption. The result? Half the weekends we'd run out before the dinner rush. One day I decided to change the rule: instead of the average, I ordered the amount that left us short only on the slowest 15% of days. That number —the 85th percentile— saved us from angry customers without drowning us in overripe fruit.

  That simple shift is the doorway to **quantiles** and **quantile regression**. While classical regression estimates the conditional mean of a variable (say, average demand as a function of the day of the week), quantile regression models any percentile you choose directly. For that restaurant, I could have fitted a model to predict the 85th percentile of avocado demand from variables like:
  - Day of the week (Fridays were busier).
  - Whether there was a special event nearby.
  - The forecast high temperature.

  With that model, each morning I'd get a personalized order quantity that kept the probability of service at 85% — tailored to that day's circumstances. I wasn't blindly buying the same buffer every day; I was buying exactly what I needed to keep the risk of stockout under control, without wasting perishable goods. That's the power of looking at the upper tail, not the mean.

  In essence, quantile regression lets you make decisions based on the risk you're willing to bear — something the mean can never give you.

  ## The mean

  The arithmetic mean is, without a doubt, the most used measure of central tendency. It's simple to calculate, it has optimal mathematical properties under normality, and it sits at the heart of many models (regression, ANOVA, statistical process control). When a process is stable and symmetric, the mean does a good job summarizing typical behavior.

  Yet the mean has two fundamental limitations:
  1. **It says nothing about variability**. Two processes with the same mean can carry very different risks if one has a small standard deviation and the other a large one. The mean can't tell the difference between a tight process and a scattered one.
  2. **It's sensitive to skewness and outliers**. In skewed distributions, the mean may not represent the majority of the data. In the presence of outliers, the mean shifts and can paint a distorted picture of reality.

  That's why statisticians have insisted for decades that the mean should always come with measures of dispersion, the shape of the distribution, and —above all— information about the tails.

  ## The extremes

  In practice, most operational decisions aren't made on the average but on the limits. A few concrete examples:

  - **Quality control**: product specifications define upper and lower limits. A batch can have a perfectly centered mean, but if variability is high, a significant share of units will fall outside spec. That defective fraction is what generates rework costs, returns and reputation loss.
  - **Logistics and supply chain**: average delivery time might be 48 hours, but it's the extreme delays (deliveries at 72 or 96 hours) that anger customers and break planning. Monitoring the 95th or 99th percentile of delivery time is more relevant than the mean for setting service-level agreements.
  - **Finance and risk**: the mean return of a portfolio says nothing about the risk of extreme losses. Value at Risk (VaR) and Expected Shortfall (CVaR) are based on the tails of the loss distribution. Regulators require financial institutions to assess their exposure to extreme scenarios.
  - **Public health**: a population's average blood pressure may be within normal range, but the extreme values (severe hypertension or hypotension) are the ones demanding priority intervention. Tracking extremes helps detect outbreaks or failures in care systems.
  - **Marketing and sales**: the average ticket may be $50, but the top 20% of customers (the upper tail) often generate 80% of the revenue. Identifying and retaining those extreme customers is a key strategy.

  In all these cases, focusing on the mean falls short — or is outright misleading. The valuable information lives in the extremes.

  ## Does statistics ignore extremes? Absolutely not

  A common objection is that traditional statistics has focused almost exclusively on the mean. That's not true. There's an entire body of theory and methods dedicated to the analysis of extremes:

  - **Tolerance intervals**: instead of a confidence interval for the mean, a tolerance interval covers a specific percentage of the population (for example, 95% of future observations will fall within certain bounds). This is far more relevant for operations than an interval for the mean.
  - **Percentiles and quantiles**: these are positional measures that don't depend on the shape of the distribution. The 99th percentile tells you the value below which 99% of the data lies — a direct way to describe the upper tail.
  - **Boxplots**: they show the median, quartiles and outliers. A powerful visual tool to spot extremes instantly.
  - **Extreme value theory (EVT)**: provides specific models for the tails of distributions (generalized extreme value distribution, generalized Pareto distribution). It's used in hydrology, finance, insurance and climatology to estimate the probability of rare but catastrophic events.
  - **Anomaly detection**: statistical and machine learning methods designed to identify observations that deviate significantly from the general pattern. These methods are the backbone of early warning systems in countless sectors.

  So statistics doesn't ignore extremes; it tackles them with purpose-built tools. What happens is that basic training and many routine reports tend to oversimplify with the mean and standard deviation, forgetting that a complete analysis requires looking at the tails as well.

  ## An integrated approach

  The question isn't whether to choose the mean or the extremes, but how to combine both to get a full picture of the process. A rigorous analysis should include:

  1. **Measures of central tendency**: mean, median, mode (where appropriate).
  2. **Measures of dispersion**: standard deviation, interquartile range, coefficient of variation.
  3. **Measures of shape**: skewness and kurtosis, which tell you if the distribution has heavier tails than normal.
  4. **Key percentiles**: especially the 1st, 5th, 95th and 99th, which describe the tails.
  5. **Plots that show the whole distribution**: histograms, densities, boxplots, Q-Q plots.

  With this information, an analyst can assess both typical behavior and the risk of extreme events. And, crucially, they can set up alert systems that fire when the extremes start to deviate from what's expected.

  ## Monitoring extremes as an early warning system

  In day-to-day operations, a good alert system doesn't just watch the mean. It should include:

  - **Control limits for individual observations** (I-MR charts), which detect points outside limits based on the natural variability of the process.
  - **Thresholds based on percentiles**: for instance, if the 95th percentile of delivery time exceeds a predefined threshold, an alert goes off.
  - **Trend detection in the extremes**: not just a single extreme value, but a sequence of values creeping toward the limits.
  - **Root cause analysis**: when an extreme is detected, investigate why it happened and whether it's a one-off event or the symptom of a structural shift.

  Combining mean and extreme monitoring gives you a more robust view and lets you anticipate problems before they become crises.

  ## Practical recommendations for the analyst

  For those working with data in operational settings, I suggest these practices:

  1. **Don't stop at the mean**. Always accompany means with dispersion measures and extreme percentiles.
  2. **Use boxplots** as part of your exploratory analysis. They'll quickly show you if there are outliers and how the data are distributed.
  3. **Set alert thresholds based on experience and statistics**. For example, decide that an observation beyond ±3 standard deviations (or outside the 0.1 and 99.9 percentiles) requires investigation.
  4. **Consider extreme value theory** if your process has heavy tails or the risk of catastrophic events is relevant.
  5. **Communicate results clearly**. Don't overwhelm with tables of numbers; use visualizations that show the complete distribution and point to the extremes intuitively.
---

Cuando manejaba la caja del restaurante, había una regla que me enseñaron sin libros: los promedios mienten. Pedir los tomates según el consumo medio de la semana era la receta perfecta para quedarse corto justo el sábado en la noche. Lo comprobé muchas veces antes de aplicar correctamente el concepto de percentil. La solución fue sencilla: comprar la cantidad que solo me dejara sin tomates el 15 % de los días, y asumir que ese riesgo era aceptable. Esa cifra; el percentil 85, me ayudó a mejorar el servicio, reducir desperidicios, mejorar las ganancias.

Ese gesto tan casero esconde una verdad profunda: **los eventos críticos no viven en la media; viven en las colas.** Cualquier analista que haya pisado una fábrica, una bodega o un piso de ventas lo intuye. Los informes pulcros, llenos de promedios y desviaciones, a veces pasan por alto lo que de verdad quiebra un proceso: el pedido que llegó tres días tarde, la pieza que falló a las cien horas, el cliente que concentró todas las quejas. Mirar solo la media es como manejar viendo únicamente el velocímetro: te dice a qué velocidad vas, pero no vas a ver la curva, ni el precipicio.

---

## Una intuición que la práctica confirma

La estadística no niega esto. Lo que pasa es que en la formación básica y en la urgencia del reporte quincenal se nos olvida. La media es útil, sí, pero es incompleta. Dos procesos pueden tener la misma media y riesgos opuestos si uno es estrecho y el otro disperso. Y cuando hay asimetría o valores atípicos, la media se va detrás de ellos y te cuenta una historia que no le pasó a la mayoría.

Por suerte, existe una caja de herramientas pensada justo para lo otro: para los extremos. Y esa caja empieza con una palabra que casi nunca está en los titulares: **cuantiles**.

---

## La lógica del percentil y la regresión cuantílica

Un percentil no es más que el valor que deja por debajo un determinado porcentaje de los datos. Si vos decidís que te basta con cubrir la demanda de tomates el 85 % de los días, el percentil 85 te da el número exacto para lograrlo. No es magia: es una medida de posición, inmune a la forma de la distribución, que describe directamente la cola que te interesa.

La **regresión cuantílica** lleva esta lógica a otro nivel. Mientras la regresión clásica modela la media condicional (cuántos tomates se venden en promedio según el día de la semana o el clima), la regresión cuantílica te modela directamente el percentil que vos elijas. Para el restaurante, se podría ajustar un modelo que prediga el percentil 85 de la demanda a partir de variables como:

- Día de la semana (los viernes mandan).
- Eventos en la zona.
- Temperatura máxima prevista.

Cada mañana tendrías un número de pedido distinto, afinado a las condiciones de ese día, que mantiene la probabilidad de desabastecimiento clavada en el 15 % que aceptaste. No comprás de más ni de menos: comprás con el riesgo controlado. Eso es mirar la cola superior y no la media.

---

## La media: necesaria pero insuficiente

La media tiene su lugar. Es fácil de calcular, se comporta bien bajo normalidad y es la base de muchos modelos. Pero por sí sola no alcanza. Dos carencias que duelen en el día a día:

1. **No dice nada de cuánto varían los datos.** Sin una medida de dispersión, la media es un punto ciego. El mismo promedio puede esconder un proceso disciplinado o uno salvaje.
2. **Se deja engañar por los valores raros.** Si hay un cliente que una vez pagó diez veces más que todos, la media del ticket se dispara y no representa a nadie. La mediana o los percentiles resisten mejor esos enviones.

Por eso los estadísticos insisten: mostrá la media, pero nunca la dejés sola. Que siempre vaya acompañada de la desviación estándar, del rango intercuartílico y, sobre todo, de lo que ocurre en los extremos.

---

## Los extremos mandan en la operación

En la trinchera, las decisiones cruciales casi nunca se toman sobre el promedio, sino sobre los límites. Unos ejemplos que me tocaron de cerca o que vi en otros:

- **Calidad**: una especificación define un máximo y un mínimo. El lote puede tener una media perfecta, pero si la dispersión es alta, muchas unidades se van fuera de rango y generan retrabajo, devoluciones, mala fama.
- **Logística**: el tiempo medio de entrega puede ser 48 horas, pero lo que el cliente recuerda es el pedido que demoró cuatro días. El percentil 95 del tiempo de entrega es mucho más honesto que la media para fijar acuerdos de servicio.
- **Riesgo financiero**: la media de los rendimientos no habla del día negro. El VaR y el Expected Shortfall se alimentan de las colas, no del centro.
- **Salud**: la presión arterial media de la población puede estar bien, pero los hipertensos severos están en la cola y son ellos los que congestionan urgencias. Monitorear extremos permite activar protocolos antes de que el sistema colapse.
- **Ventas**: el ticket medio son 50 mil pesos, pero el 20 % de los clientes, los de la cola alta, pueden generar el 80 % de la facturación. Cuidarlos es una estrategia que se lee en los cuantiles, no en los promedios.

En todos estos casos, el foco en la media insulta la complejidad del problema. La información que vale está en los extremos.

---

## ¿La estadística ignora los extremos? Rotundamente no

Una queja recurrente es que la estadística solo mira el centro. Pero eso es desconocer la caja de herramientas. Existen métodos específicos, sólidos y viejos, para los extremos:

- **Intervalos de tolerancia**: en vez de un intervalo de confianza para la media, te dicen que el 95 % de las observaciones futuras estará dentro de ciertos límites. Eso es hablar el idioma de la operación.
- **Percentiles y cuantiles**: directos, sin supuestos de normalidad, ideales para describir colas.
- **Gráficos de caja y bigotes**: con un vistazo ves la mediana, los cuartiles, los valores atípicos. Son brújula visual de exploración.
- **Teoría de valores extremos**: modelos para las colas pesadas, usados en hidrología, seguros, finanzas, climatología. Para cuando lo improbable puede ser devastador.
- **Detección de anomalías**: todo un campo estadístico y de machine learning dedicado a encontrar lo que se sale del patrón. La base de cualquier sistema de alerta temprana.

La estadística no está ciega a los extremos; somos nosotros los que a veces nos quedamos con el resumen más cómodo. Abrir la caja de herramientas es una decisión profesional, no un capricho técnico.

---

## Un enfoque integrado: mirar el centro y las orillas a la vez

No se trata de abandonar la media, sino de rodearla bien. Un análisis riguroso debería incluir, como mínimo:

1. **Tendencia central**: media, mediana.
2. **Dispersión**: desviación estándar, rango intercuartílico, coeficiente de variación.
3. **Forma**: asimetría y curtosis, que avisan si las colas pesan más de lo normal.
4. **Percentiles clave**: 1, 5, 95 y 99 como ventanas a los extremos.
5. **Visualización de la distribución completa**: histogramas, densidades, boxplots, Q-Q plots.

Con esa mirada completa, podés entender el comportamiento típico y el riesgo de los eventos raros. Y podés, sobre todo, construir alertas que se disparen cuando las colas empiezan a moverse.

---

## Alertas tempranas desde los extremos

Un sistema de monitoreo que solo vigila la media es como un guardia que solo mira el frente de la puerta. Para detectar problemas antes de que estallen, hay que vigilar los extremos con estas prácticas:

- **Límites de control para observaciones individuales** (gráficos I-MR), que atrapan puntos fuera de la variabilidad natural.
- **Umbrales basados en percentiles**: si el percentil 95 del tiempo de respuesta supera un tope acordado, se investiga.
- **Tendencias en los extremos**: no solo un valor raro, sino una secuencia que se acerca peligrosamente a los límites.
- **Análisis de causas**: cuando aparece un extremo, preguntarse si fue un accidente aislado o el síntoma de un cambio estructural.

La combinación de monitoreo del centro y de las orillas te da un radar más sensible y te anticipa a las crisis.

---

## Recomendaciones para quien trabaja con datos

Si estás en una mesa de análisis, en una planta o en un tablero de control, estas cinco prácticas te van a ayudar:

1. **No publiques una media sin su desviación y sin al menos un percentil extremo.** Desconfiá de quien lo hace.
2. **Usá boxplots** en tu exploración inicial: te muestran en un segundo dónde están los puntos raros.
3. **Definí umbrales de alerta con criterio**: ±3 desviaciones estándar o percentiles 0.1 y 99.9, según lo que sea relevante en tu contexto.
4. **Si tu proceso tiene colas pesadas o el riesgo catastrófico es real**, explorá la teoría de valores extremos. No le tengás miedo al nombre.
5. **Comunicá con imágenes, no con tablas interminables.** Un gráfico que señale los extremos cuenta la historia más importante en un solo golpe de vista.

Los promedios describen; los extremos informan. Y en este oficio, informar es proteger el negocio, el proceso y a la gente que depende de ellos. La próxima vez que alguien te diga que todo está bajo control porque la media va bien, acordate de los tomates del sábado en la noche.