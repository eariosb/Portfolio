import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  try {
    const { meta } = getPostBySlug(slug);
    return {
      title: `${locale === "es" ? meta.title : meta.titleEn} — Esneider Ríos`,
      description: locale === "es" ? meta.excerpt : meta.excerptEn,
    };
  } catch {
    return { title: "Post — Esneider Ríos" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  let post: ReturnType<typeof getPostBySlug>;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const title   = locale === "es" ? post.meta.title   : post.meta.titleEn;
  const excerpt = locale === "es" ? post.meta.excerpt : post.meta.excerptEn;

  return (
    <div className="hero-mesh overflow-hidden min-h-screen">
      <div className="orb orb-vivid    absolute w-96 h-96 top-0 left-0  opacity-10 pointer-events-none z-0" />
      <div className="orb orb-electric absolute w-80 h-80 bottom-0 right-0 opacity-8  pointer-events-none z-0" />

      <div className="container-page relative z-10 py-10 sm:py-14">
        <div style={{ maxWidth: "74ch", margin: "0 auto" }}>

          {/* Back */}
          <Link href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-ghost hover:text-pale text-sm font-mono transition-colors mb-10">
            <ArrowLeft size={14} /> Blog
          </Link>

          {/* ── HEADER ── */}
          <header style={{ marginBottom: "2.5rem" }}>
            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {post.meta.tags.map(tag => (
                <span key={tag} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.25rem",
                  fontFamily: "monospace", fontSize: "0.6rem", textTransform: "uppercase",
                  letterSpacing: "0.12em", padding: "0.2rem 0.65rem", borderRadius: "9999px",
                  background: "rgba(42,92,255,0.10)", border: "1px solid rgba(42,92,255,0.28)",
                  color: "#B0C4FF",
                }}>
                  <Tag size={8} /> {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-primary font-black leading-tight" style={{
              fontSize: "clamp(1.55rem,3.5vw,2.35rem)", marginBottom: "1rem",
            }}>
              {title}
            </h1>

            {/* Excerpt */}
            <p className="text-secondary" style={{ fontSize: "0.97rem", lineHeight: 1.75, marginBottom: "1.25rem" }}>
              {excerpt}
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: "linear-gradient(90deg,#2A5CFF55,transparent)", marginBottom: "1.25rem" }} />

            {/* Meta */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontFamily: "monospace", fontSize: "0.7rem", color: "#475569" }}>
              <span>
                {new Date(post.meta.date).toLocaleDateString(locale, {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Clock size={11} /> {post.meta.readingTime} {t("min_read")}
              </span>
            </div>
          </header>

          {/* ── ARTICLE BODY ── */}
          <article
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

        </div>
      </div>
    </div>
  );
}
