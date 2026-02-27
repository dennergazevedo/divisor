"use client";

import { cn } from "@/lib/utils";

type BackgroundProps = {
  className?: string;
  showGrid?: boolean;
  showGlow?: boolean;
  glowClassName?: string;
};

export function Background({
  className,
  showGrid = true,
  showGlow = true,
  glowClassName,
}: BackgroundProps) {
  return (
    <div className={cn("fixed inset-0 pointer-events-none", className)}>
      {showGlow && (
        <div className={cn("fixed inset-0 hero-glow", glowClassName)} />
      )}
      {showGrid && <div className="fixed inset-0 bg-grid opacity-30" />}
    </div>
  );
}
