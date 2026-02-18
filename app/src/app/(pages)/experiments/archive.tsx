"use client";

import { useState } from "react";
import { Button } from "@/app/ui/atoms/Button";
import { Archive } from "lucide-react";

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
import { Separator } from "@/app/ui/atoms/Separator";
import { useAuth } from "@/contexts/AuthContext";

type ArchiveExperimentDialogProps = {
  experiment: Experiment;
};

export default function ArchiveExperimentDialog({
  experiment,
}: ArchiveExperimentDialogProps) {
  const { selectedTenant } = useAuth();

  const [loading, setLoading] = useState(false);

  async function archiveExperiment() {
    if (!selectedTenant) return;

    setLoading(true);
    try {
      const res = await fetch("/api/experiments/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tenantId: selectedTenant.id,
          experimentId: experiment.id,
          name: experiment.name,
          isActive: false,
          endsAt: new Date().toISOString(),
          variants: experiment.variants,
        }),
      });

      if (!res.ok) {
        throw await res.json();
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Archive className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Archive experiment</DialogTitle>
          <DialogDescription>
            This action is irreversible. The experiment will be permanently
            archived and cannot be reactivated.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="text-sm text-neutral-400">
          Experiment:{" "}
          <span className="font-medium text-neutral-200">
            {experiment.name}
          </span>
        </div>

        <DialogFooter className="mt-6 grid grid-cols-2">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={archiveExperiment}
            disabled={loading}
          >
            <Archive className="h-4 w-4 mr-2" />
            Confirm archive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
