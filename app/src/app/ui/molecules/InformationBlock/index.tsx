"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InformationBlockProps {
  icon: LucideIcon;
  title: string;
  description: string | React.ReactNode;
  className?: string;
}

export const InformationBlock: React.FC<InformationBlockProps> = ({
  icon: Icon,
  title,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 transition-all hover:bg-purple-500/10 md:p-6",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-white md:text-base">
            {title}
          </h3>
          <div className="text-xs text-neutral-400 leading-relaxed md:text-sm">
            {description}
          </div>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-600/5 blur-3xl" />
    </div>
  );
};
