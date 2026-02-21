"use client";

import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface Props {
  plan: string;
  billingCycle: string;
}

export default function StripeEmbeddedCheckout({ plan, billingCycle }: Props) {
  const fetchClientSecret = useCallback(() => {
    return fetch("/api/stripe/checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan, billingCycle }),
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, [plan, billingCycle]);

  const options = { fetchClientSecret };

  return (
    <div
      id="checkout"
      className="w-full min-h-[600px] bg-neutral-900/50 rounded-2xl overflow-hidden border border-border shadow-xl"
    >
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
