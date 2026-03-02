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

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantName?: string;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  tenantName,
  onConfirm,
  loading,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Tenant</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <b>{tenantName}</b>? This action
            cannot be undone and will remove all members from this tenant.
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
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
