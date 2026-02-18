"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/ui/molecules/Tabs";
import { SidebarTrigger } from "@/app/ui/organisms/Sidebar";
import CreateExperiment from "./create";
import EditExperiment from "./edit";
import ArchiveExperimentDialog from "./archive";
import ViewExperimentDialog from "./view";
import { Separator } from "@/app/ui/atoms/Separator";

export default function ExperimentsPage() {
  const { selectedTenant } = useAuth();

  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadExperiments(active: boolean) {
    if (!selectedTenant) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/experiments/list?tenantId=${selectedTenant.id}&active=${active}`,
        { credentials: "include" },
      );

      if (!res.ok) {
        throw new Error("Failed to load experiments");
      }

      const data = await res.json();
      setExperiments(data.experiments);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExperiments(activeTab === "active");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedTenant]);

  return (
    <main className="relative flex flex-col h-full w-full">
      <SidebarTrigger className="fixed top-2 left-4 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12" />
      <section className="flex flex-col gap-4 p-8 py-4 mt-20 md:mt-0">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row justify-between w-full gap-8">
            <div>
              <h1 className="text-lg font-bold">Tenants</h1>
              <p className="text-sm text-neutral-400">
                Select a tenant to manage it
              </p>
            </div>
            <div>
              <CreateExperiment />
            </div>
          </div>

          <Separator />

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "active" | "archived")}
          >
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="rounded-lg border border-neutral-800">
                {loading && (
                  <div className="p-6 text-sm text-muted-foreground">
                    Loading experiments...
                  </div>
                )}

                {!loading && experiments.length === 0 && (
                  <div className="p-6 text-sm text-muted-foreground">
                    No experiments found
                  </div>
                )}

                {!loading && experiments.length > 0 && (
                  <table className="w-full text-sm">
                    <thead className="border-b border-neutral-800">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left font-medium hidden md:table-cell">
                          Ends at
                        </th>
                        <th className="px-4 py-3 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {experiments.map((experiment) => (
                        <tr
                          key={experiment.id}
                          className="border-b border-neutral-800 last:border-b-0"
                        >
                          <td className="px-4 py-3">{experiment.name}</td>
                          <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                            {experiment.ends_at
                              ? new Date(experiment.ends_at).toLocaleDateString(
                                  "pt-BR",
                                )
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-right flex-row items-center gap-2">
                            <ViewExperimentDialog experiment={experiment} />
                            {activeTab === "active" && (
                              <>
                                <EditExperiment experiment={experiment} />
                                <ArchiveExperimentDialog
                                  experiment={experiment}
                                />
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
