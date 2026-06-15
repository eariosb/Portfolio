import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/about": { es: "/sobre-mi", en: "/about" },
    "/portfolio": { es: "/portafolio", en: "/portfolio" },
    "/blog": "/blog",
    "/courses": { es: "/cursos", en: "/courses" },
    "/contact": { es: "/contacto", en: "/contact" },
  },
});
