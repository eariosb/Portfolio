"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronDown, Clock, ExternalLink, Layers } from "lucide-react";
import { courses } from "@/data/courses";

const LEVEL: Record<string, { color: string; label: string }> = {
  basic:        { color: "#00C2FF", label: "Básico" },
  intermediate: { color: "#2A5CFF", label: "Intermedio" },
  advanced:     { color: "#F97316", label: "Avanzado" },
};

export default function CoursesPage() {
  const t = useTranslations("courses");
  const locale = useLocale() as "es" | "en";
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setOpen(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="section-page hero-mesh overflow-hidden">
      <div className="orb orb-electric absolute w-96 h-96 top-0 right-0 opacity-20 pointer-events-none" />
      <div className="container-page relative">

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F97316" }} />
            <h1 className="text-primary" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, lineHeight: 1 }}>
              {t("title")}<span style={{ color: "#2A5CFF" }}>.</span>
            </h1>
          </div>
          <p className="text-secondary" style={{ fontSize: "1rem", marginLeft: "1.25rem" }}>{t("subtitle")}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {courses.map(course => {
            const lvl = LEVEL[course.level];
            const title = locale === "es" ? course.title.es : course.title.en;
            const desc  = locale === "es" ? course.description.es : course.description.en;
            return (
              <div key={course.id} style={{
                background: "#1B2B5E", borderRadius: "1.25rem",
                border: "1px solid rgba(42,92,255,0.20)",
                overflow: "hidden",
              }}>
                {/* Course header */}
                <div style={{ padding: "2rem", borderBottom: "1px solid rgba(42,92,255,0.12)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem", alignItems: "center" }}>
                    <span style={{
                      padding: "0.25rem 0.75rem", borderRadius: "9999px",
                      background: lvl.color + "18", border: `1px solid ${lvl.color}44`,
                      color: lvl.color, fontSize: "0.7rem", fontFamily: "monospace",
                      letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700,
                    }}>{t(`level_${course.level}`)}</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={11} />{course.duration}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 4 }}>
                      <Layers size={11} />{course.modules.length} {t("modules")}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2 style={{ color: "#F8FAFF", fontWeight: 800, fontSize: "clamp(1.1rem,2.5vw,1.4rem)", lineHeight: 1.25, marginBottom: "0.75rem" }}>
                        {title}
                      </h2>
                      <p style={{ color: "#CBD5E1", fontSize: "0.9rem", lineHeight: 1.65 }}>{desc}</p>
                    </div>
                    {course.url && (
                      <a href={course.url} target="_blank" rel="noopener noreferrer"
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.65rem 1.25rem", borderRadius: "0.75rem",
                          background: "linear-gradient(135deg, #2A5CFF, #00C2FF)",
                          color: "white", fontWeight: 600, fontSize: "0.85rem",
                          textDecoration: "none", flexShrink: 0,
                          transition: "box-shadow 0.2s",
                        }}>
                        <ExternalLink size={14} />{t("start_course")}
                      </a>
                    )}
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "1.25rem" }}>
                    {course.tags.map(tag => (
                      <span key={tag} style={{
                        padding: "0.2rem 0.65rem", borderRadius: "9999px",
                        background: "rgba(42,92,255,0.10)", border: "1px solid rgba(42,92,255,0.22)",
                        color: "#B0C4FF", fontSize: "0.65rem", fontFamily: "monospace",
                        letterSpacing: "0.06em", textTransform: "uppercase",
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Modules accordion */}
                <div>
                  {course.modules.map((mod, idx) => {
                    const mid = `${course.id}-${mod.id}`;
                    const isOpen = !!open[mid];
                    const modTitle = locale === "es" ? mod.title.es : mod.title.en;
                    const topics   = locale === "es" ? mod.topics.es  : mod.topics.en;
                    return (
                      <div key={mod.id} style={{ borderBottom: idx < course.modules.length - 1 ? "1px solid rgba(42,92,255,0.10)" : "none" }}>
                        <button onClick={() => toggle(mid)} style={{
                          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "1rem 2rem", background: "transparent", border: "none",
                          cursor: "pointer", textAlign: "left",
                          transition: "background 0.2s",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ color: lvl.color, fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700, minWidth: "1.5rem" }}>
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span style={{ color: "#F8FAFF", fontSize: "0.9rem", fontWeight: 500 }}>{modTitle}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                            <span style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: "0.7rem" }}>{mod.duration}</span>
                            <ChevronDown size={15} color="#94a3b8"
                              style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                          </div>
                        </button>
                        {isOpen && (
                          <div style={{ padding: "0.5rem 2rem 1.5rem 4.5rem" }}>
                            <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                              {topics.map(topic => (
                                <li key={topic} style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#CBD5E1", fontSize: "0.875rem", lineHeight: 1.5 }}>
                                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: lvl.color, flexShrink: 0 }} />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
