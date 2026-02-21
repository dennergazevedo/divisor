import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthHeader from "@/app/ui/sections/Header/logged";
import StripeEmbeddedCheckout from "./components/EmbeddedCheckout";
import { Check } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const planDetails = {
  growth: {
    name: "Growth",
    price: {
      monthly: "149",
      annually: "109",
    },
    description: "For rapidly growing teams.",
    features: ["5 active tests", "1 tenant", "1 domain", "5M monthly sessions"],
  },
  pro: {
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
  },
} as const;

export default async function PaymentPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const planKey = (params.plan as string)?.toLowerCase();
  const billingCycle = (params.billingCycle as string)?.toLowerCase();

  if (
    !planKey ||
    !billingCycle ||
    planKey === "free" ||
    !planDetails[planKey as keyof typeof planDetails]
  ) {
    redirect("/");
  }

  const plan = planDetails[planKey as keyof typeof planDetails];
  const price = plan.price[billingCycle as keyof typeof plan.price];

  return (
    <div className="flex flex-col min-h-screen bg-background w-full">
      <AuthHeader />

      <main className="flex-1 relative flex items-center justify-center py-12 px-6 mt-12">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

        <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Plan Details - Left (Desktop) / Bottom (Mobile) */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                You’ve chosen{" "}
                <span className="text-gradient-purple">{plan.name}</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {plan.description}
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-purple-600/30 bg-purple-600/5 glow-purple-sm">
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-white">
                    ${price}
                  </span>
                  <span className="text-muted-foreground text-lg">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Billed {billingCycle}
                </p>
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-base text-zinc-300 items-start"
                  >
                    <Check className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Checkout - Right (Desktop) / Top (Mobile) */}
          <div className="lg:col-span-7 w-full order-1 lg:order-2">
            <Suspense
              fallback={
                <div className="h-[600px] w-full bg-neutral-900/50 animate-pulse rounded-2xl border border-border" />
              }
            >
              <StripeEmbeddedCheckout
                plan={planKey}
                billingCycle={billingCycle}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
