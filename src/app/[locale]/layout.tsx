import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientWrapper from "@/components/ClientWrapper";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio - Full Stack Developer",
  description:
    "Professional portfolio showcasing web development projects and skills",
};

const locales = ["uz", "en", "ru", "ja"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <ClientWrapper>
          <AuthProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
              <Toaster position="top-right" />
            </NextIntlClientProvider>
          </AuthProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
