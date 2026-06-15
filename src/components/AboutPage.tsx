"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart2, Brain, Code2, Scale, Database, Globe,
  TrendingUp, Layers, BookOpen, GraduationCap, Languages,
  Download, ExternalLink, Presentation,
} from "lucide-react";
import Link from "next/link";

interface AboutPageProps {
  locale: string;
  t: {
    title: string; role: string; bio1: string; bio2: string;
    values_title: string; skills_title: string; education_title: string;
    languages_title: string; complementary_title: string;
    edu_unal_name: string; edu_unal_degree: string; edu_unal_period: string; edu_unal_desc: string;
    edu_academlo_name: string; edu_academlo_degree: string; edu_academlo_period: string; edu_academlo_desc: string;
    lang_spanish: string; lang_spanish_level: string;
    lang_english: string; lang_english_level: string;
    download_cv: string;
    teaching_title: string; teaching_p1: string; teaching_p2: string; teaching_link: string;
  };
}

const fadeUp = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.03 } },
};

// margin looser en mobile para no bloquear la animación
function Section({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20px 0px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <motion.p variants={fadeUp} className="text-ghost font-mono uppercase tracking-[0.22em] text-[0.68rem] mb-5">
      {label}
    </motion.p>
  );
}

function EduCard({
  icon: Icon, color, name, degree, period, desc,
}: {
  icon: React.ElementType; color: string; name: string; degree: string; period: string; desc: string;
}) {
  return (
    <motion.div variants={fadeUp} className="card" style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
      <div className="p-4 sm:p-5 md:p-6">
        {/* Header: stack on xs, row on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-3">
          <div className="flex items-start gap-2.5">
            <Icon size={16} style={{ color, flexShrink: 0, marginTop: 3 }} />
            <div>
              <p className="text-primary font-bold text-[0.92rem] leading-snug">{name}</p>
              <p className="text-pale text-[0.8rem] mt-0.5">{degree}</p>
            </div>
          </div>
          <span className="text-ghost font-mono text-[0.7rem] leading-none sm:whitespace-nowrap sm:flex-shrink-0 ml-6 sm:ml-0">
            {period}
          </span>
        </div>
        {/* Description — indent only on sm+ */}
        <p className="text-muted text-[0.82rem] leading-relaxed sm:pl-[1.6rem]">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function AboutPage({ locale, t }: AboutPageProps) {
  const values = [
    { label: locale === "es" ? "Solidario"    : "Solidarity",  color: "#2A5CFF" },
    { label: locale === "es" ? "Perseverante" : "Perseverant", color: "#00C2FF" },
    { label: locale === "es" ? "Estratégico"  : "Strategic",   color: "#2A5CFF" },
    { label: locale === "es" ? "Observador"   : "Observant",   color: "#00C2FF" },
    { label: locale === "es" ? "Analítico"    : "Analytical",  color: "#2A5CFF" },
  ];

  const skillGroups = [
    {
      label: locale === "es" ? "Análisis de datos" : "Data Analysis",
      color: "#2A5CFF",
      items: [
        { icon: BarChart2,  label: locale === "es" ? "Bayesiano" : "Bayesian" },
        { icon: Brain,      label: "ML / IA" },
        { icon: TrendingUp, label: locale === "es" ? "Series de tiempo" : "Time Series" },
        { icon: Layers,     label: locale === "es" ? "Regresión / MLM" : "Regression / MLM" },
      ],
    },
    {
      label: locale === "es" ? "Desarrollo Web" : "Web Development",
      color: "#00C2FF",
      items: [
        { icon: Globe,    label: "Next.js / Node.js" },
        { icon: Code2,    label: "R · Python" },
        { icon: Database, label: "SQL · MongoDB" },
        { icon: Scale,    label: "LegalTech" },
      ],
    },
  ];

  const platziGroups = locale === "es"
    ? [
        { label: "Liderazgo & Negocio",   color: "#2A5CFF" },
        { label: "Data Science & IA",      color: "#00C2FF" },
        { label: "Ingeniería de Software", color: "#2A5CFF" },
        { label: "Habilidades Blandas",    color: "#00C2FF" },
        { label: "Inglés",                 color: "#2A5CFF" },
      ]
    : [
        { label: "Leadership & Business",  color: "#2A5CFF" },
        { label: "Data Science & AI",      color: "#00C2FF" },
        { label: "Software Engineering",   color: "#2A5CFF" },
        { label: "Soft Skills",            color: "#00C2FF" },
        { label: "English",                color: "#2A5CFF" },
      ];

  const cvHref = locale === "es" ? "/cv/CV_Esneider_Rios_ES.pdf" : "/cv/CV_Esneider_Rios_EN.pdf";
  const portfolioHref = locale === "es" ? `/${locale}/portafolio` : `/${locale}/portfolio`;

  return (
    <div className="section-page hero-mesh overflow-hidden">
      <div className="orb orb-vivid    absolute w-96 h-96 top-0 left-0  opacity-15 pointer-events-none" />
      <div className="orb orb-electric absolute w-80 h-80 bottom-0 right-0 opacity-10 pointer-events-none" />

      <div className="container-page relative flex flex-col gap-12 sm:gap-14">

        {/* ── HEADER ──────────────────────────────────────────── */}
        <Section>
          {/* Role badge — wraps on mobile */}
          <motion.div variants={fadeUp} className="mb-4">
            <span className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full border border-[#243060] bg-[#1B2B5E]/40 font-mono text-pale text-[0.7rem] tracking-wide leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2A5CFF] animate-pulse flex-shrink-0" />
              {t.role}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4 sm:mb-5">
            <div className="w-2 h-2 rounded-full bg-[#2A5CFF] flex-shrink-0" />
            <h1 className="text-primary font-black leading-tight" style={{ fontSize: "clamp(1.9rem,4vw,3.2rem)" }}>
              {t.title}<span className="text-[#2A5CFF]">.</span>
            </h1>
          </motion.div>

          {/* Bio — no forced left margin on mobile */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3 mb-6 sm:ml-5 readable-content">
            <p className="text-secondary leading-relaxed" style={{ fontSize: "clamp(0.88rem,1.4vw,1.02rem)" }}>{t.bio1}</p>
            <p className="text-secondary leading-relaxed" style={{ fontSize: "clamp(0.88rem,1.4vw,1.02rem)" }}>{t.bio2}</p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="sm:ml-5">
            <a href={cvHref} download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:shadow-[0_0_24px_rgba(42,92,255,0.5)] hover:-translate-y-px active:translate-y-0"
              style={{ background: "linear-gradient(135deg,#2A5CFF,#00C2FF)" }}
            >
              <Download size={14} />
              {t.download_cv}
            </a>
          </motion.div>
        </Section>

        {/* ── VALUES ──────────────────────────────────────────── */}
        <Section>
          <SectionLabel label={t.values_title} />
          <div className="flex flex-wrap gap-2">
            {values.map(v => (
              <motion.span key={v.label} variants={fadeUp}
                className="px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide"
                style={{ border: `1px solid ${v.color}55`, color: v.color, background: v.color + "11" }}>
                {v.label}
              </motion.span>
            ))}
          </div>
        </Section>

        {/* ── TECHNICAL SKILLS ────────────────────────────────── */}
        <Section>
          <SectionLabel label={t.skills_title} />
          {/* On mobile: single column. sm+: 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillGroups.map(group => (
              <motion.div key={group.label} variants={fadeUp} className="card p-4 sm:p-5"
                style={{ borderTopColor: group.color, borderTopWidth: 2 }}>
                <p className="font-mono uppercase font-bold text-[0.65rem] tracking-widest mb-3"
                  style={{ color: group.color }}>
                  {group.label}
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {group.items.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 min-w-0">
                      <Icon size={13} style={{ color: group.color, flexShrink: 0 }} />
                      <span className="text-secondary text-[0.8rem] truncate">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── EDUCATION ───────────────────────────────────────── */}
        <Section>
          <SectionLabel label={t.education_title} />
          <div className="flex flex-col gap-4">
            <EduCard icon={GraduationCap} color="#2A5CFF"
              name={t.edu_unal_name} degree={t.edu_unal_degree}
              period={t.edu_unal_period} desc={t.edu_unal_desc} />
            <EduCard icon={BookOpen} color="#00C2FF"
              name={t.edu_academlo_name} degree={t.edu_academlo_degree}
              period={t.edu_academlo_period} desc={t.edu_academlo_desc} />
          </div>
        </Section>

        {/* ── CONTINUOUS LEARNING ─────────────────────────────── */}
        <Section>
          <SectionLabel label={t.complementary_title} />
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-muted text-[0.82rem]">Platzi · 2025</span>
              <span className="text-ghost text-[0.75rem]">·</span>
              <a href="https://platzi.com/@esneiderriosb/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ghost font-mono text-[0.73rem] hover:text-[#2A5CFF] transition-colors">
                @esneiderriosb <ExternalLink size={10} />
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              {platziGroups.map(g => (
                <span key={g.label}
                  className="px-3 py-1 rounded-full font-mono text-[0.72rem] text-muted"
                  style={{ border: `1px solid ${g.color}30`, background: g.color + "08" }}>
                  {g.label}
                </span>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* ── DOCENCIA & CURSOS CREADOS ───────────────────────── */}
        <Section>
          <SectionLabel label={t.teaching_title} />
          <motion.div variants={fadeUp} className="card p-4 sm:p-6 flex flex-col gap-3"
            style={{ borderLeftColor: "#00C2FF", borderLeftWidth: 3 }}>
            <div className="flex items-start gap-2.5">
              <Presentation size={16} style={{ color: "#00C2FF", flexShrink: 0, marginTop: 3 }} />
              <p className="text-secondary text-[0.85rem] leading-relaxed">{t.teaching_p1}</p>
            </div>
            <p className="text-secondary text-[0.85rem] leading-relaxed sm:pl-[1.6rem]">{t.teaching_p2}</p>
            <div className="sm:pl-[1.6rem]">
              <Link href={portfolioHref}
                className="inline-flex items-center gap-1.5 text-[#2A5CFF] font-mono text-[0.78rem] hover:text-[#00C2FF] transition-colors">
                {t.teaching_link} <ExternalLink size={12} />
              </Link>
            </div>
          </motion.div>
        </Section>

        {/* ── LANGUAGES ───────────────────────────────────────── */}
        <Section>
          <SectionLabel label={t.languages_title} />
          <div className="flex flex-wrap gap-3">
            {[
              { lang: t.lang_spanish, level: t.lang_spanish_level, color: "#2A5CFF", pct: 100 },
              { lang: t.lang_english, level: t.lang_english_level, color: "#00C2FF", pct: 72  },
            ].map(({ lang, level, color, pct }) => (
              <motion.div key={lang} variants={fadeUp} className="card p-4 sm:p-5 flex flex-col items-center text-center gap-2.5"
                style={{ minWidth: "8rem", flex: "1 1 8rem", maxWidth: "12rem" }}>
                <Languages size={18} style={{ color }} />
                <div>
                  <p className="text-primary font-bold text-[0.88rem]">{lang}</p>
                  <p className="text-muted text-[0.72rem] mt-0.5">{level}</p>
                </div>
                <div className="w-full h-0.5 rounded-full bg-[#243060]">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }} />
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

      </div>
    </div>
  );
}
