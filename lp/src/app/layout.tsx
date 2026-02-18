import type { Metadata } from "next";
import Header from "@/app/ui/sections/Header";
import Footer from "@/app/ui/sections/Footer";

import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Welcome",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased bg-zinc-900 max-w-screen overflow-x-hidden text-neutral-100`}
      >
        <div className="flex flex-col h-full w-full">
          <div className="absolute -z-10 inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
