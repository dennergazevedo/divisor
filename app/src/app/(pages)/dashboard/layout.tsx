import type { Metadata } from "next";
import { MenuSidebar } from "@/app/ui/sections/Menu";
import Logo from "@/app/ui/atoms/Logo";
import { Bell, User } from "lucide-react";
import { Button } from "@/app/ui/atoms/Button";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s • Divisor",
  },
  description:
    "Divisor is an open-source, edge-first A/B testing and feature flag platform built for performance and scale.",
  metadataBase: new URL("https://divisor.dev"),
  openGraph: {
    title: "Dashboard",
    description:
      "Edge-first A/B testing and feature flags with minimal cost and massive scale.",
    url: "https://divisor.dev",
    siteName: "Divisor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard",
    description:
      "Open-source A/B testing and feature flags, optimized for Edge and scale.",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full">
      <div className="z-10 fixed top-0 w-full p-2 px-8 bg-zinc-900 border-b border-neutral-800 flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <Logo color="#A1A1A1" size={20} />
          <span className="[font-variant:small-caps] text-neutral-400 cursor-default">
            divisor
          </span>
        </div>
        <div className="flex flex-row items-center gap-8">
          <Button variant="ghost" className="py-0 px-0 has-[>svg]:px-0">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" className="py-0 px-0 has-[>svg]:px-0">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-row z-0 mt-12">
        <MenuSidebar />
        {children}
      </div>
    </div>
  );
}
