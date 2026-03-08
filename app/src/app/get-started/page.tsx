"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/ui/atoms/Button";
import { Input } from "@/app/ui/atoms/Input";
import {
  Building2,
  FlaskConical,
  Code2,
  CheckCircle2,
  ArrowRight,
  Monitor,
  Layout,
  Box,
  Globe,
  Plus,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FRAMEWORKS = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: Globe,
    color: "text-yellow-400",
  },
  { id: "react", name: "React", icon: Box, color: "text-blue-400" },
  { id: "angular", name: "Angular", icon: Monitor, color: "text-red-400" },
  { id: "vue", name: "Vue", icon: Layout, color: "text-emerald-400" },
];

export default function GetStartedPage() {
  const router = useRouter();
  const { completeOnboarding, selectedTenant, setSelectedTenant } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Tenant
  const [tenantName, setTenantName] = useState("");
  const [tenantUrl, setTenantUrl] = useState("");

  // Step 2: Experiment
  const [expName, setExpName] = useState("first_experiment");
  const [variants, setVariants] = useState([
    { value: "A", percent: 50 },
    { value: "B", percent: 50 },
  ]);

  const totalPercent = variants.reduce((sum, v) => sum + v.percent, 0);

  function updateVariant(index: number, data: any) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, ...data } : v)),
    );
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { value: String.fromCharCode(65 + prev.length), percent: 0 },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  // Step 3: Framework
  const [selectedFramework, setSelectedFramework] = useState("");

  async function handleCreateTenant() {
    if (!tenantName || !tenantUrl) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tenant/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tenantName, url: tenantUrl }),
      });

      if (!res.ok) throw await res.json();

      // Wait a bit for the session to reload or manually update if needed
      // The AuthProvider loadSession will eventually pick this up
      // For now, we move to step 2 after a successful call
      // We might need to refresh tenants list here to get the ID

      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (meData.tenants?.length > 0) {
        // Find the one we just created or just take the first one if it's the only one
        setSelectedTenant(meData.tenants[0]);
      }

      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error("Error creating tenant");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateExperiment() {
    if (!selectedTenant) {
      toast.error("Tenant not found. Please try again.");
      return;
    }

    if (!expName) {
      toast.error("Please name your experiment");
      return;
    }

    if (totalPercent !== 100) {
      toast.error("The total percentage must be 100%");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/experiments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: selectedTenant.id,
          name: expName,
          variants: variants,
        }),
      });

      if (!res.ok) throw await res.json();

      setStep(3);
    } catch (error) {
      console.error(error);
      toast.error("Error creating experiment");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish() {
    if (!selectedFramework) {
      toast.error("Please select a framework");
      return;
    }

    setLoading(true);
    try {
      await completeOnboarding();
      router.push(`/integrations?tab=${selectedFramework}`);
    } catch (error) {
      console.error(error);
      toast.error("Error finishing setup");
    } finally {
      setLoading(false);
    }
  }

  const renderStepIcon = (index: number) => {
    if (step > index)
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    return (
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border",
          step === index
            ? "bg-purple-500 border-purple-500 text-white"
            : "border-neutral-700 text-neutral-500",
        )}
      >
        {index}
      </div>
    );
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-zinc-950 relative overflow-hidden">
      {/* Progres Bar */}
      <div className="max-w-xl w-full mb-12 flex items-center justify-between px-4 relative z-10">
        <div className="flex flex-col items-center gap-2">
          {renderStepIcon(1)}
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">
            Tenant
          </span>
        </div>
        <div className="h-[1px] flex-1 bg-neutral-800 mx-4 mt-[-20px]" />
        <div className="flex flex-col items-center gap-2">
          {renderStepIcon(2)}
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">
            Experiment
          </span>
        </div>
        <div className="h-[1px] flex-1 bg-neutral-800 mx-4 mt-[-20px]" />
        <div className="flex flex-col items-center gap-2">
          {renderStepIcon(3)}
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">
            Integration
          </span>
        </div>
      </div>

      <div className="max-w-2xl w-full bg-zinc-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-xl relative z-10">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 mb-4">
                <Building2 className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Let&apos;s start with your Workspace
              </h2>
              <p className="text-neutral-400">
                Give your workspace a name and a domain to manage your
                experiments.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  Workspace Name
                </label>
                <Input
                  placeholder="Divisor Inc"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="bg-zinc-800/50 border-neutral-700 h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  Main Domain
                </label>
                <Input
                  placeholder="example.com"
                  value={tenantUrl}
                  onChange={(e) => setTenantUrl(e.target.value)}
                  className="bg-zinc-800/50 border-neutral-700 h-12"
                />
                <p className="text-xs text-neutral-500">
                  Enter just the domain (e.g., mysite.com).
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Button
                onClick={handleCreateTenant}
                className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-lg font-bold"
                disabled={loading}
              >
                {loading ? "Creating..." : "Next Step"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 mb-4">
                <FlaskConical className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Create your first experiment
              </h2>
              <p className="text-neutral-400">
                Define how you want to split your traffic.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  Experiment Name
                </label>
                <Input
                  placeholder="new_hero_section"
                  value={expName}
                  onChange={(e) => setExpName(e.target.value)}
                  className="bg-zinc-800/50 border-neutral-700 h-12"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-300">
                    Variants
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addVariant}
                    className="h-8 border-neutral-700 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Variant
                  </Button>
                </div>

                <div className="space-y-3">
                  {variants.map((v, i) => (
                    <div
                      key={i}
                      className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-300"
                    >
                      <Input
                        value={v.value}
                        onChange={(e) =>
                          updateVariant(i, { value: e.target.value })
                        }
                        className="bg-zinc-800/50 border-neutral-700 h-10 flex-1"
                        placeholder="Variant Name"
                      />
                      <div className="relative w-24">
                        <Input
                          type="number"
                          value={v.percent}
                          onChange={(e) =>
                            updateVariant(i, {
                              percent: Number(e.target.value),
                            })
                          }
                          className="bg-zinc-800/50 border-neutral-700 h-10 pr-6"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 font-bold">
                          %
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariant(i)}
                        disabled={variants.length <= 2}
                        className="h-10 w-10 text-neutral-500 hover:text-red-400"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    totalPercent === 100
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/5 border-red-500/20 text-red-400",
                  )}
                >
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Total Usage
                  </span>
                  <span className="text-lg font-black">{totalPercent}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 pt-6 gap-4 w-full">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStep(1)}
                className="h-12 border-neutral-700"
              >
                Back
              </Button>
              <Button
                onClick={handleCreateExperiment}
                className="h-12 bg-purple-600 hover:bg-purple-500 text-lg font-bold"
                disabled={loading}
              >
                {loading ? "Creating..." : "Review Integration"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setStep(3)}
              className="h-12 text-neutral-400 hover:text-white"
            >
              Skip
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 mb-4">
                <Code2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">The final step!</h2>
              <p className="text-neutral-400">
                Select your tech stack to get the integration snippets.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id)}
                  className={cn(
                    "p-6 rounded-2xl border transition-all flex flex-col items-center gap-3",
                    selectedFramework === fw.id
                      ? "bg-purple-500/10 border-purple-500"
                      : "bg-zinc-800/20 border-neutral-800 hover:border-neutral-700",
                  )}
                >
                  <fw.icon className={cn("w-8 h-8", fw.color)} />
                  <span className="font-bold text-white">{fw.name}</span>
                </button>
              ))}
            </div>

            <div className="pt-6">
              <Button
                onClick={handleFinish}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-lg font-bold"
                disabled={loading || !selectedFramework}
              >
                {loading ? "Finalizing..." : "Start Building"}
                <CheckCircle2 className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
    </main>
  );
}
