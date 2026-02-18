import type { Metadata } from "next";
import Header from "@/app/ui/sections/Header";

export const metadata: Metadata = {
  title: {
    default: "Auth",
    template: "%s • Divisor",
  },
  description:
    "Divisor is an open-source, edge-first A/B testing and feature flag platform built for performance and scale.",
  metadataBase: new URL("https://divisor.dev"),
  openGraph: {
    title: "Auth | Divisor",
    description:
      "Edge-first A/B testing and feature flags with minimal cost and massive scale.",
    url: "https://divisor.dev",
    siteName: "Divisor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auth | Divisor",
    description:
      "Open-source A/B testing and feature flags, optimized for Edge and scale.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full w-full min-h-screen bg-background">
      <div className="absolute -z-10 inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
      <Header />
      {children}
    </div>
  );
}
