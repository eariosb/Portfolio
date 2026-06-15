"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  // Hide footer on home routes: /es, /en, /es/, /en/
  const isHome = /^\/(es|en)\/?$/.test(pathname);
  if (isHome) return null;
  return <Footer />;
}
