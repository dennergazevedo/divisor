import type { Metadata } from "next";
import { MenuSidebar } from "@/app/ui/sections/MenuSidebar";
import LoggedHeader from "@/app/ui/sections/Header/logged";

export const metadata: Metadata = {
  title: {
    default: "Experiments",
    template: "%s • Divisor",
  },
  description:
    "Divisor is an open-source, edge-first A/B testing and feature flag platform built for performance and scale.",
  metadataBase: new URL("https://divisor.dev"),
  openGraph: {
    title: "Experiments",
    description:
      "Edge-first A/B testing and feature flags with minimal cost and massive scale.",
    url: "https://divisor.dev",
    siteName: "Divisor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experiments",
    description:
      "Open-source A/B testing and feature flags, optimized for Edge and scale.",
  },
};

export default function ExperimentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full">
      <LoggedHeader />
      <div className="flex flex-row z-0 md:mt-10 z-50 md:z-0">
        <MenuSidebar />
        {children}
      </div>
    </div>
  );
}
