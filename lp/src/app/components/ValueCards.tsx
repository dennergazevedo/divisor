"use client";

import { Globe, Fingerprint, Hash, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

const ValueCards = () => {
  const t = useTranslations("ValueCards");

  const cards = [
    {
      icon: Globe,
      title: t("edgeNative.title"),
      description: t("edgeNative.description"),
    },
    {
      icon: Fingerprint,
      title: t("consistentUX.title"),
      description: t("consistentUX.description"),
    },
    {
      icon: Hash,
      title: t("deterministicTraffic.title"),
      description: t("deterministicTraffic.description"),
    },
    {
      icon: Zap,
      title: t("builtForScale.title"),
      description: t("builtForScale.description"),
    },
  ];

  return (
    <section id="why-divisor" className="py-24 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group rounded-xl border border-border bg-card p-6 hover:border-purple-600/40 hover:glow-purple-sm transition-all duration-300"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/10">
                <card.icon className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueCards;
