"use client";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";

export default function Footer() {
  const locale = useLocale();
  return (
    <footer className="relative overflow-hidden border-t border-[#2430604d] bg-[#0A1128]/78 backdrop-blur-sm pt-4">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 lg:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[1fr_220px_220px] gap-8 items-start">
          <div className="min-w-0">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-2 group">
              <div>
                <div className="text-sm font-semibold text-[#E2E8F0] leading-none">Esneider Ríos</div>
                <div className="mono-tag text-[#94a3b8]">BI · Data-Driven Projects</div>
              </div>
            </Link>
            <p className="text-xs text-[#94a3b8] leading-relaxed max-w-[60ch]">
              Analítica · LegalTech · Web Apps
            </p>
          </div>

          <div className="min-w-0">
            <p className="mono-tag text-[#B0C4FF] mb-2">Navegación</p>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {[
                [`/${locale}`, locale === "es" ? "Inicio" : "Home"],
                [locale === "es" ? `/${locale}/sobre-mi` : `/${locale}/about`, locale === "es" ? "Sobre Mí" : "About Me"],
                [locale === "es" ? `/${locale}/portafolio` : `/${locale}/portfolio`, locale === "es" ? "Portafolio" : "Portfolio"],
                [`/${locale}/blog`, "Blog"],
                [locale === "es" ? `/${locale}/cursos` : `/${locale}/courses`, locale === "es" ? "Cursos" : "Courses"],
                [locale === "es" ? `/${locale}/contacto` : `/${locale}/contact`, locale === "es" ? "Contacto" : "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#CBD5E1] hover:text-[#2A5CFF] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <p className="mono-tag text-[#B0C4FF] mb-1">Contacto</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { href: "https://github.com/eariosb",            Icon: GithubIcon,   label: "GitHub / eariosb" },
                { href: "https://linkedin.com/in/esneider-rios", Icon: LinkedinIcon, label: "LinkedIn" },
                { href: "mailto:eariosb@unal.edu.co",            Icon: Mail,         label: "eariosb@unal.edu.co" },
                { href: "tel:+573044575399",                      Icon: Phone,        label: "+57 304 457 5399" },
              ].map(({ href, Icon, label }) => (
                <a key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#CBD5E1] hover:text-[#2A5CFF] transition-colors truncate">
                  <Icon size={14} className="text-[#94a3b8] flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#2A5CFF1A] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#94a3b8]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span>© {new Date().getFullYear()} {locale === "es" ? "Todos los derechos reservados" : "All rights reserved"}</span>
            <span className="hidden sm:inline">•</span>
            <span>Medellín, Colombia</span>
          </div>
          <div className="text-xs text-[#94a3b8]">Desarrollado con ❤️</div>
        </div>
      </div>
    </footer>
  );
}
