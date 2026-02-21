import type { Metadata } from "next";
import SimpleNavbar from "@/app/ui/sections/Header/simple";

export const metadata: Metadata = {
  title: {
    default: "Payment",
    template: "%s • Divisor",
  },
  description:
    "Divisor is an open-source, edge-first A/B testing and feature flag platform built for performance and scale.",
  metadataBase: new URL("https://divisor.dev"),
  openGraph: {
    title: "Payment",
    description:
      "Edge-first A/B testing and feature flags with minimal cost and massive scale.",
    url: "https://divisor.dev",
    siteName: "Divisor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment",
    description:
      "Open-source A/B testing and feature flags, optimized for Edge and scale.",
  },
};

export default function PaymentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full">
      <SimpleNavbar />
      {children}
    </div>
  );
}
