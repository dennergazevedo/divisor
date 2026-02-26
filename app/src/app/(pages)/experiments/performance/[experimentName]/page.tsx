/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/app/ui/organisms/Sidebar";
import { Separator } from "@/app/ui/atoms/Separator";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Package,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

export default function PerformanceDetailPage({
  params,
}: {
  params: Promise<{ experimentName: string }>;
}) {
  const { experimentName } = use(params);
  const { selectedTenant } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPerformanceData() {
    if (!selectedTenant) return;

    try {
      const res = await fetch(
        `/api/experiments/performance/${experimentName}?tenantId=${selectedTenant.id}`,
      );

      if (!res.ok) {
        throw new Error("Failed to load performance details");
      }

      const result = await res.json();
      setData(result.performance);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPerformanceData();
  }, [selectedTenant, experimentName]);

  const totalConversions = data.reduce(
    (acc, curr) => acc + Number(curr.totalConversions),
    0,
  );
  const totalValue = data.reduce(
    (acc, curr) => acc + Number(curr.totalValue),
    0,
  );
  const totalItems = data.reduce(
    (acc, curr) => acc + Number(curr.totalItems),
    0,
  );

  const getWinner = (metric: string) => {
    if (data.length === 0) return null;
    return [...data].sort((a, b) => Number(b[metric]) - Number(a[metric]))[0];
  };

  const conversionWinner = getWinner("totalConversions");
  const valueWinner = getWinner("totalValue");
  const itemsWinner = getWinner("totalItems");

  const CustomTooltip = ({ active, payload, label, prefix = "" }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg shadow-xl text-sm">
          <p className="font-bold mb-1 text-white">{label}</p>
          <p className="text-purple-400">
            {payload[0].name}: {prefix}
            {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="relative flex flex-col h-full w-full">
      <SidebarTrigger className="fixed top-2 left-4 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12" />
      <section className="flex flex-col gap-4 p-8 py-4 mt-20 md:mt-0 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Link
              href="/experiments/performance"
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to performance list
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {experimentName}
                </h1>
                <p className="text-sm text-neutral-400">
                  Performance dashboard and variant analysis
                </p>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold border border-purple-500/20">
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                REAL-TIME DATA
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-800" />

          {loading ? (
            <div className="py-20 text-center text-neutral-400">
              Loading performance data...
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-neutral-400">
                      Total Conversions
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {totalConversions.toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Winner:{" "}
                    <span className="text-blue-400 font-medium">
                      {conversionWinner?.variant ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-neutral-400">
                      Total Revenue
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    ${totalValue.toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Winner:{" "}
                    <span className="text-emerald-400 font-medium">
                      {valueWinner?.variant ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                      <Package className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-neutral-400">
                      Total items
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {totalItems.toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Winner:{" "}
                    <span className="text-orange-400 font-medium">
                      {itemsWinner?.variant ?? "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                {/* Conversions Chart */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col h-[400px]">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    Conversions by Variant
                  </h3>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#262626"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="variant"
                          stroke="#737373"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#737373"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) =>
                            value >= 1000
                              ? `${(value / 1000).toFixed(1)}k`
                              : value
                          }
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ fill: "#ffffff05" }}
                        />
                        <Bar
                          dataKey="totalConversions"
                          name="Conversions"
                          radius={[4, 4, 0, 0]}
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col h-[400px]">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                    Revenue by Variant ($)
                  </h3>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#262626"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="variant"
                          stroke="#737373"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#737373"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) =>
                            `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`
                          }
                        />
                        <Tooltip
                          content={<CustomTooltip prefix="$" />}
                          cursor={{ fill: "#ffffff05" }}
                        />
                        <Bar
                          dataKey="totalValue"
                          name="Value"
                          radius={[4, 4, 0, 0]}
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[(index + 1) % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Units Chart */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col h-[400px] lg:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-400" />
                    Total items sold by Variant
                  </h3>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="80%">
                      <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ left: 40, right: 40 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#262626"
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          stroke="#737373"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="variant"
                          stroke="#737373"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ fill: "#ffffff05" }}
                        />
                        <Bar
                          dataKey="totalItems"
                          name="Units"
                          radius={[0, 4, 4, 0]}
                          barSize={32}
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[(index + 2) % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
