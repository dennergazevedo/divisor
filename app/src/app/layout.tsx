import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/app/ui/organisms/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/app/ui/molecules/Sonner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Divisor",
    template: "%s • Divisor",
  },
  description:
    "Divisor is an open-source, edge-first A/B testing and feature flag platform built for performance and scale.",
  metadataBase: new URL("https://divisor.dev"),
  openGraph: {
    title: "Divisor",
    description:
      "Edge-first A/B testing and feature flags with minimal cost and massive scale.",
    url: "https://divisor.dev",
    siteName: "Divisor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Divisor",
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
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased bg-zinc-900 max-w-screen overflow-x-hidden text-neutral-100`}
      >
        <div className="absolute inset-0 hero-glow bottom-0 rotate-180" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <Toaster />
        <AuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
