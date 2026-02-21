import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
});

export const STRIPE_PRODUCTS = {
  growth: {
    monthly: "prod_U14XnrAq6orp30",
    annually: "prod_U14YlyQiJclPkt",
  },
  pro: {
    monthly: "prod_U14ZhlzNFVvyv5",
    annually: "prod_U14Zdl6c8Ew0Ii",
  },
} as const;

export const STRIPE_PRODUCTS_DEV = {
  growth: {
    monthly: "prod_U14yb0BU7BGZZZ",
    annually: "prod_U14zQzRPEogRFi",
  },
  pro: {
    monthly: "prod_U150kv1r2j8qdv",
    annually: "prod_U150uNV1zhQQHD",
  },
} as const;

export type PlanType = keyof typeof STRIPE_PRODUCTS;
export type BillingCycleType = "monthly" | "annually";

export function getProductId(
  plan: string,
  billingCycle: string,
): string | null {
  if (plan === "growth" || plan === "pro") {
    if (billingCycle === "monthly" || billingCycle === "annually") {
      const isDev = process.env.NODE_ENV === "development";
      const PRODUCTS = isDev ? STRIPE_PRODUCTS_DEV : STRIPE_PRODUCTS;
      return PRODUCTS[plan][billingCycle];
    }
  }
  return null;
}
