import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { routing, SupportedLocale } from "@/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cyna - Cybersecurity Solutions",
  description: "Enterprise-grade cybersecurity solutions for your business",
};

const RootLayout = async ({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: SupportedLocale };
}) => {
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({
    locale,
  });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
