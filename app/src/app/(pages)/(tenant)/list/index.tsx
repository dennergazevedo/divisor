"use client";

import { Briefcase } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pagination } from "@/app/ui/molecules/Pagination";
import { useAuth } from "@/contexts/AuthContext";
import { TenantCard } from "./card";
import { DeleteDialog } from "./delete-dialog";
import { ActiveDialog } from "./active-dialog";

export default function TenantList() {
  const { selectedTenant, setSelectedTenant } = useAuth();
  const [copied, setCopied] = useState<boolean>(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tenantToAction, setTenantToAction] = useState<Tenant | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const copyToClipboard = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("Tenant ID copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const loadTenants = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tenant/list?page=${currentPage}&limit=8`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load tenants");
      const data = await res.json();
      setTenants(data.tenants);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const handleToggleActive = async () => {
    if (!tenantToAction) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/tenant/update-active", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: tenantToAction.id,
          active: !tenantToAction.active,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update tenant status");
        if (data.details) toast.info(data.details);
      } else {
        toast.success(
          `Tenant ${tenantToAction.active ? "deactivated" : "activated"} successfully`,
        );
        loadTenants();
        setIsActivateDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTenant = async () => {
    if (!tenantToAction) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/tenant/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: tenantToAction.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to delete tenant");
      } else {
        toast.success("Tenant deleted successfully");
        if (selectedTenant?.id === tenantToAction.id) {
          setSelectedTenant(null);
        }
        loadTenants();
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-neutral-400">
        Loading tenants...
      </div>
    );
  }

  if (!tenants?.length) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <div className="p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
          <h3 className="text-md font-medium text-white mb-1">
            No tenants yet
          </h3>
          <p className="text-sm text-neutral-400">
            Add your first tenant to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {tenants.map((tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            isSelected={selectedTenant?.id === tenant.id}
            onSelect={setSelectedTenant}
            onCopy={copyToClipboard}
            onAction={(t, action) => {
              setTenantToAction(t);
              if (action === "delete") setIsDeleteDialogOpen(true);
              if (action === "activate") setIsActivateDialogOpen(true);
            }}
            isCopied={copied}
          />
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalItems={total}
        itemsPerPage={8}
        onPageChange={setCurrentPage}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        tenantName={tenantToAction?.name}
        onConfirm={handleDeleteTenant}
        loading={actionLoading}
      />

      <ActiveDialog
        open={isActivateDialogOpen}
        onOpenChange={setIsActivateDialogOpen}
        tenant={tenantToAction}
        onConfirm={handleToggleActive}
        loading={actionLoading}
      />
    </div>
  );
}
