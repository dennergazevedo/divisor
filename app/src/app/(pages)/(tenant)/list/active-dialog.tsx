"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/molecules/Dialog";
import { Button } from "@/app/ui/atoms/Button";

interface ActiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export function ActiveDialog({
  open,
  onOpenChange,
  tenant,
  onConfirm,
  loading,
}: ActiveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tenant?.active ? "Deactivate" : "Activate"} Tenant
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to{" "}
            {tenant?.active ? "deactivate" : "activate"} <b>{tenant?.name}</b>?
            {!tenant?.active &&
              " This will count towards your plan's active tenant limit."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading
              ? "Processing..."
              : tenant?.active
                ? "Deactivate"
                : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
