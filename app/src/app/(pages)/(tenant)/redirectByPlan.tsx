"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectByPlan() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const plan = searchParams.get("plan");
    const billingCycle = searchParams.get("billingCycle");

    if (plan && plan !== "free" && billingCycle) {
      router.push(`/payment?plan=${plan}&billingCycle=${billingCycle}`);
    }
  }, [searchParams, router]);

  return null;
}

export default RedirectByPlan;
