export interface CourseModule {
  id: string;
  title: { es: string; en: string };
  duration: string;
  topics: { es: string[]; en: string[] };
}

export interface Course {
  id: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  level: "basic" | "intermediate" | "advanced";
  duration: string;
  modules: CourseModule[];
  tags: string[];
  url?: string;
  image: string;
}

export const courses: Course[] = [
  {
    id: "legaltech-colombia",
    title: {
      es: "Transformación Digital Legal en Colombia: LegalTech, IA y Nuevos Retos Jurídicos",
      en: "Legal Digital Transformation in Colombia: LegalTech, AI and New Legal Challenges",
    },
    description: {
      es: "Curso completo sobre la transformación digital del sector jurídico colombiano. Descubre cómo las leyes clave, la inteligencia artificial, el blockchain y la jurimetría abren nuevas oportunidades para abogados, desarrolladores y emprendedores LegalTech. Aprende a identificar marcos normativos, aplicar tecnologías emergentes y crear soluciones que cumplen con la regulación colombiana.",
      en: "Comprehensive course on the digital transformation of the Colombian legal sector. Discover how key laws, artificial intelligence, blockchain and jurimetrics open new opportunities for lawyers, developers and LegalTech entrepreneurs. Learn to identify regulatory frameworks, apply emerging technologies and create solutions compliant with Colombian regulations.",
    },
    level: "intermediate",
    duration: "20h",
    image: "/images/courses/legaltech.svg",
    tags: ["LegalTech", "IA", "Colombia", "Blockchain", "Jurimetría", "Habeas Data"],
    url: "https://legaltech-colombia.vercel.app/",
    modules: [
      {
        id: "m1",
        title: { es: "Panorama LegalTech en Colombia: Contexto y Fundamentos", en: "LegalTech Landscape in Colombia: Context and Fundamentals" },
        duration: "2h",
        topics: {
          es: ["Ecosistema LegalTech colombiano", "Principales actores y startups", "Tendencias globales y su impacto local", "Oportunidades de mercado"],
          en: ["Colombian LegalTech ecosystem", "Key players and startups", "Global trends and local impact", "Market opportunities"],
        },
      },
      {
        id: "m2",
        title: { es: "Marcos Normativos Clave para LegalTech en Colombia", en: "Key Regulatory Frameworks for LegalTech in Colombia" },
        duration: "2h",
        topics: {
          es: ["Ley 527 de 1999 (comercio electrónico)", "Ley 1581 (protección de datos)", "Decreto 806/2020 (justicia digital)", "Regulación de firmas electrónicas"],
          en: ["Law 527/1999 (e-commerce)", "Law 1581 (data protection)", "Decree 806/2020 (digital justice)", "Electronic signature regulation"],
        },
      },
      {
        id: "m3",
        title: { es: "Jurimetría y Auditoría Algorítmica: Estadística en Decisiones Jurídicas", en: "Jurimetrics and Algorithmic Auditing: Statistics in Legal Decisions" },
        duration: "2.5h",
        topics: {
          es: ["Jurimetría: predicción de sentencias", "Modelos estadísticos en el derecho", "Auditoría de algoritmos judiciales", "Sesgos en sistemas de IA jurídica"],
          en: ["Jurimetrics: verdict prediction", "Statistical models in law", "Judicial algorithm auditing", "Bias in legal AI systems"],
        },
      },
      {
        id: "m4",
        title: { es: "Identidad Digital, KYC y Autenticación en el Sector Legal", en: "Digital Identity, KYC and Authentication in the Legal Sector" },
        duration: "2h",
        topics: {
          es: ["KYC digital y debida diligencia", "Autenticación biométrica", "Firma electrónica vs. digital", "eIDAS y estándares colombianos"],
          en: ["Digital KYC and due diligence", "Biometric authentication", "Electronic vs. digital signature", "eIDAS and Colombian standards"],
        },
      },
      {
        id: "m5",
        title: { es: "Cibercrimen y Prueba Digital: Seguridad Jurídica en la Era Digital", en: "Cybercrime and Digital Evidence: Legal Security in the Digital Age" },
        duration: "2h",
        topics: {
          es: ["Tipos de delitos informáticos (Ley 1273)", "Cadena de custodia digital", "Peritaje forense digital", "Prueba digital ante la SIC y juzgados"],
          en: ["Types of cybercrimes (Law 1273)", "Digital chain of custody", "Digital forensic expertise", "Digital evidence before courts"],
        },
      },
      {
        id: "m6",
        title: { es: "Inteligencia Artificial Aplicada al Derecho: Métodos y Ética", en: "AI Applied to Law: Methods and Ethics" },
        duration: "2.5h",
        topics: {
          es: ["NLP para análisis de contratos", "Predicción de sentencias con ML", "Ética y responsabilidad algorítmica", "Regulación de IA en Colombia"],
          en: ["NLP for contract analysis", "Verdict prediction with ML", "Ethics and algorithmic accountability", "AI regulation in Colombia"],
        },
      },
      {
        id: "m7",
        title: { es: "Blockchain, Smart Contracts y Nuevos Derechos Digitales", en: "Blockchain, Smart Contracts and New Digital Rights" },
        duration: "2h",
        topics: {
          es: ["Funcionamiento de blockchain", "Smart contracts: validez jurídica en Colombia", "NFTs y derechos de autor", "DAOs y nuevas formas jurídicas"],
          en: ["How blockchain works", "Smart contracts: legal validity in Colombia", "NFTs and copyright", "DAOs and new legal forms"],
        },
      },
      {
        id: "m8",
        title: { es: "Protección de Marcas, Consumidor Digital y Habeas Data Financiero", en: "Brand Protection, Digital Consumer and Financial Habeas Data" },
        duration: "1.5h",
        topics: {
          es: ["Marcas en el entorno digital", "Derechos del consumidor digital (Estatuto del Consumidor)", "Habeas data financiero y Ley 1266", "GDPR y su influencia en Colombia"],
          en: ["Brands in the digital environment", "Digital consumer rights", "Financial habeas data and Law 1266", "GDPR influence in Colombia"],
        },
      },
      {
        id: "m9",
        title: { es: "Habeas Data y Protección de Datos Personales", en: "Habeas Data and Personal Data Protection" },
        duration: "2h",
        topics: {
          es: ["Ley 1581 de 2012: régimen general de protección de datos", "Ley 1266 de 2008: habeas data financiero", "Decreto 1377 de 2013: reglamentación de la Ley 1581", "Ley 2300, Ley 1712 (transparencia) y Ley 1341 (TIC)", "Decreto 338: actualización del régimen de protección de datos"],
          en: ["Law 1581/2012: general data protection regime", "Law 1266/2008: financial habeas data", "Decree 1377/2013: regulation of Law 1581", "Law 2300, Law 1712 (transparency) and Law 1341 (ICT)", "Decree 338: update to the data protection regime"],
        },
      },
      {
        id: "m10",
        title: { es: "Integración Práctica: Desarrollo de Entregables y Herramientas LegalTech", en: "Practical Integration: LegalTech Tools and Deliverables" },
        duration: "1.5h",
        topics: {
          es: ["Diseño de soluciones LegalTech", "Casos de estudio: contratos inteligentes y cumplimiento normativo", "Hoja de ruta para emprendedores jurídicos", "Proyecto integrador final"],
          en: ["LegalTech solution design", "Case studies: smart contracts and regulatory compliance", "Roadmap for legal entrepreneurs", "Final integrating project"],
        },
      },
    ],
  },
  {
    id: "series-tiempo-timesight",
    title: {
      es: "Análisis de Series de Tiempo con TimeSight",
      en: "Time Series Analysis with TimeSight",
    },
    description: {
      es: "Mini curso práctico de análisis de series temporales usando la plataforma TimeSight. Aprende el flujo completo: exploración, pruebas de estacionariedad, modelado ARIMA/ETS/TBATS, validación cruzada walk-forward y pronóstico con intervalos de credibilidad. Sin necesidad de programar — todo desde la interfaz interactiva.",
      en: "Practical mini-course in time series analysis using the TimeSight platform. Learn the complete workflow: exploration, stationarity tests, ARIMA/ETS/TBATS modeling, walk-forward cross-validation and forecasting with credibility intervals. No programming needed — everything from the interactive interface.",
    },
    level: "intermediate",
    duration: "6h",
    image: "/images/courses/timesight.svg",
    tags: ["Series de Tiempo", "ARIMA", "Pronóstico", "TimeSight", "R"],
    url: "https://rios.shinyapps.io/AnalisisSeriesTiempo/",
    modules: [
      {
        id: "m1",
        title: { es: "Fundamentos y Carga de Datos", en: "Fundamentals and Data Loading" },
        duration: "1h",
        topics: {
          es: ["Conceptos de series de tiempo", "Formatos de datos aceptados", "Manejo de fechas y frecuencias", "Vista previa y transformaciones (log, diff, Box-Cox)"],
          en: ["Time series concepts", "Accepted data formats", "Date and frequency handling", "Preview and transformations (log, diff, Box-Cox)"],
        },
      },
      {
        id: "m2",
        title: { es: "Análisis Exploratorio", en: "Exploratory Analysis" },
        duration: "1.5h",
        topics: {
          es: ["Tests de estacionariedad: ADF, KPSS, Phillips-Perron", "ACF y PACF: interpretación práctica", "Descomposición STL", "Detección de puntos de cambio estructural"],
          en: ["Stationarity tests: ADF, KPSS, Phillips-Perron", "ACF and PACF: practical interpretation", "STL decomposition", "Structural change point detection"],
        },
      },
      {
        id: "m3",
        title: { es: "Modelado: ARIMA, ETS y TBATS", en: "Modeling: ARIMA, ETS and TBATS" },
        duration: "2h",
        topics: {
          es: ["Auto-ARIMA: parámetros p, d, q", "Suavizamiento exponencial (ETS)", "TBATS para múltiples estacionalidades", "Diagnósticos de residuos: Ljung-Box, ARCH"],
          en: ["Auto-ARIMA: p, d, q parameters", "Exponential smoothing (ETS)", "TBATS for multiple seasonalities", "Residuals diagnostics: Ljung-Box, ARCH"],
        },
      },
      {
        id: "m4",
        title: { es: "Validación y Pronóstico", en: "Validation and Forecasting" },
        duration: "1.5h",
        topics: {
          es: ["Walk-forward cross-validation", "Interval Score y métricas de comparación", "Fan charts y rangos de credibilidad", "Exportación de resultados e informes PDF"],
          en: ["Walk-forward cross-validation", "Interval Score and comparison metrics", "Fan charts and credibility ranges", "Results export and PDF reports"],
        },
      },
    ],
  },
  {
    id: "bayesian-aplicado",
    title: {
      es: "Análisis Bayesiano Aplicado en R",
      en: "Applied Bayesian Analysis in R",
    },
    description: {
      es: "Curso aplicado de estadística bayesiana con R. Desde el teorema de Bayes hasta modelos jerárquicos y MCMC con Stan. Aplicaciones reales: modelos mixtos, predicción deportiva con footBayes, inteligencia de precios con modelos conjugados. Énfasis en interpretación y comunicación de resultados.",
      en: "Applied Bayesian statistics course with R. From Bayes theorem to hierarchical models and MCMC with Stan. Real applications: mixed models, sports prediction with footBayes, price intelligence with conjugate models. Emphasis on interpretation and communication of results.",
    },
    level: "advanced",
    duration: "10h",
    image: "/images/courses/bayesian.svg",
    tags: ["Bayesiano", "Stan", "MCMC", "R", "Modelos Jerárquicos"],
    modules: [
      {
        id: "m1",
        title: { es: "Fundamentos: Del Frecuentismo al Bayesianismo", en: "Fundamentals: From Frequentism to Bayesianism" },
        duration: "2h",
        topics: {
          es: ["Probabilidad subjetiva vs. frecuentista", "Teorema de Bayes y sus componentes", "Prior, verosimilitud y posterior", "Distribuciones conjugadas: Normal-Normal, Beta-Binomial"],
          en: ["Subjective vs. frequentist probability", "Bayes theorem and its components", "Prior, likelihood and posterior", "Conjugate distributions: Normal-Normal, Beta-Binomial"],
        },
      },
      {
        id: "m2",
        title: { es: "MCMC: Simulación y Convergencia", en: "MCMC: Simulation and Convergence" },
        duration: "2.5h",
        topics: {
          es: ["Cadenas de Markov: intuición y teoría", "Muestreo de Gibbs y Metropolis-Hastings", "Stan y RStan: primeros modelos", "Diagnósticos: R-hat, ESS, trace plots"],
          en: ["Markov chains: intuition and theory", "Gibbs sampling and Metropolis-Hastings", "Stan and RStan: first models", "Diagnostics: R-hat, ESS, trace plots"],
        },
      },
      {
        id: "m3",
        title: { es: "Modelos Jerárquicos y Mixtos", en: "Hierarchical and Mixed Models" },
        duration: "3h",
        topics: {
          es: ["Pooling parcial y shrinkage", "Modelos lineales mixtos bayesianos (brms)", "Comparación de modelos: WAIC, LOO-CV", "Aplicación: MLM Studio y datos longitudinales"],
          en: ["Partial pooling and shrinkage", "Bayesian linear mixed models (brms)", "Model comparison: WAIC, LOO-CV", "Application: MLM Studio and longitudinal data"],
        },
      },
      {
        id: "m4",
        title: { es: "Aplicaciones: Deportes, Precios y Marcas", en: "Applications: Sports, Prices and Brands" },
        duration: "2.5h",
        topics: {
          es: ["Doble Poisson para goles (footBayes)", "Bradley-Terry-Davidson para resultados", "Actualización conjugada en precios (La Tienda)", "Regresión logística bayesiana para LegalTech"],
          en: ["Double Poisson for goals (footBayes)", "Bradley-Terry-Davidson for results", "Conjugate updating for prices (La Tienda)", "Bayesian logistic regression for LegalTech"],
        },
      },
    ],
  },
  {
    id: "modelos-regresion-series-tiempo",
    title: {
      es: "Modelos de Regresión para Series de Tiempo",
      en: "Regression Models for Time Series",
    },
    description: {
      es: "Curso completo sobre tendencia, estacionalidad y ajustes locales en series de tiempo, basado en las notas de clase de la Profesora Nelfi González (UNAL, Estadística III). Ocho módulos con notación formal, ejemplos numéricos y código R reproducible, desde la descomposición clásica hasta LOESS/STL, pruebas de hipótesis y gráficos diagnósticos. Incluye manual en PDF, guía de comparación de modelos y acceso directo a TimeSight 2.0.",
      en: "Comprehensive course on trend, seasonality and local fitting in time series, based on the class notes of Professor Nelfi González (UNAL, Statistics III). Eight modules with formal notation, numerical examples and reproducible R code, from classical decomposition to LOESS/STL, hypothesis tests and diagnostic plots. Includes a PDF manual, model comparison guide and direct access to TimeSight 2.0.",
    },
    level: "intermediate",
    duration: "16h",
    image: "/images/courses/seriesdetiempo.svg",
    tags: ["Series de Tiempo", "Regresión", "LOESS", "STL", "R"],
    url: "https://seriesdetiempo.vercel.app/",
    modules: [
      {
        id: "m1",
        title: { es: "Fundamentos y Descomposición", en: "Fundamentals and Decomposition" },
        duration: "2h",
        topics: {
          es: ["Componentes: tendencia, estacionalidad, ciclo, error", "Modelos aditivo y multiplicativo", "decompose() en R", "Transformación logarítmica"],
          en: ["Components: trend, seasonality, cycle, error", "Additive and multiplicative models", "decompose() in R", "Log transformation"],
        },
      },
      {
        id: "m2",
        title: { es: "Tendencia y Estacionalidad Determinística", en: "Deterministic Trend and Seasonality" },
        duration: "3h",
        topics: {
          es: ["Regresión polinomial, log y exponencial", "Variables indicadoras (dummies)", "Series de Fourier (armónicos)", "Periodograma"],
          en: ["Polynomial, log and exponential regression", "Indicator (dummy) variables", "Fourier series (harmonics)", "Periodogram"],
        },
      },
      {
        id: "m3",
        title: { es: "Modelos Completos y Ajustes Locales", en: "Complete Models and Local Fitting" },
        duration: "3h",
        topics: {
          es: ["Tendencia + estacionalidad combinadas", "Pronósticos e intervalos de predicción", "LOESS y kernel tricúbico", "Descomposición STL con estacionalidad cambiante"],
          en: ["Combined trend + seasonality", "Forecasts and prediction intervals", "LOESS and tricube kernel", "STL decomposition with evolving seasonality"],
        },
      },
      {
        id: "m4",
        title: { es: "Validación, Diagnóstico y Casos Aplicados", en: "Validation, Diagnostics and Applied Cases" },
        duration: "4h",
        topics: {
          es: ["7 pruebas: t, F, Shapiro-Wilk, Jarque-Bera, Durbin-Watson, Ljung-Box, Breusch-Pagan, ADF", "9 gráficos diagnósticos con ggplot2", "Casos: demanda eléctrica, PIB agrícola, temperatura Nottingham", "Síntesis metodológica y elección de modelo (AIC, BIC, RMSE, MAPE)"],
          en: ["7 tests: t, F, Shapiro-Wilk, Jarque-Bera, Durbin-Watson, Ljung-Box, Breusch-Pagan, ADF", "9 diagnostic plots with ggplot2", "Cases: electricity demand, agricultural GDP, Nottingham temperature", "Methodological synthesis and model choice (AIC, BIC, RMSE, MAPE)"],
        },
      },
    ],
  },
  {
    id: "intro-modelos-mixtos",
    title: {
      es: "Introducción a los Modelos Mixtos",
      en: "Introduction to Mixed Models",
    },
    description: {
      es: "Curso interactivo de 15 lecciones sobre modelos lineales mixtos (LMM) y modelos lineales mixtos generalizados (GLMM), con celdas de código R ejecutables en el navegador vía WebR y referencias equivalentes en SAS. Basado en las notas, libro y recomendaciones del profesor Juan Carlos Salazar (UNAL, sede Medellín). Cubre desde datos longitudinales y estructuras de covarianza hasta GEE, GAMM y casos clínicos integradores.",
      en: "Interactive 15-lesson course on linear mixed models (LMM) and generalized linear mixed models (GLMM), with browser-executable R code cells via WebR and equivalent SAS references. Based on the notes, book and recommendations of Professor Juan Carlos Salazar (UNAL, Medellín campus). Covers longitudinal data and covariance structures through GEE, GAMM and integrative clinical cases.",
    },
    level: "advanced",
    duration: "20h",
    image: "/images/courses/modelos-mixtos.svg",
    tags: ["Modelos Mixtos", "LMM", "GLMM", "Longitudinal", "R", "WebR"],
    url: "https://intro-modelos-mixtos.vercel.app/",
    modules: [
      {
        id: "m1",
        title: { es: "Fundamentos y Exploración Longitudinal", en: "Fundamentals and Longitudinal Exploration" },
        duration: "3h",
        topics: {
          es: ["Efectos fijos vs. aleatorios", "Datos longitudinales y medidas repetidas", "Gráficos de perfiles con ggplot2", "Patrones de anidamiento"],
          en: ["Fixed vs. random effects", "Longitudinal and repeated-measures data", "Profile plots with ggplot2", "Nesting patterns"],
        },
      },
      {
        id: "m2",
        title: { es: "Especificación del LMM", en: "LMM Specification" },
        duration: "4h",
        topics: {
          es: ["lme4 y nlme", "Interceptos y pendientes aleatorias", "Trayectorias de crecimiento (SPRUCE)", "Estructuras de covarianza: CS, AR(1), UN"],
          en: ["lme4 and nlme", "Random intercepts and slopes", "Growth trajectories (SPRUCE)", "Covariance structures: CS, AR(1), UN"],
        },
      },
      {
        id: "m3",
        title: { es: "Diagnóstico y GLMM", en: "Diagnostics and GLMM" },
        duration: "4h",
        topics: {
          es: ["Residuos simulados con DHARMa", "GLMM binomial y Poisson", "Comparación de modelos: AIC/BIC, razón de verosimilitud", "Casos: progesterona, infección ungueal, coldfeet"],
          en: ["Simulated residuals with DHARMa", "Binomial and Poisson GLMM", "Model comparison: AIC/BIC, likelihood ratio", "Cases: progesterone, nail infection, coldfeet"],
        },
      },
      {
        id: "m4",
        title: { es: "Modelos Avanzados y Aplicación Comparada R/SAS", en: "Advanced Models and R/SAS Comparison" },
        duration: "5h",
        topics: {
          es: ["GEE vs. GLMM y errores sándwich", "Heterocedasticidad y estructuras de trabajo", "Series interrumpidas y piecewise", "GAMM, bootstrap y casos integradores en R y SAS"],
          en: ["GEE vs. GLMM and sandwich errors", "Heteroscedasticity and working structures", "Interrupted time series and piecewise models", "GAMM, bootstrap and integrative R/SAS cases"],
        },
      },
    ],
  },
  {
    id: "bioestadistica-salud",
    title: {
      es: "Bioestadística para Profesionales de la Salud",
      en: "Biostatistics for Health Professionals",
    },
    description: {
      es: "Curso práctico de bioestadística para enfermería, farmacia, psicología, fisioterapia, nutrición, odontología, salud pública y medicina. De la ansiedad estadística al criterio clínico: variables, muestreo, probabilidad y teorema de Bayes, sesgos en investigación y lectura crítica, con herramientas gratuitas como Jamovi y JASP y casos reales por disciplina.",
      en: "Practical biostatistics course for nursing, pharmacy, psychology, physical therapy, nutrition, dentistry, public health and medicine. From statistical anxiety to clinical judgment: variables, sampling, probability and Bayes' theorem, research bias and critical reading, using free tools like Jamovi and JASP with real cases per discipline.",
    },
    level: "basic",
    duration: "12h",
    image: "/images/courses/bioestadistica.svg",
    tags: ["Bioestadística", "Salud", "Jamovi", "JASP", "Bayes"],
    url: "https://curso-estadistica-salud-six.vercel.app/",
    modules: [
      {
        id: "m1",
        title: { es: "Orientación y Empoderamiento Estadístico", en: "Orientation and Statistical Empowerment" },
        duration: "2h",
        topics: {
          es: ["Cómo está organizado el curso", "De la ansiedad al empoderamiento estadístico", "Rutas según especialidad", "Componentes interactivos"],
          en: ["Course structure", "From anxiety to statistical empowerment", "Paths by specialty", "Interactive components"],
        },
      },
      {
        id: "m2",
        title: { es: "Variables y Fundamentos Estadísticos", en: "Variables and Statistical Fundamentals" },
        duration: "3h",
        topics: {
          es: ["El lenguaje de los datos: tipos de variables", "Descriptiva vs. inferencial", "Medidas de tendencia y dispersión", "Tipos de muestreo válido"],
          en: ["The language of data: variable types", "Descriptive vs. inferential", "Measures of central tendency and dispersion", "Valid sampling types"],
        },
      },
      {
        id: "m3",
        title: { es: "Probabilidad, Bayes y Sesgos", en: "Probability, Bayes and Bias" },
        duration: "3h",
        topics: {
          es: ["Probabilidad para modelar incertidumbre", "Teorema de Bayes en decisiones clínicas", "Sesgos en investigación", "Lectura crítica de evidencia"],
          en: ["Probability for modeling uncertainty", "Bayes' theorem in clinical decisions", "Research bias", "Critical reading of evidence"],
        },
      },
      {
        id: "m4",
        title: { es: "Herramientas y Casos por Disciplina", en: "Tools and Discipline-Specific Cases" },
        duration: "4h",
        topics: {
          es: ["Jamovi y JASP como alternativa a SPSS", "Casos: enfermería, farmacia, psicología, fisioterapia, nutrición", "Interpretación orientada a la toma de decisiones", "Proyecto integrador"],
          en: ["Jamovi and JASP as SPSS alternatives", "Cases: nursing, pharmacy, psychology, physical therapy, nutrition", "Decision-oriented interpretation", "Integrative project"],
        },
      },
    ],
  },
];
