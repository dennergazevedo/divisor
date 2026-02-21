"use client";

import { useState } from "react";
import { Button } from "@/app/ui/atoms/Button";
import { Plus } from "lucide-react";

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

export default function CreateTenant() {
  const { user, tenants } = useAuth();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const limits = getPlanLimits(user?.current_plan);
  const ownedCount = tenants.filter((t) => t.role === "owner").length;
  const isLimitReached = ownedCount >= limits.tenants;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !url) return;

    setLoading(true);
    try {
      const res = await fetch("/api/tenant/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url }),
      });

      if (!res.ok) {
        throw await res.json();
      }

      // reset
      setName("");
      setUrl("");

      // opcional: recarregar dados / redirecionar
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error creating tenant");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <span className="hidden md:flex">Create</span>
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create tenant</DialogTitle>
            <DialogDescription>
              Create a new workspace to manage your experiments and settings.
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <div className="mt-4 space-y-2">
            {/* Tenant name */}
            <div className="space-y-1">
              <label className="text-sm text-neutral-400">Tenant name</label>
              <Input
                type="text"
                placeholder="Divisor Inc"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Tenant URL */}
            <div className="space-y-1">
              <label className="text-sm text-neutral-400">Domain (URL)</label>
              <Input
                type="text"
                placeholder="divisor.dev"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <p className="text-xs text-neutral-500">
                Use only the domain (no https, no paths).
              </p>
            </div>
          </div>

          {isLimitReached && (
            <p className="text-xs text-red-500 mt-4 bg-red-500/10 p-2 rounded-md font-medium border border-red-500/20">
              You have reached your limit of {limits.tenants} tenant(s). Upgrade
              to create more.
            </p>
          )}

          <DialogFooter className="mt-6 grid grid-cols-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={loading || isLimitReached}>
              {loading ? "Creating..." : "Create tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
