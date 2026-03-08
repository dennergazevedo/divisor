"use client";

import { Separator } from "@/app/ui/atoms/Separator";
import { SidebarTrigger } from "@/app/ui/organisms/Sidebar";
import TenantList from "./list";
import CreateTenant from "./create";
import { Suspense, useState } from "react";
import RedirectByPlan from "./redirectByPlan";
import { Briefcase, Info } from "lucide-react";
import InvitationList from "./invitations";
import { InformationBlock } from "@/app/ui/molecules/InformationBlock";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="relative flex flex-col h-full w-full">
      <Suspense fallback={null}>
        <RedirectByPlan />
      </Suspense>
      <SidebarTrigger className="fixed top-2 left-4 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12 z-100" />
      <section className="flex flex-col gap-4 p-8 py-4 mt-20 md:mt-0">
        <div className="flex flex-row justify-between w-full gap-8">
          <div>
            <h1 className="text-lg font-bold flex flex-row items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" />
              Tenants
            </h1>
            <p className="text-sm text-neutral-400">
              Select a tenant to manage it
            </p>
          </div>
          <div className="flex items-center gap-4">
            <CreateTenant onCreated={handleRefresh} />
          </div>
        </div>

        <InformationBlock
          icon={Info}
          title="What are Tenants?"
          description="Tenants are isolated workspaces representing organizations or projects. Here you can create and manage different environments, each with its own members, integrations, and experiments."
        />

        <Separator />

        <InvitationList onAction={handleRefresh} />

        <TenantList key={refreshKey} />
      </section>
    </main>
  );
}
