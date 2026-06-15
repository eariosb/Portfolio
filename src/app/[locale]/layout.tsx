import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
// @ts-ignore: side-effect import of CSS without type declarations
import 'katex/dist/katex.min.css';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "es" | "en")) notFound();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale} className="flex flex-col min-h-screen">
        <Navbar />
        <main>{children}</main>
        <ConditionalFooter />
      </div>
    </NextIntlClientProvider>
  );
}
