/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/app/ui/organisms/Sidebar";
import { Separator } from "@/app/ui/atoms/Separator";
import Link from "next/link";
import { ChevronRight, BarChart3, Gauge } from "lucide-react";

export default function PerformancePage() {
  const { selectedTenant } = useAuth();
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadPerformanceExperiments() {
    if (!selectedTenant) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/experiments/performance?tenantId=${selectedTenant.id}`,
      );

      if (!res.ok) {
        throw new Error("Failed to load performance data");
      }

      const data = await res.json();
      setExperiments(data.experiments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPerformanceExperiments();
  }, [selectedTenant]);

  return (
    <main className="relative flex flex-col h-full w-full">
      <SidebarTrigger className="fixed top-2 left-4 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12" />
      <section className="flex flex-col gap-4 p-8 py-4 mt-20 md:mt-0">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-lg font-bold flex flex-row items-center gap-2">
              <Gauge className="w-5 h-5 text-purple-400" />
              Performance
            </h1>
            <p className="text-sm text-neutral-400">
              Analyze the performance of your active experiments
            </p>
          </div>

          <Separator />

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden">
            {loading && (
              <div className="p-6 text-sm text-muted-foreground">
                Loading experiments...
              </div>
            )}

            {!loading && experiments.length === 0 && (
              <div className="p-12 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
                <h3 className="text-md font-medium text-white mb-1">
                  No performance data yet
                </h3>
                <p className="text-sm text-neutral-400">
                  Experiments will appear here once they receive conversion
                  events.
                </p>
              </div>
            )}

            {!loading && experiments.length > 0 && (
              <div className="divide-y divide-neutral-800">
                {experiments.map((exp: any) => (
                  <Link
                    key={exp.experimentName}
                    href={`/experiments/performance/${exp.experimentName}`}
                    className="flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {exp.experimentName}
                        </p>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider">
                          Active Experiment
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-600 group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
