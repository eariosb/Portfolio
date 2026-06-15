"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const otherLocale = locale === "es" ? "en" : "es";
  const altPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: locale === "es" ? `/${locale}/sobre-mi` : `/${locale}/about`, label: t("about") },
    { href: locale === "es" ? `/${locale}/portafolio` : `/${locale}/portfolio`, label: t("portfolio") },
    { href: `/${locale}/blog`, label: t("blog") },
    { href: locale === "es" ? `/${locale}/cursos` : `/${locale}/courses`, label: t("courses") },
    { href: locale === "es" ? `/${locale}/contacto` : `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <nav className={`navbar-grain sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? "border-b border-[#1a1030]/60"
        : "bg-transparent border-b border-transparent"
    }`}
      style={scrolled ? {
        background: "linear-gradient(180deg, rgba(5,6,18,0.96) 0%, rgba(8,6,22,0.94) 100%)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        boxShadow: "0 1px 0 rgba(88,28,220,0.12), 0 4px 24px rgba(5,4,15,0.5)",
      } : undefined}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 h-14 grid grid-cols-3 items-center">

        {/* Logo (left) */}
        <div className="col-start-1 flex items-center">
          <Link href={`/${locale}`} className="group flex items-center gap-2.5 flex-shrink-0">
            <Image src="/logo-portfolio.svg" alt="Logo" width={32} height={32} className="flex-shrink-0" priority />
            <span className="mono-tag text-[#B0C4FF] group-hover:text-[#F8FAFF] transition-colors hidden sm:block">eariosb</span>
          </Link>
        </div>

        {/* Desktop links - centered */}
        <div className="hidden md:flex items-center justify-center gap-6 col-start-2">
          {links.map(link => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active ? "text-[#F8FAFF]" : "text-[#B0C4FF] hover:text-[#F8FAFF] hover:bg-white/5"
                }`}>
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: "linear-gradient(90deg, #2A5CFF, #00C2FF)" }} />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Language toggle / actions (right) */}
        <div className="col-start-3 flex items-center justify-end gap-4">
          <Link href={altPath}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#243060] bg-[#1B2B5E]/50
              hover:border-[#2A5CFF] transition-all text-xs font-bold"
            title={otherLocale === "en" ? "Switch to English" : "Cambiar a Español"}>
            <span className={locale === "es" ? "text-[#2A5CFF]" : "text-[#475569]"}>ES</span>
            <span className="text-[#243060]">·</span>
            <span className={locale === "en" ? "text-[#00C2FF]" : "text-[#475569]"}>EN</span>
          </Link>
          <button onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 rounded-lg border border-[#243060] flex items-center justify-center
              text-[#B0C4FF] hover:border-[#2A5CFF] hover:text-[#F8FAFF] transition-all">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#1a1030]/60 px-6 py-4 flex flex-col gap-1"
          style={{ background: "rgba(5,6,18,0.98)", backdropFilter: "blur(20px)" }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-[#1B2B5E] text-[#F8FAFF] border border-[#2A5CFF33]"
                  : "text-[#B0C4FF] hover:text-[#F8FAFF]"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}