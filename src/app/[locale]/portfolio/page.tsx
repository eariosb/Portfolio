"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { projects, type ProjectCategory } from "@/data/projects";

const CATS = {
  shiny: { label: "Shiny", color: "#2A5CFF", glow: "#2A5CFF33" },
  web:   { label: "Web",   color: "#00C2FF", glow: "#00C2FF33" },
  ml:    { label: "ML/IA", color: "#F97316", glow: "#F9731633" },
};

export default function PortfolioPage() {
  const t = useTranslations("portfolio");
  const locale = useLocale() as "es" | "en";
  const [active, setActive] = useState<ProjectCategory>("all");

  const filters: { key: ProjectCategory; label: string; color?: string }[] = [
    { key: "all",   label: t("filter_all") },
    { key: "shiny", label: "Shiny Apps",  color: "#2A5CFF" },
    { key: "web",   label: "Web Apps",    color: "#00C2FF" },
    { key: "ml",    label: "ML / IA",     color: "#F97316" },
  ];
  const filtered = active === "all" ? projects : projects.filter(p => p.category === active);

  return (
    <div className="section-page hero-mesh overflow-hidden">
      <div className="orb orb-vivid absolute w-96 h-96 top-0 right-0 opacity-25 pointer-events-none" />

      <div className="container-page relative">

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2A5CFF" }} />
            <h1 className="text-primary" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, lineHeight: 1 }}>
              {t("title")}<span style={{ color: "#2A5CFF" }}>.</span>
            </h1>
          </div>
          <p className="text-secondary" style={{ fontSize: "1rem", marginLeft: "1.25rem" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setActive(f.key)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                border: "1px solid",
                transition: "all 0.2s",
                cursor: "pointer",
                background: active === f.key ? (f.color ?? "#2A5CFF") : "transparent",
                borderColor: active === f.key ? "transparent" : "rgba(42,92,255,0.30)",
                color: active === f.key ? "white" : "#B0C4FF",
                boxShadow: active === f.key ? `0 0 20px ${f.color ?? "#2A5CFF"}44` : "none",
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid — conceptual cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.25rem" }}>
          {filtered.map(project => {
            const cat = CATS[project.category] ?? CATS.web;
            return (
              <a key={project.id} href={project.url} target="_blank" rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden"
                style={{
                  background: "#1B2B5E",
                  border: "1px solid rgba(42,92,255,0.15)",
                  transition: "all 0.25s ease",
                  textDecoration: "none",
                }}>
                {/* Image zone */}
                <div style={{ position: "relative", height: "10rem", overflow: "hidden", background: "#0A1128" }}>
                  <img src={project.image} alt={project.name[locale]}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                    className="group-hover:scale-105"
                    onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1B2B5E/2A5CFF?text=${encodeURIComponent(project.name[locale])}`; }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #1B2B5E 0%, transparent 60%)" }} />
                  {/* Category pill */}
                  <div style={{
                    position: "absolute", top: "0.75rem", left: "0.75rem",
                    padding: "0.2rem 0.6rem", borderRadius: "9999px",
                    background: cat.color + "22", border: `1px solid ${cat.color}55`,
                    color: cat.color, fontSize: "0.65rem", fontFamily: "monospace",
                    letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700,
                  }}>
                    {cat.label}
                  </div>
                  {/* Open icon */}
                  <div style={{
                    position: "absolute", top: "0.75rem", right: "0.75rem",
                    width: "2rem", height: "2rem", borderRadius: "0.5rem",
                    background: "rgba(10,17,40,0.7)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.2s",
                  }} className="group-hover:opacity-100">
                    <ArrowUpRight size={16} color="#F8FAFF" />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>
                  <h3 style={{ color: "#F8FAFF", fontWeight: 700, fontSize: "1rem", marginBottom: "0.4rem", lineHeight: 1.3 }}>
                    {project.name[locale]}
                  </h3>
                  {/* ONE-LINE teaser */}
                  <p style={{ color: "#CBD5E1", fontSize: "0.82rem", lineHeight: 1.55, marginBottom: "1rem",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {project.description[locale]}
                  </p>
                  {/* Tech pills — blue tone, no black */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {project.tech.slice(0, 3).map(tech => (
                      <span key={tech} style={{
                        padding: "0.15rem 0.6rem", borderRadius: "9999px",
                        background: "rgba(42,92,255,0.12)", border: "1px solid rgba(42,92,255,0.22)",
                        color: "#B0C4FF", fontSize: "0.65rem", fontFamily: "monospace",
                        letterSpacing: "0.05em",
                      }}>{tech}</span>
                    ))}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
