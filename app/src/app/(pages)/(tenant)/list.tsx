"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Building } from "lucide-react";

export default function TenantList() {
  const { tenants, setSelectedTenant } = useAuth();
  return (
    <ul className="grid grid-cols-1 md:grid-cols-4">
      {tenants.map((tenant) => (
        <li
          key={tenant.id}
          onClick={() => setSelectedTenant(tenant)}
          className={`flex flex-col gap-2 cursor-pointer p-8 shadow-lg shadow-purple-600/50 rounded-md border border-neutral-400/20 border-b-4 border-b-purple-600 w-full hover:bg-purple-200/10`}
        >
          <div className="flex flex-row items-center gap-2">
            <Building className="w-6 h-6 text-purple-600" />
            <span className="[font-variant:small-caps] lowercase text-lg font-bold">
              {tenant.name}
            </span>
          </div>
          <span className="[font-variant:small-caps] mt-2 lowercase text-sm text-neutral-400 px-4 py-0 bg-purple-200/10 rounded-full w-fit">
            {tenant.role}
          </span>
        </li>
      ))}
    </ul>
  );
}
