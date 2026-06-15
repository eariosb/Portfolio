"use client";
import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

const CAT: Record<string, { label: string; color: string }> = {
  shiny: { label: "Shiny",  color: "#2A5CFF" },
  web:   { label: "Web",    color: "#00C2FF" },
  ml:    { label: "ML/IA",  color: "#00C2FF" },
};

export default function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const locale = useLocale() as "es" | "en";
  const t = useTranslations("featured");
  const cat = CAT[project.category] ?? CAT.web;

  return (
    <article className={cn("group card overflow-hidden transition-all duration-300", featured ? "flex flex-col md:flex-row" : "flex flex-col")}>
      {/* Top animated line on hover */}
      <div className="h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-animated" />

      {/* Image */}
      <div className={cn("relative overflow-hidden bg-[#0A1128] flex-shrink-0", featured ? "md:w-[38%] h-52 md:h-auto" : "h-44")}>
        <img
          src={project.image} alt={project.name[locale]}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/800x500/1B2B5E/2A5CFF?text=${encodeURIComponent(project.name[locale])}`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2B5E]/80 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 mono-tag px-2.5 py-1 rounded-full border"
          style={{ color: cat.color, backgroundColor: cat.color + "18", borderColor: cat.color + "44" }}>
          {cat.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        <h3 className="text-lg font-bold text-[#F8FAFF] mb-2 group-hover:text-[#2A5CFF] transition-colors leading-tight">
          {project.name[locale]}
        </h3>
        <p className="text-sm text-[#B0C4FF] leading-relaxed flex-1 mb-4 line-clamp-3">{project.description[locale]}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map(tech => (
            <span key={tech} className="mono-tag px-2 py-0.5 rounded bg-[#0A1128] border border-[#243060] text-[#B0C4FF]">{tech}</span>
          ))}
        </div>

        <div className="flex gap-3">
          <a href={project.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl text-white transition-all hover:shadow-[0_0_20px_#2A5CFF44]"
            style={{ background: "linear-gradient(135deg, #2A5CFF, #00C2FF)" }}>
            <ExternalLink size={13} />{t("view_app")}
          </a>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-[#243060] text-[#B0C4FF] hover:border-[#2A5CFF] hover:text-[#F8FAFF] transition-all">
              <GithubIcon size={13} />{t("view_code")}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
