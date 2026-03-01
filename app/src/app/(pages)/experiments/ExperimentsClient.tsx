"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/ui/molecules/Tabs";
import CreateExperiment from "./create";
import EditExperiment from "./edit";
import ArchiveExperimentDialog from "./archive";
import ViewExperimentDialog from "./view";
import PreviewModal from "./PreviewModal";
import { Separator } from "@/app/ui/atoms/Separator";
import Link from "next/link";
import { ChartArea, FlaskConical } from "lucide-react";
import { Pagination } from "@/app/ui/molecules/Pagination";
import { Button } from "@/app/ui/atoms/Button";

export default function ExperimentsClient() {
  const { selectedTenant } = useAuth();

  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadExperiments = React.useCallback(
    async (active: boolean) => {
      if (!selectedTenant) return;

      setLoading(true);
      try {
        const res = await fetch(
          `/api/experiments/list?tenantId=${selectedTenant.id}&active=${active}&page=${currentPage}&limit=10`,
          { credentials: "include" },
        );

        if (!res.ok) {
          throw new Error("Failed to load experiments");
        }

        const data = await res.json();
        setExperiments(data.experiments);
        setTotal(data.total);
      } finally {
        setLoading(false);
      }
    },
    [selectedTenant, currentPage],
  );

  useEffect(() => {
    loadExperiments(activeTab === "active");
  }, [activeTab, loadExperiments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedTenant]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between w-full gap-8">
        <div>
          <h1 className="text-lg font-bold flex flex-row items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            Experiments
          </h1>
          <p className="text-sm text-neutral-400">Manage your experiments</p>
        </div>
        <div>
          <CreateExperiment
            activeCount={
              activeTab === "active" ? experiments.length : undefined
            }
          />
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
              <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden">
                <div className="p-12 text-center">
                  <FlaskConical className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
                  <h3 className="text-md font-medium text-white mb-1">
                    No experiments yet
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Add your first experiment to get started.
                  </p>
                </div>
              </div>
            )}

            {!loading && experiments.length > 0 && (
              <div className="space-y-4">
                <table className="w-full text-sm">
                  <thead className="border-b border-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Name</th>
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
                        <td className="px-4 py-3 text-right flex flex-row items-center justify-end gap-2">
                          {activeTab === "active" ? (
                            <>
                              <PreviewModal experiment={experiment} />
                              <Button size="sm" variant="ghost">
                                <Link
                                  href={`/experiments/performance/${experiment.name}`}
                                >
                                  <ChartArea className="w-4 h-4 text-neutral-400 hover:text-neutral-200" />
                                </Link>
                              </Button>

                              <EditExperiment experiment={experiment} />
                              <ArchiveExperimentDialog
                                experiment={experiment}
                              />
                            </>
                          ) : (
                            <ViewExperimentDialog experiment={experiment} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  totalItems={total}
                  itemsPerPage={10}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
