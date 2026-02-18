"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/ui/atoms/Button";
import { Trash, Pencil } from "lucide-react";

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

type Variant = {
  value: string;
  percent: number;
};

type Experiment = {
  id: string;
  name: string;
  is_active: boolean;
  ends_at: string | null;
  variants: Variant[];
};

export default function EditExperiment({
  experiment,
}: {
  experiment: Experiment;
}) {
  const { selectedTenant } = useAuth();

  const [name, setName] = useState(experiment.name);
  const [endsAt, setEndsAt] = useState(
    experiment.ends_at ? experiment.ends_at.split("T")[0] : "",
  );
  const [variants, setVariants] = useState<Variant[]>(experiment.variants);
  const [loading, setLoading] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

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

  async function updateExperiment(isActive: boolean) {
    if (!selectedTenant) return;

    const total = variants.reduce((sum, v) => sum + v.percent, 0);
    if (isActive && total !== 100) {
      alert("Variant percentages must sum to 100");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/experiments/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          experimentId: experiment.id,
          tenantId: selectedTenant.id,
          name,
          isActive,
          endsAt: endsAt || null,
          variants,
        }),
      });

      if (!res.ok) {
        throw await res.json();
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to update experiment");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (confirmArchive) {
      setTimeout(function () {
        setConfirmArchive(false);
      }, 5000);
    }
  }, [confirmArchive]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit experiment</DialogTitle>
          <DialogDescription>
            Update configuration or archive this experiment.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-neutral-400">Experiment name</label>
            <Input
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

            {variants?.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_80px_32px] gap-2 items-center"
              >
                <Input
                  value={variant.value}
                  onChange={(e) =>
                    updateVariant(index, { value: e.target.value })
                  }
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
                  disabled={variants?.length <= 2}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="text-xs text-neutral-500">
              Total: {variants?.reduce((sum, v) => sum + v.percent, 0)}%
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 grid grid-cols-1 gap-2">
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="flex-1"
              disabled={loading}
              onClick={() => updateExperiment(true)}
            >
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
