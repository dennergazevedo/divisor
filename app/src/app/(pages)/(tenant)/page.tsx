"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/app/ui/atoms/Separator";
import { SidebarTrigger } from "@/app/ui/organisms/Sidebar";
import TenantList from "./list";
import CreateTenant from "./create";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const plan = searchParams.get("plan");
    const billingCycle = searchParams.get("billingCycle");

    if (plan && plan !== "free" && billingCycle) {
      router.push(`/payment?plan=${plan}&billingCycle=${billingCycle}`);
    }
  }, [searchParams, router]);

  return (
    <main className="relative flex flex-col h-full w-full">
      <SidebarTrigger className="fixed top-2 left-4 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12" />
      <section className="flex flex-col gap-4 p-8 py-4 mt-20 md:mt-0">
        <div className="flex flex-row justify-between w-full gap-8">
          <div>
            <h1 className="text-lg font-bold">Tenants</h1>
            <p className="text-sm text-neutral-400">
              Select a tenant to manage it
            </p>
          </div>
          <div>
            <CreateTenant />
          </div>
        </div>
        <Separator />
        <TenantList />
      </section>
    </main>
  );
}
