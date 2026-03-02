"use client";

import { Building, Check, Copy, Earth, Power, Trash2 } from "lucide-react";
import { Separator } from "@/app/ui/atoms/Separator";
import { Button } from "@/app/ui/atoms/Button";

interface TenantCardProps {
  tenant: Tenant;
  isSelected: boolean;
  onSelect: (tenant: Tenant) => void;
  onCopy: (e: React.MouseEvent, id: string) => void;
  onAction: (tenant: Tenant, action: "activate" | "delete") => void;
  isCopied: boolean;
}

export function TenantCard({
  tenant,
  isSelected,
  onSelect,
  onCopy,
  onAction,
  isCopied,
}: TenantCardProps) {
  return (
    <li
      onClick={() => tenant.active && onSelect(tenant)}
      className={`group relative flex flex-col gap-3 p-6 transition-all duration-300 rounded-xl border-2 overflow-hidden
        ${!tenant.active ? "opacity-40 grayscale-[0.5] cursor-not-allowed bg-neutral-900/40 border-neutral-800" : "cursor-pointer hover:bg-purple-600/5"} 
        ${isSelected ? "border-purple-600 bg-purple-600/5 shadow-[0_0_20px_rgba(147,51,234,0.15)]" : "border-neutral-400/10 hover:border-purple-600/30"}
      `}
    >
      {/* Status & Role Badges */}
      <div className="flex justify-between items-start w-full relative z-10">
        <div className="flex gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tenant.role === "owner" ? "bg-purple-600/10 border-purple-600/20 text-purple-400" : "bg-blue-600/10 border-blue-600/20 text-blue-400"}`}
          >
            {tenant.role}
          </span>
          {!tenant.active && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600/10 border border-red-600/20 text-red-500">
              Inactive
            </span>
          )}
        </div>
        {isSelected && (
          <div className="bg-purple-600 rounded-full p-1 text-white animate-pulse shadow-[0_0_10px_rgba(147,51,234,0.5)]">
            <Check className="w-3 h-3" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${isSelected ? "bg-purple-600/20 text-purple-400" : "bg-neutral-800 text-neutral-500 group-hover:bg-purple-600/10 group-hover:text-purple-400 transition-colors"}`}
          >
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100 leading-tight">
              {tenant.name}
            </h3>
            <span className="text-xs font-medium text-neutral-400">
              {tenant.url}
            </span>
          </div>
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            onCopy(e, tenant.id);
          }}
          className="group/copy w-full flex items-center justify-between gap-2 px-3 py-2 bg-neutral-950/50 border border-neutral-400/10 rounded-lg font-mono text-[10px] text-neutral-500 hover:text-white hover:border-purple-600/30 hover:bg-neutral-900 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-neutral-600">ID:</span>
            <span className="truncate">{tenant.id}</span>
          </div>
          {isCopied ? (
            <Check className="size-3.5 shrink-0 text-green-500" />
          ) : (
            <Copy className="size-3.5 shrink-0 opacity-40 group-hover/copy:opacity-100 transition-opacity" />
          )}
        </div>
      </div>

      <Separator className="opacity-10" />

      {/* Restricted Owner Actions */}
      {tenant.role === "owner" && (
        <div className="flex gap-2 mt-auto">
          <Button
            variant={tenant.active ? "outline" : "default"}
            size="sm"
            className={`flex-1 text-[11px] font-bold uppercase h-9 ${tenant.active ? "border-neutral-700 hover:border-purple-500/50 hover:bg-purple-500/5" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onAction(tenant, "activate");
            }}
          >
            <Power className="w-3.5 h-3.5 mr-1" />
            {tenant.active ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="w-10 h-9 p-0 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onAction(tenant, "delete");
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </li>
  );
}
