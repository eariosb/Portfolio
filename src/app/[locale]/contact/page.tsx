"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Send, CheckCircle, Phone, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise(r => setTimeout(r, 1500));
    setStatus("success");
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setStatus("idle"), 5000);
  };

  const socials = [
    { href: "https://github.com/eariosb",            Icon: GithubIcon,   label: "GitHub",    sub: "@eariosb",            color: "#2A5CFF" },
    { href: "https://linkedin.com/in/esneider-rios", Icon: LinkedinIcon, label: "LinkedIn",  sub: "Esneider Ríos",        color: "#00C2FF" },
    { href: "mailto:eariosb@unal.edu.co",            Icon: Mail,         label: "Email",     sub: "eariosb@unal.edu.co", color: "#F97316" },
    { href: "tel:+573044575399",                      Icon: Phone,        label: "Teléfono",  sub: "+57 304 457 5399",    color: "#2A5CFF" },
    { href: "#",                                      Icon: MapPin,       label: "Ubicación", sub: "Medellín, Colombia 🇨🇴", color: "#B0C4FF" },
  ];

  const inputStyle = {
    width: "100%", padding: "0.72rem 0.9rem",
    borderRadius: "0.75rem",
    background: "#0A1128",
    border: "1px solid rgba(42,92,255,0.25)",
    color: "#F8FAFF", fontSize: "0.9rem",
    outline: "none", transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  return (
    <div className="hero-mesh overflow-hidden min-h-[calc(100dvh-4rem)]"
      style={{ display: "flex", alignItems: "center" }}>
      <div className="orb orb-vivid    absolute w-96 h-96 bottom-0 left-0 opacity-20 pointer-events-none" />
      <div className="orb orb-electric absolute w-64 h-64 top-0 right-0 opacity-15 pointer-events-none" />
      <div className="container-page relative w-full py-10 md:py-14">

        {/* Wrapper centrado */}
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F97316" }} />
              <h1 className="text-primary" style={{ fontSize: "clamp(1.8rem,3.2vw,2.5rem)", fontWeight: 900, lineHeight: 1 }}>
                {t("title")}<span style={{ color: "#2A5CFF" }}>.</span>
              </h1>
            </div>
            <p className="text-secondary readable-content" style={{ fontSize: "0.95rem", marginLeft: "1.25rem" }}>{t("subtitle")}</p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {([
              { key: "name",    label: t("name"),    type: "text",  ph: locale === "es" ? "Tu nombre completo" : "Your full name" },
              { key: "email",   label: t("email"),   type: "email", ph: locale === "es" ? "tu@email.com" : "you@email.com" },
            ] as const).map(({ key, label, type, ph }) => (
              <div key={key}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: "0.72rem", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  {label}
                </label>
                <input type={type} required value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={ph} style={inputStyle}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "#2A5CFF"; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(42,92,255,0.25)"; }}
                />
              </div>
            ))}
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.72rem", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                {t("message")}
              </label>
              <textarea required rows={4} value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder={locale === "es" ? "Cuéntame sobre tu proyecto..." : "Tell me about your project..."}
                style={{ ...inputStyle, resize: "none" } as React.CSSProperties}
                onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = "#2A5CFF"; }}
                onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = "rgba(42,92,255,0.25)"; }}
              />
            </div>

            {status === "success" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4ade80", padding: "0.55rem 0.75rem", borderRadius: "0.75rem", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.20)", fontSize: "0.82rem" }}>
                <CheckCircle size={15} />{t("success")}
              </div>
            )}

            <button type="submit" disabled={status === "sending"} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "0.72rem 1.2rem", borderRadius: "0.75rem", border: "none",
              background: "linear-gradient(135deg, #F97316, #FB923C)",
              color: "white", fontWeight: 700, fontSize: "0.86rem",
              cursor: status === "sending" ? "not-allowed" : "pointer",
              opacity: status === "sending" ? 0.7 : 1,
              transition: "all 0.2s", boxShadow: "0 0 0 rgba(249,115,22,0)",
              fontFamily: "inherit",
            }}>
              <Send size={15} />{status === "sending" ? t("sending") : t("send")}
            </button>
          </form>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <p style={{ color: "#94a3b8", fontSize: "0.72rem", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
              {t("or_reach")}
            </p>
            {socials.map(({ href, Icon, label, sub, color }) => (
              <a key={`${href}-${label}`} href={href === "#" ? undefined : href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 rounded-xl bg-[#1B2B5E] border border-[#2A5CFF26] hover:border-[rgba(0,194,255,0.4)] transition-colors"
                style={{ textDecoration: "none", cursor: href === "#" ? "default" : "pointer" }}
              >
                <div className="w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: color + "15", color }}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-[#F8FAFF] font-semibold text-sm">{label}</div>
                  <div className="text-[#94a3b8] text-xs font-mono">{sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        </div>{/* /wrapper centrado */}
      </div>
    </div>
  );
}
