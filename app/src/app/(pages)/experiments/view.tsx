"use client";

import { Button } from "@/app/ui/atoms/Button";
import { Eye } from "lucide-react";

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
import { Input } from "@/app/ui/atoms/Input";

export default function ViewExperimentDialog({
  experiment,
}: {
  experiment: Experiment;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Eye className="h-4 w-4 mr-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Archived experiment</DialogTitle>
          <DialogDescription>
            This experiment is archived and cannot be edited.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-neutral-400">Experiment name</label>
            <Input value={experiment.name} disabled />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-neutral-400">End date</label>
            <Input
              value={
                experiment.ends_at
                  ? new Date(experiment.ends_at).toLocaleDateString()
                  : "—"
              }
              disabled
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm text-neutral-400">Variants</span>

            {experiment.variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-[1fr_80px] gap-2">
                <Input value={variant.value} disabled />
                <Input value={`${variant.percent}%`} disabled />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
