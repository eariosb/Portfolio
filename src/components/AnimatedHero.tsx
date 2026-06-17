"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, BarChart2, Brain, Code2, Scale, Database, Globe, TrendingUp, Layers } from "lucide-react";
import { GaussianArt, BayesFormula, FloatingSymbols, SoftClock } from "@/components/art/GaussianArt";

interface HeroProps {
  locale: string;
  labels: {
    headline1: string; headline2: string;
    subtitle: string; name: string;
    cta: string; ctaContact: string;
    statsLabels: string[];
    formLabels: string[];
    skillsTitle: string;
    formTitle: string;
  };
  portfolioPath: string;
  contactPath: string;
}

// Componente de contador con IntersectionObserver
function AnimatedCounter({ target, suffix = "", delay = 0 }: { target: number | string; suffix?: string; delay?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const isNum = typeof target === "number";

  useEffect(() => {
    if (!isInView || !isNum) return;
    let start = 0;
    const step = Math.ceil((target as number) / 35);
    const timeout = setTimeout(() => {
      const t = setInterval(() => {
        start += step;
        if (start >= (target as number)) {
          setVal(target as number);
          clearInterval(t);
        } else setVal(start);
      }, 35);
      return () => clearInterval(t);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isInView, target, delay, isNum]);

  if (!isNum) return <>{target}{suffix}</>;
  return <>{val}{suffix}</>;
}

// WhatsApp FAB (mejorado)
function WhatsAppFAB() {
  const url = "https://wa.me/573044575399?text=Hola%20Esneider%2C%20vi%20tu%20portfolio%20y%20quisiera%20hablar%20contigo.";
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl group"
      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span className="absolute right-16 whitespace-nowrap bg-[#0A1128] text-[#F8FAFF] text-xs px-3 py-1.5 rounded-lg border border-[#243060] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm">
        WhatsApp
      </span>
    </motion.a>
  );
}

// Componente principal
export default function AnimatedHero({ labels, portfolioPath, contactPath }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "0px 0px -200px 0px" });

  useEffect(() => { setMounted(true); }, []);

  // Skills data
  const skills = [
    { icon: BarChart2,  label: "Bayesiano",  color: "#2A5CFF" },
    { icon: Brain,      label: "ML / IA",    color: "#00C2FF" },
    { icon: TrendingUp, label: "Analítica",  color: "#2A5CFF" },
    { icon: Scale,      label: "LegalTech",  color: "#00C2FF" },
    { icon: Code2,      label: "R & Python",  color: "#2A5CFF" },
    { icon: Globe,      label: "Next.js",    color: "#00C2FF" },
    { icon: Database,   label: "SQL",        color: "#2A5CFF" },
    { icon: Layers,     label: "MLM",        color: "#00C2FF" },
  ];

  const stats = [
    { val: 8,     suffix: "8+", label: labels.statsLabels[0], color: "#2A5CFF" },
    { val: 3,     suffix: "2",  label: labels.statsLabels[1], color: "#00C2FF" },
    { val: 6,     suffix: "1",  label: labels.statsLabels[2], color: "#2A5CFF" },
    { val: "Data",suffix: "Culture",  label: labels.statsLabels[3], color: "#00C2FF" },
  ];

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="hero-cinematic relative overflow-hidden flex justify-center"
      >
        {/* Símbolos flotantes de estadística */}
        <FloatingSymbols />

        {/* Contenido principal con retícula de 12 columnas */}
        <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 sm:px-10 lg:px-14 flex flex-col justify-center py-6 min-h-[calc(100vh-4rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* COLUMNA IZQUIERDA: Texto narrativo (8 columnas en lg) */}
            <motion.div
              className="lg:col-span-7 xl:col-span-6 flex flex-col gap-4 sm:gap-5"
              variants={containerVariants}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#243060] bg-[#1B2B5E]/40 backdrop-blur-sm self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A5CFF] animate-pulse" />
                <span className="mono-tag text-[#B0C4FF] text-[11px]">Statistician</span>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h1 className="font-black leading-[1.08] tracking-tight text-[clamp(1.65rem,4vw,3rem)]">
                  <span className="block text-white">
                    {labels.headline1}
                  </span>
                  <span className="block text-white">
                    {labels.headline2}
                  </span>
                </h1>
              </motion.div>

              <motion.p variants={itemVariants} className="text-[#B0C4FF] leading-relaxed max-w-[54ch] text-[clamp(0.8rem,1.2vw,0.92rem)]">
                {labels.subtitle}
              </motion.p>

              <motion.p variants={itemVariants} className="mono-tag text-[#475569]">
                — <span className="text-[#94a3b8] font-medium">{labels.name}</span>
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={portfolioPath}
                  className="group inline-flex items-center gap-2 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:shadow-[0_0_28px_#2A5CFF] hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #2A5CFF, #00C2FF)", padding: '9px 24px', minWidth: '10rem' }}
                >
                  <span className="inline-block">{labels.cta}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform ml-0.5" />
                </Link>
                <Link
                  href={contactPath}
                  className="inline-flex items-center gap-2 rounded-xl text-sm font-medium border border-[#243060] text-[#B0C4FF] hover:border-[#2A5CFF] hover:text-[#F8FAFF] transition-all hover:bg-[#1B2B5E]/50"
                  style={{ padding: '8px 18px' }}
                >
                  <span className="inline-block">{labels.ctaContact}</span>
                </Link>
              </motion.div>

              {/* Mobile stats (solo 3 primeros) */}
              <motion.div variants={itemVariants} className="flex lg:hidden gap-2 sm:gap-3 pt-4">
                {stats.slice(0,3).map((s, idx) => (
                  <div key={s.label} className="flex-1 py-2 sm:py-3 px-1 sm:px-2 rounded-xl border border-[#243060] bg-[#1B2B5E]/30 text-center"
                    style={{ borderTopColor: s.color, borderTopWidth: 2 }}>
                    <div className="font-black text-md sm:text-md" style={{ color: s.color }}>
                      <AnimatedCounter target={s.val} suffix={s.suffix} delay={idx * 150} />
                    </div>
                    <div className="mono-tag text-[#475569] text-[9px] sm:text-[10px] mt-1">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* COLUMNA DERECHA: Bayes + Stats + Skills */}
            <motion.div
              className="lg:col-span-5 flex flex-col gap-2.5 px-1 sm:px-2"
              initial="hidden"
              animate={mounted && isInView ? "visible" : "hidden"}
              variants={containerVariants}
            >
             
              <motion.div variants={itemVariants}
                className="card p-3 sm:p-4 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center gap-2"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <BayesFormula className="scale-90 origin-center" />
                <GaussianArt className="w-full h-10 sm:h-14" /> 
                {/* Tarjeta Bayes + Gauss 
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="mono-tag text-[#94A3B8] text-[9px] tracking-[0.2em]">
                    <InlineMath math="N(\mu, \sigma^2)" />
                  </span>
                  <span className="mono-tag text-[#94A3B8] text-[9px] tracking-[0.2em]">MCMC</span>
                  <span className="mono-tag text-[#94A3B8] text-[9px] tracking-[0.2em]">Posterior</span>
                </div>*/}
              </motion.div>

              {/* Stats 2×2 
              <div className="grid grid-cols-2 gap-2">
                {stats.map((s, idx) => (
                  <motion.div
                    key={s.label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className="card p-3 cursor-default flex flex-col items-center justify-center text-center"
                    style={{ borderLeftColor: s.color, borderLeftWidth: 3 }}
                  >
                    <div className="font-black text-xl sm:text-2xl leading-none mb-1" style={{ color: s.color }}>
                      <AnimatedCounter target={s.val} suffix={s.suffix} delay={idx * 120} />
                    </div>
                    <div className="mono-tag text-[#94A3B8] text-[8px] tracking-[0.18em]">{s.label}</div>
                  </motion.div>
                ))}
              </div>*/}

              {/* Skills 4×2 */}
              <div className="grid grid-cols-4 gap-2">
                {skills.map(({ icon: Icon, label, color }) => (
                  <motion.div
                    key={label}
                    variants={itemVariants}
                    whileHover={{ y: -2, backgroundColor: "#1B2B5E80" }}
                    className="card flex flex-col items-center justify-center gap-1.5 p-2 transition-all duration-200 cursor-default"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
                      <Icon size={12} style={{ color }} />
                    </div>
                    <span className="mono-tag text-[#B0C4FF] text-[8px] text-center tracking-[0.08em] leading-tight">
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          <motion.div
            className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-16 sm:w-20 opacity-60 hover:opacity-100 transition-opacity pointer-events-none lg:pointer-events-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            <SoftClock className="w-full" />
          </motion.div>

          {/* Indicador de scroll down */}
{/*           <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-[#475569]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <span className="mono-tag text-[10px] tracking-wider">SCROLL</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </motion.div> */}
        </div>
      </section>

      <WhatsAppFAB />
    </>
  );
}