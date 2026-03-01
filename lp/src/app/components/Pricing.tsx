"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

type BillingCycle = "monthly" | "annually";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annually");
  const t = useTranslations("Pricing");

  const plans = [
    {
      name: t("plans.free.name"),
      id: "free",
      price: {
        monthly: "0",
        annually: "0",
      },
      description: t("plans.free.description"),
      features: [
        t("plans.free.features.0"),
        t("plans.free.features.1"),
        t("plans.free.features.2"),
        t("plans.free.features.3"),
      ],
      cta: t("plans.free.cta"),
      highlight: false,
    },
    {
      name: t("plans.growth.name"),
      id: "growth",
      price: {
        monthly: "149",
        annually: "109",
      },
      description: t("plans.growth.description"),
      features: [
        t("plans.growth.features.0"),
        t("plans.growth.features.1"),
        t("plans.growth.features.2"),
        t("plans.growth.features.3"),
      ],
      cta: t("plans.growth.cta"),
      highlight: true,
    },
    {
      name: t("plans.pro.name"),
      id: "pro",
      price: {
        monthly: "299",
        annually: "219",
      },
      description: t("plans.pro.description"),
      features: [
        t("plans.pro.features.0"),
        t("plans.pro.features.1"),
        t("plans.pro.features.2"),
        t("plans.pro.features.3"),
      ],
      cta: t("plans.pro.cta"),
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 border-t border-border">
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            {t("subtitle")}
          </p>

          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${
                billingCycle === "monthly"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {t("monthly")}
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "annually" : "monthly",
                )
              }
              className="relative w-12 h-6 bg-secondary rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <div
                className={`w-4 h-4 bg-purple-600 rounded-full transition-transform duration-200 ${
                  billingCycle === "annually"
                    ? "translate-x-6"
                    : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                billingCycle === "annually"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {t("annually")}{" "}
              <span className="ml-1 text-xs font-bold text-purple-600 bg-purple-600/10 px-2 py-0.5 rounded-full">
                {t("discount")}
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-2xl border ${
                plan.highlight
                  ? "border-purple-600 bg-purple-600/5 shadow-xl shadow-purple-500/10"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {t("mostPopular")}
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold transition-all duration-300">
                    ${plan.price[billingCycle]}
                  </span>
                  <span className="text-muted-foreground">{t("mo")}</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground min-h-[40px]">
                  {plan.description}
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex gap-3 text-sm items-start">
                    <Check className="w-5 h-5 text-purple-600 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`https://app.divisor.dev/?plan=${plan.id}&billingCycle=${billingCycle}`}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all text-center ${
                  plan.highlight
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-secondary text-secondary-foreground hover:bg-purple-600"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
