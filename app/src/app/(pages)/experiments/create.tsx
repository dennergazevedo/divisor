"use client";

import { useMemo, useState } from "react";
import { Button } from "@/app/ui/atoms/Button";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/molecules/Dialog";
import { Input } from "@/app/ui/atoms/Input";
import { Separator } from "@/app/ui/atoms/Separator";
import { useAuth } from "@/contexts/AuthContext";

import { getPlanLimits } from "@/lib/plans";

export default function CreateExperiment({
  activeCount,
}: {
  activeCount?: number;
}) {
  const { selectedTenant } = useAuth();

  const limits = getPlanLimits(selectedTenant?.owner_plan);
  const isLimitReached = (activeCount ?? 0) >= limits.activeTests;

  const [name, setName] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [variants, setVariants] = useState<Variant[]>([
    { value: "A", percent: 50 },
    { value: "B", percent: 50 },
  ]);
  const [loading, setLoading] = useState(false);

  function updateVariant(index: number, data: Partial<Variant>) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedTenant || !name || variants.length < 2) return;

    const total = variants.reduce((sum, v) => sum + v.percent, 0);
    if (total !== 100) {
      toast.error("Variant percentages must sum to 100");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/experiments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tenantId: selectedTenant.id,
          name,
          endsAt: endsAt || null,
          variants,
        }),
      });

      if (!res.ok) {
        throw await res.json();
      }

      setName("");
      setEndsAt("");
      setVariants([
        { value: "A", percent: 50 },
        { value: "B", percent: 50 },
      ]);

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to create experiment");
    } finally {
      setLoading(false);
    }
  }

  const totalPercent = useMemo(() => {
    return variants.reduce((sum, v) => sum + v.percent, 0);
  }, [variants]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          <span className="ml-2 hidden md:flex">Create experiment</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create experiment</DialogTitle>
            <DialogDescription>
              Configure an A/B test with multiple variants.
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-neutral-400">
                Experiment name
              </label>
              <Input
                type="text"
                placeholder="checkout_button"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-neutral-400">
                End date (optional)
              </label>
              <Input
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Variants</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addVariant}
                >
                  Add variant
                </Button>
              </div>

              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_80px_32px] gap-2 items-center"
                >
                  <Input
                    type="text"
                    value={variant.value}
                    onChange={(e) =>
                      updateVariant(index, { value: e.target.value })
                    }
                    placeholder="A"
                    required
                  />

                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={variant.percent}
                    onChange={(e) =>
                      updateVariant(index, {
                        percent: Number(e.target.value),
                      })
                    }
                    required
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeVariant(index)}
                    disabled={variants.length <= 2}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="text-xs text-neutral-500">
                Total: {totalPercent}%
              </div>
            </div>
          </div>

          {isLimitReached && (
            <p className="text-xs text-red-500 mt-4 bg-red-500/10 p-2 rounded-md font-medium border border-red-500/20">
              You have reached your limit of {limits.activeTests} active test(s)
              for this tenant. Archive one to create a new one, or upgrade.
            </p>
          )}

          <DialogFooter className="mt-6 grid grid-cols-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={loading || totalPercent !== 100 || isLimitReached}
            >
              {loading ? "Creating..." : "Create experiment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
