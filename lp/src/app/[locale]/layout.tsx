import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import "../globals.css";

import { Montserrat } from "next/font/google";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Divisor | A/B Testing",
    template: "%s • Divisor",
  },
  description:
    "Divisor is an open-source, edge-first A/B testing and feature flag platform built for performance and scale.",
  metadataBase: new URL("https://divisor.dev"),
  openGraph: {
    title: "Welcome to Divisor",
    description:
      "Welcome to Divisor, the open-source, edge-first A/B testing and feature flag platform built for performance and scale.",
    url: "https://divisor.dev",
    siteName: "Divisor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Welcome to Divisor",
    description:
      "Welcome to Divisor, the open-source, edge-first A/B testing and feature flag platform built for performance and scale.",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${montserrat.variable} antialiased bg-background max-w-screen overflow-x-hidden text-neutral-100`}
      >
        <NextIntlClientProvider messages={messages}>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-8D11FXVVB1"
            strategy="afterInteractive"
          />

          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8D11FXVVB1');
            `}
          </Script>
          <div className="flex flex-col h-full w-full">
            <div className="absolute -z-10 inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
            <Navbar />
            {children}
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
