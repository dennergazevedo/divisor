"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Building, Copy, Plug } from "lucide-react";
import { toast } from "sonner";

export default function TenantList() {
  const { tenants, selectedTenant, setSelectedTenant } = useAuth();

  const copyToClipboard = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("Tenant ID copied to clipboard");
  };

  return (
    <ul className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
      {tenants.map((tenant) => (
        <li
          key={tenant.id}
          onClick={() => setSelectedTenant(tenant)}
          className={`relative flex flex-col gap-2 cursor-pointer p-8 ${selectedTenant?.id === tenant.id ? "shadow-lg shadow-purple-600/50 border-b-purple-600" : "border-b-neutral-600 opacity-70"} hover:opacity-100 rounded-md border border-neutral-400/20 border-b-4 w-full hover:bg-purple-200/10" : ""}`}
        >
          {selectedTenant?.id === tenant.id && (
            <span className="text-xs [font-variant:small-caps] absolute -top-2 right-2 text-purple-600">
              <Plug />
            </span>
          )}
          <div className="flex flex-row items-center gap-2">
            <Building
              className={`w-5 h-5 ${selectedTenant?.id === tenant.id ? "text-purple-600" : "text-neutral-600"}`}
            />
            <span className="[font-variant:small-caps] lowercase text-lg font-bold">
              {tenant.name}
            </span>
          </div>

          <div
            onClick={(e) => copyToClipboard(e, tenant.id)}
            className="group/copy flex items-center justify-between gap-2 px-3 py-1.5 bg-neutral-900/50 border border-neutral-400/10 rounded font-mono text-[10px] text-neutral-400 hover:text-white hover:border-neutral-400/30 transition-all"
          >
            <span className="truncate">{tenant.id}</span>
            <Copy className="size-3 shrink-0 opacity-50 group-hover/copy:opacity-100 transition-opacity" />
          </div>

          <span className="[font-variant:small-caps] mt-2 lowercase text-sm text-neutral-400 px-4 py-0 bg-purple-600/10 rounded-full w-fit">
            {tenant.role}
          </span>
        </li>
      ))}
    </ul>
  );
}
