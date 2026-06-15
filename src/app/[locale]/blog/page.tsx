import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

const COLORS = ["#2A5CFF", "#00C2FF", "#F97316", "#2A5CFF", "#00C2FF", "#F97316"];

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getAllPosts();

  return (
    <div className="section-page hero-mesh overflow-hidden min-h-[calc(100dvh-4rem)]">
      <div className="orb orb-electric absolute w-80 h-80 top-0 right-0 opacity-20 pointer-events-none z-0" />
      <div className="container-page relative py-4 md:py-8">

        {/* Header */}
        <div style={{ marginBottom: "3rem", position: "relative", zIndex: 2 }}>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00C2FF" }} />
            <h1 className="text-primary" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, lineHeight: 1 }}>
              {t("title")}<span style={{ color: "#2A5CFF" }}>.</span>
            </h1>
          </div>
          <p className="text-secondary readable-content" style={{ fontSize: "1rem", marginLeft: "1.25rem" }}>{t("subtitle")}</p>
        </div>

        {posts.length === 0
          ? <p className="text-muted" style={{ textAlign: "center", padding: "5rem 0" }}>{t("no_posts")}</p>
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "80ch" }}>
              {posts.map((post, i) => {
                const title   = locale === "es" ? post.title   : post.titleEn;
                const excerpt = locale === "es" ? post.excerpt : post.excerptEn;
                const color   = COLORS[i % COLORS.length];

                return (
                  <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}
                    style={{ textDecoration: "none", display: "block" }}>
                    <article style={{
                      background: "#1B2B5E",
                      border: "1px solid rgba(42,92,255,0.15)",
                      borderRadius: "1rem",
                      padding: "clamp(1.25rem, 2.4vw, 1.85rem) clamp(1.25rem, 2.7vw, 2rem)",
                      transition: "all 0.25s ease",
                      cursor: "pointer",
                      boxShadow: `inset 0 1px 0 ${color}33`,
                    }}
                    className="group card-concept"
                    >
                      {/* Tags row */}
                      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{
                            padding: "0.15rem 0.6rem", borderRadius: "9999px",
                            background: color + "15", border: `1px solid ${color}35`,
                            color, fontSize: "0.62rem", fontFamily: "monospace",
                            letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
                          }}>{tag}</span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 style={{
                        color: "#F8FAFF", fontWeight: 700,
                        fontSize: "clamp(1.02rem,2vw,1.28rem)", lineHeight: 1.42,
                        marginBottom: "0.625rem", transition: "color 0.2s",
                        maxWidth: "72ch",
                      }} className="group-hover:text-[#2A5CFF]">
                        {title}
                      </h2>

                      {/* Excerpt — 2 lines max */}
                      <p style={{
                        color: "#CBD5E1", fontSize: "0.94rem", lineHeight: 1.75,
                        marginBottom: "1rem",
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: "76ch",
                      }}>
                        {excerpt}
                      </p>

                      {/* Meta + CTA */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", gap: "1rem", color: "#94a3b8", fontSize: "0.72rem", fontFamily: "monospace", letterSpacing: "0.06em", flexWrap: "wrap" }}>
                          <span>{new Date(post.date).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Clock size={11} />{post.readingTime} {t("min_read")}
                          </span>
                        </div>
                        <span style={{ color, display: "flex", alignItems: "center", gap: 4, fontSize: "0.82rem", fontWeight: 600 }}>
                          {t("read_more")} <ArrowRight size={13} />
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )
        }
      </div>
    </div>
  );
}
