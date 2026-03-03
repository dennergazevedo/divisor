/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
declare const window: any;

export default function OrderPlacedEvent() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17988343311/d_ZcCL61kIIcEI-swYFD",
        transaction_id: "ORDER_ID_AQUI",
      });
    }
  }, []);

  return null;
}
