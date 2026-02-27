"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/app/ui/atoms/Separator";
import Link from "next/link";
import { ChevronRight, BarChart3, Gauge } from "lucide-react";
import { Pagination } from "@/app/ui/molecules/Pagination";

export default function PerformanceClient() {
  const { selectedTenant } = useAuth();
  const [experiments, setExperiments] = useState<{ experimentName: string }[]>(
    [],
  );
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadPerformanceExperiments = React.useCallback(async () => {
    if (!selectedTenant) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/experiments/performance?tenantId=${selectedTenant.id}&page=${currentPage}&limit=10`,
      );

      if (!res.ok) {
        throw new Error("Failed to load performance data");
      }

      const data = await res.json();
      setExperiments(data.experiments);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedTenant, currentPage]);

  useEffect(() => {
    loadPerformanceExperiments();
  }, [loadPerformanceExperiments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTenant]);

  return (
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
              Experiments will appear here once they receive conversion events.
            </p>
          </div>
        )}

        {!loading && experiments.length > 0 && (
          <div className="divide-y divide-neutral-800">
            <div className="divide-y divide-neutral-800">
              {experiments.map((exp) => (
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
            <Pagination
              currentPage={currentPage}
              totalItems={total}
              itemsPerPage={10}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
