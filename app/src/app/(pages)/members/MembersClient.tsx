"use client";

import { useEffect, useState } from "react";
import React from "react";
import { Separator } from "@/app/ui/atoms/Separator";
import { Button } from "@/app/ui/atoms/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/ui/molecules/Select";
import { useAuth } from "@/contexts/AuthContext";
import { CircleSmall, Trash, Users } from "lucide-react";
import InviteMemberDialog from "./invite";
import { Pagination } from "@/app/ui/molecules/Pagination";

type Role = "owner" | "admin" | "member";

type TenantMember = {
  user_id: string;
  email: string;
  role: Role;
  joined_at: string;
};

type TenantInvite = {
  id: string;
  email: string;
  role: Role;
  created_at: string;
};

export default function MembersClient() {
  const { selectedTenant } = useAuth();

  const [members, setMembers] = useState<TenantMember[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [currentMemberPage, setCurrentMemberPage] = useState(1);
  const [invites, setInvites] = useState<TenantInvite[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingInvites, setLoadingInvites] = useState(false);

  const loadMembers = React.useCallback(async () => {
    if (!selectedTenant) return;

    setLoadingMembers(true);
    try {
      const res = await fetch(
        `/api/tenant/list-users?tenantId=${selectedTenant.id}&page=${currentMemberPage}&limit=10`,
        { credentials: "include" },
      );

      if (!res.ok) {
        throw new Error("Failed to load members");
      }

      const data = await res.json();
      setMembers(data.members);
      setTotalMembers(data.total);
    } finally {
      setLoadingMembers(false);
    }
  }, [selectedTenant, currentMemberPage]);

  const loadInvites = React.useCallback(async () => {
    if (!selectedTenant) return;

    setLoadingInvites(true);
    try {
      const res = await fetch(
        `/api/tenant/list-invites?tenantId=${selectedTenant.id}`,
        { credentials: "include" },
      );

      if (!res.ok) {
        throw new Error("Failed to load invites");
      }

      const data = await res.json();
      setInvites(data.invites);
    } finally {
      setLoadingInvites(false);
    }
  }, [selectedTenant]);

  async function changeRole(userId: string, role: Role) {
    if (!selectedTenant) return;

    await fetch("/api/tenant/permissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        tenantId: selectedTenant.id,
        userId,
        role,
      }),
    });

    loadMembers();
  }

  async function removeMember(userId: string) {
    if (!selectedTenant) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove this member?",
    );

    if (!confirmed) return;

    await fetch("/api/tenant/remove-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        tenantId: selectedTenant.id,
        userId,
      }),
    });

    loadMembers();
  }

  async function cancelInvite(inviteId: string) {
    if (!selectedTenant) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this invite?",
    );

    if (!confirmed) return;

    await fetch("/api/invite/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ inviteId }),
    });

    loadInvites();
  }

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  useEffect(() => {
    loadInvites();
  }, [loadInvites]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between w-full gap-8">
        <div>
          <h1 className="text-lg font-bold flex flex-row items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Members
          </h1>
          <p className="text-sm text-neutral-400">
            Manage access and roles for this workspace
          </p>
        </div>

        <InviteMemberDialog />
      </div>

      {invites.length > 0 && (
        <>
          <Separator />

          <div className="rounded-lg border border-neutral-800">
            <div className="px-4 py-3 text-sm font-medium">Pending invites</div>

            {loadingInvites && (
              <div className="p-6 text-sm text-neutral-400">
                Loading invites...
              </div>
            )}

            {!loadingInvites && (
              <table className="w-full text-sm">
                <thead className="border-b border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {invites.map((invite) => (
                    <tr
                      key={invite.id}
                      className="border-b border-neutral-800 last:border-b-0"
                    >
                      <td className="px-4 py-3">{invite.email}</td>
                      <td className="px-4 py-3 capitalize">{invite.role}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cancelInvite(invite.id)}
                        >
                          <Trash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      <Separator />

      <div className="rounded-lg border border-neutral-800">
        {loadingMembers && (
          <div className="p-6 text-sm text-neutral-400">Loading members...</div>
        )}

        {!loadingMembers && members.length === 0 && (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden">
            <div className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
              <h3 className="text-md font-medium text-white mb-1">
                No members yet
              </h3>
              <p className="text-sm text-neutral-400">
                Add your first member to get started.
              </p>
            </div>
          </div>
        )}

        {!loadingMembers && members.length > 0 && (
          <div className="space-y-4">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.user_id}
                    className="border-b border-neutral-800 last:border-b-0"
                  >
                    <td className="px-4 py-3">{member.email}</td>

                    <td className="px-4 py-3">
                      {member.role === "owner" ? (
                        <span className="text-sm text-neutral-400">Owner</span>
                      ) : (
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            changeRole(member.user_id, value as Role)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMember(member.user_id)}
                        disabled={member.role === "owner"}
                      >
                        {member.role === "owner" ? (
                          <CircleSmall className="text-purple-600" />
                        ) : (
                          <Trash />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentMemberPage}
              totalItems={totalMembers}
              itemsPerPage={10}
              onPageChange={setCurrentMemberPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
