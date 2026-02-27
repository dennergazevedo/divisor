"use client";

import Logo from "@/app/ui/atoms/Logo";
import { Background } from "@/app/ui/atoms/Background";

export function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <Background />
      <div className="animate-pulse bg-purple-600 p-8 px-6 rounded-2xl">
        <Logo size={48} color="#FFF" />
      </div>
    </div>
  );
}
