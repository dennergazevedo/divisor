"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type BillingCycle = "monthly" | "annually";

const plans = [
  {
    name: "Free",
    price: {
      monthly: "0",
      annually: "0",
    },
    description: "Perfect for testing and exploring the tool.",
    features: [
      "1 active test",
      "1 tenant",
      "1 domain",
      "1000 user sessions /mo",
    ],
    cta: "Start now",
    highlight: false,
  },
  {
    name: "Growth",
    price: {
      monthly: "149",
      annually: "109",
    },
    description: "For rapidly growing teams.",
    features: ["5 active tests", "1 tenant", "1 domain", "5M monthly sessions"],
    cta: "Choose Growth",
    highlight: true,
  },
  {
    name: "Pro",
    price: {
      monthly: "299",
      annually: "219",
    },
    description: "Full scale with unlimited sessions.",
    features: [
      "Unlimited tests",
      "3 tenants",
      "3 domains",
      "Unlimited sessions",
    ],
    cta: "Choose Pro",
    highlight: false,
  },
];

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annually");

  return (
    <section id="pricing" className="relative py-24 border-t border-border">
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple and transparent pricing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Choose the plan that best fits your company's stage.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${
                billingCycle === "monthly"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
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
              Annually{" "}
              <span className="ml-1 text-xs font-bold text-purple-600 bg-purple-600/10 px-2 py-0.5 rounded-full">
                -25%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-2xl border ${
                plan.highlight
                  ? "border-purple-600 bg-purple-600/5 shadow-xl shadow-purple-500/10"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold transition-all duration-300">
                    ${plan.price[billingCycle]}
                  </span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground min-h-[40px]">
                  {plan.description}
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm items-start">
                    <Check className="w-5 h-5 text-purple-600 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`https://app.divisor.dev/?plan=${plan.name.toLowerCase()}&billingCycle=${billingCycle}`}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all text-center ${
                  plan.highlight
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
