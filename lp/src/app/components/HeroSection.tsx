"use client";

import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { DivisorClient } from "@divisor.dev/sdk";
import { useCallback, useEffect, useState } from "react";

const divisor = new DivisorClient({
  tenantId: "c7bd228f-aa9a-43c0-b1d9-e8338af89c59",
});

const HeroSection = () => {
  const [variant, setVariant] = useState<string | null>(null);

  const loadVariant = useCallback(async () => {
    try {
      const res = await divisor.getVariant({
        experimentName: "hello_world",
        variantFallback: "old",
      });
      setVariant(res.variant);
    } catch (error) {
      console.log("[x] Falha ao localizar variant", error);
    }
  }, []);

  useEffect(() => {
    loadVariant();
  }, []);

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
          Open source &middot; Edge-native &middot; Stateless
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          <span className="text-gradient-purple">Edge-native</span> A/B testing{" "}
          <br className="hidden sm:block" />
          without complexity
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
          Divisor is an open-source, stateless A/B testing and feature flag
          platform designed to scale to millions of users with minimal
          infrastructure.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="https://app.divisor.dev">
            <button className="group cursor-pointer flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-purple-600-foreground hover:bg-purple-600/90 transition-colors">
              Get Started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <Link
            href="https://github.com/dennergazevedo/divisor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-purple-600/50 transition-colors"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </Link>
        </div>
        {variant && (
          <div className="mt-8">
            <p className="text-sm text-muted-foreground">
              Current variant: <span className="font-semibold">{variant}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
