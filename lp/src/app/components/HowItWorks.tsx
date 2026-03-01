"use client";

import { useTranslations } from "next-intl";

const HowItWorks = () => {
  const t = useTranslations("HowItWorks");

  const steps = [
    {
      number: "01",
      title: t("step1.title"),
      description: t("step1.description"),
    },
    {
      number: "02",
      title: t("step2.title"),
      description: t("step2.description"),
    },
    {
      number: "03",
      title: t("step3.title"),
      description: t("step3.description"),
    },
    {
      number: "04",
      title: t("step4.title"),
      description: t("step4.description"),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-24 border-t border-border"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <li
              key={step.number}
              className="
      group
      relative
      overflow-hidden
      border-l-2 border-purple-600
      rounded-md
      pl-8 py-4
      hover:bg-purple-900/10
      hover:shadow-md hover:shadow-purple-500/10
      transition-all
      cursor-default
    "
            >
              {/* Conteúdo */}
              <div className="relative z-10">
                <span className="text-xs font-mono text-purple-600 mb-3 block">
                  {step.number}
                </span>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Shimmer */}
              <span
                aria-hidden
                className="
        pointer-events-none
        absolute inset-0
        opacity-0
        group-hover:opacity-100
        bg-[linear-gradient(90deg,transparent,rgba(168,85,247,0.25),transparent)]
        bg-[length:200%_100%]
        group-hover:animate-pulse
      "
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HowItWorks;
