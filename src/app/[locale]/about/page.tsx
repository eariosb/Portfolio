import { getTranslations } from "next-intl/server";
import AboutPage from "@/components/AboutPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "es"
      ? "Sobre Mí — Esneider Ríos"
      : "About Me — Esneider Ríos",
    description: locale === "es"
      ? "Estadístico, Desarrollador y experto en LegalTech. Conóceme."
      : "Statistician, Developer and LegalTech expert. Get to know me.",
  };
}

export default async function AboutRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  const translations = {
    title:               t("title"),
    role:                t("role"),
    bio1:                t("bio1"),
    bio2:                t("bio2"),
    values_title:        t("values_title"),
    skills_title:        t("skills_title"),
    education_title:     t("education_title"),
    languages_title:     t("languages_title"),
    complementary_title: t("complementary_title"),
    edu_unal_name:       t("edu_unal_name"),
    edu_unal_degree:     t("edu_unal_degree"),
    edu_unal_period:     t("edu_unal_period"),
    edu_unal_desc:       t("edu_unal_desc"),
    edu_academlo_name:   t("edu_academlo_name"),
    edu_academlo_degree: t("edu_academlo_degree"),
    edu_academlo_period: t("edu_academlo_period"),
    edu_academlo_desc:   t("edu_academlo_desc"),
    lang_spanish:        t("lang_spanish"),
    lang_spanish_level:  t("lang_spanish_level"),
    lang_english:        t("lang_english"),
    lang_english_level:  t("lang_english_level"),
    download_cv:         t("download_cv"),
    teaching_title:      t("teaching_title"),
    teaching_p1:         t("teaching_p1"),
    teaching_p2:         t("teaching_p2"),
    teaching_link:       t("teaching_link"),
  };

  return <AboutPage locale={locale} t={translations} />;
}
