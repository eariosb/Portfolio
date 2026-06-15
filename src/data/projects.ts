export type ProjectCategory = "all" | "shiny" | "web" | "ml";

export interface Project {
  id: string;
  name: { es: string; en: string };
  description: { es: string; en: string };
  url: string;
  image: string;
  tags: string[];
  category: Exclude<ProjectCategory, "all">;
  featured: boolean;
  github?: string;
  tech: string[];
}

export const projects: Project[] = [
  {
    id: "mlm-studio",
    name: {
      es: "MLM Studio",
      en: "MLM Studio",
    },
    description: {
      es: "Aplicación Shiny para análisis completo de Modelos Lineales Mixtos sin escribir código. Cubre el flujo completo: importación, descriptivos, perfiles longitudinales, estimaciones OLS individuales, modelo mixto con lme4 y comparación de modelos anidados. Incluye interpretación automática en lenguaje natural, ICC con clasificación de Cicchetti y factor de contracción lambda.",
      en: "Shiny app for complete Mixed Linear Model analysis without writing code. Covers the full pipeline: import, descriptives, longitudinal profiles, individual OLS estimates, mixed model with lme4, and nested model comparison. Includes automatic natural language interpretation, ICC with Cicchetti classification and lambda shrinkage factor.",
    },
    url: "https://rios.shinyapps.io/MLM-Studio/",
    image: "/images/projects/mlm-studio.svg",
    tags: ["Modelos Mixtos", "Longitudinal", "lme4", "R", "Shiny"],
    category: "shiny",
    featured: true,
    tech: ["R", "Shiny", "lme4", "lmerTest", "ggplot2", "plotly"],
  },
  {
    id: "timesight",
    name: {
      es: "TimeSight",
      en: "TimeSight",
    },
    description: {
      es: "Plataforma profesional de análisis de series temporales con arquitectura modular (bs4Dash). Implementa walk-forward CV, Interval Score, ANOVA de residuos, modelos ARIMA/ETS/TBATS, componentes bayesianos con bsts y diagnósticos automáticos accionables. Diseñada para no programadores con tooltips teóricos en cada elemento.",
      en: "Professional time series analysis platform with modular architecture (bs4Dash). Implements walk-forward CV, Interval Score, residuals ANOVA, ARIMA/ETS/TBATS models, Bayesian components with bsts, and actionable automatic diagnostics. Designed for non-programmers with theoretical tooltips on every element.",
    },
    url: "https://rios.shinyapps.io/AnalisisSeriesTiempo/",
    image: "/images/projects/timesight.svg",
    tags: ["Series de Tiempo", "ARIMA", "Bayesiano", "R", "Shiny"],
    category: "shiny",
    featured: true,
    tech: ["R", "Shiny", "bs4Dash", "forecast", "bsts", "prophet"],
  },
  {
    id: "la-tienda",
    name: {
      es: "La Tienda — Inteligencia de Precios",
      en: "La Tienda — Price Intelligence",
    },
    description: {
      es: "Sistema de inteligencia de precios mayoristas para comerciantes minoristas de Antioquia. Implementa actualización bayesiana conjugada Normal-Normal en tiempo real, detección de anomalías por IQR, suavizamiento exponencial, descomposición STL y prueba Mann-Kendall. Datos de Central Mayorista, DANE-SIPSA, Banrep y WFP. Alertas proactivas y predicción a 15 días.",
      en: "Wholesale price intelligence system for Antioquia retail merchants. Implements real-time Normal-Normal conjugate Bayesian updating, IQR anomaly detection, exponential smoothing, STL decomposition and Mann-Kendall test. Data from Central Mayorista, DANE-SIPSA, Banrep and WFP. Proactive alerts and 15-day prediction.",
    },
    url: "https://rios.shinyapps.io/la_tienda/",
    image: "/images/projects/la-tienda.svg",
    tags: ["Bayesiano", "Precios", "STL", "Alertas", "R", "Shiny"],
    category: "shiny",
    featured: false,
    tech: ["R", "Shiny", "rvest", "tseries", "ggplot2"],
  },
  {
    id: "symfonos",
    name: {
      es: "SymFonos — Caos Visual de tu Música",
      en: "SymFonos — Visual Chaos of Your Music",
    },
    description: {
      es: "Visualizador musical generativo en WebGL que transforma audio en tiempo real (micrófono o archivo) en animaciones 3D regidas por ecuaciones de física caótica: péndulo de resorte y péndulo doble integrados con RK4 para alta precisión. Color dinámico en espacio LCH, shaders GLSL personalizados (fondo, masas, aberración cromática) con bloom, exponente de Lyapunov en vivo, modo caos con impulsos aleatorios, modo zen y 4 presets visuales (Kandinsky Pulse, Vignelli Grid, Neon Filament, Particle Swarm) inspirados en Reas, Ikeda, Klingemann, Kwok, Akten, Rist y Zobel. Cada sesión es única e irrepetible.",
      en: "Generative WebGL music visualizer that turns real-time audio (mic or file) into 3D animations driven by chaotic physics equations: spring pendulum and double pendulum integrated with RK4 for high precision. Dynamic color in LCH space, custom GLSL shaders (background, masses, chromatic aberration) with bloom, live Lyapunov exponent, chaos mode with random impulses, zen mode, and 4 visual presets (Kandinsky Pulse, Vignelli Grid, Neon Filament, Particle Swarm) inspired by Reas, Ikeda, Klingemann, Kwok, Akten, Rist and Zobel. Every session is unique and unrepeatable.",
    },
    url: "https://symfonosvisualizer.vercel.app/",
    image: "/images/projects/symfonos.svg",
    tags: ["Three.js", "Web Audio API", "Física", "Arte Generativo", "WebGL", "Shaders"],
    category: "web",
    featured: false,
    tech: ["Next.js", "Three.js", "Zustand", "TypeScript", "GLSL", "Web Workers", "RK4"],
  },
  {
    id: "rios-sim",
    name: {
      es: "@RIOS — Simulación y Optimización",
      en: "@RIOS — Simulation & Optimization",
    },
    description: {
      es: "Motor de simulación Monte Carlo y optimización estocástica en Shiny con arquitectura modular avanzada. Permite definir variables aleatorias (Normal, LogNormal, Triangular, PERT), variables de decisión y restricciones en lenguaje natural R. Optimización con algoritmos genéticos (GA) con muestras comunes y paralelización con future/furrr.",
      en: "Monte Carlo simulation and stochastic optimization engine in Shiny with advanced modular architecture. Allows defining random variables (Normal, LogNormal, Triangular, PERT), decision variables and constraints in natural R language. Genetic algorithm optimization (GA) with common samples and parallelization with future/furrr.",
    },
    url: "https://rios.shinyapps.io/RIOS-simMCMC/",
    image: "/images/projects/rios-sim.svg",
    tags: ["Monte Carlo", "Optimización", "GA", "R", "Shiny"],
    category: "shiny",
    featured: false,
    tech: ["R", "Shiny", "GA", "future", "furrr", "rhandsontable"],
  },
  {
    id: "statistical-software-engineering",
    name: {
      es: "Ingeniería de Software Estadístico",
      en: "Statistical Software Engineering",
    },
    description: {
      es: "Manual open source para llevar modelos estadísticos de R/Python a producción. Documenta arquitectura, DataOps, MLOps y gobernanza de datos: principios de software estadístico, gestión de modelos con MLflow, feature stores, monitoreo, checklist de cumplimiento, CI/CD, rollback, buenas prácticas en Shiny y React, y un roadmap de madurez para equipos de datos.",
      en: "Open source manual for taking R/Python statistical models to production. Documents architecture, DataOps, MLOps and data governance: statistical software principles, model management with MLflow, feature stores, monitoring, compliance checklist, CI/CD, rollback, Shiny/React best practices, and a maturity roadmap for data teams.",
    },
    url: "https://statistical-software-engineering.vercel.app/",
    image: "/images/projects/statsoft-eng.svg",
    tags: ["MLOps", "DataOps", "Arquitectura", "Documentación", "Next.js"],
    category: "web",
    featured: false,
    tech: ["Next.js", "TypeScript", "MDX", "MLflow"],
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectsByCategory = (cat: ProjectCategory) =>
  cat === "all" ? projects : projects.filter((p) => p.category === cat);
