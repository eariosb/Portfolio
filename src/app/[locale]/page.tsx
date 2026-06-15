import { getTranslations } from "next-intl/server";
import AnimatedHero from "@/components/AnimatedHero";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t  = await getTranslations({ locale, namespace: "hero" });
  const ta = await getTranslations({ locale, namespace: "about" });

  const portfolioPath = locale === "es" ? `/${locale}/portafolio` : `/${locale}/portfolio`;
  const contactPath   = locale === "es" ? `/${locale}/contacto`  : `/${locale}/contact`;

  const labels = {
    headline1: locale === "es" ? "Filtrar el ruido. " : "Filtering the Noise.",
    headline2: locale === "es" ? "Ingeniar la claridad." : "Engineering the Clarity.",
    subtitle:  t("subtitle"),
    name:      t("name"),
    cta:       locale === "es" ? "Explorar mi trabajo" : "Explore my work",
    ctaContact: locale === "es" ? "Contactar" : "Contact",
    statsLabels: locale === "es"
      ? ["Apps producción", "Cursos activos", "Posts técnicos", "Estadística"]
      : ["Production apps", "Active courses",  "Tech posts",     "Statistics"],
    formLabels:  ["En curso", "2023–24"],
    skillsTitle: ta("skills_title"),
    formTitle:   ta("title"),
  };

  return <AnimatedHero locale={locale} labels={labels} portfolioPath={portfolioPath} contactPath={contactPath} />;
}
