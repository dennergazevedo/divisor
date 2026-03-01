"use client";

import { Check, X, Loader2, Mail } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/app/ui/atoms/Button";

interface Invitation {
  id: string;
  tenant_id: string;
  tenant_name: string;
  role: string;
  created_at: string;
}

export default function InvitationList({
  onAction,
}: {
  onAction?: () => void;
}) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadInvitations = useCallback(async () => {
    try {
      const res = await fetch("/api/invite/list");
      if (!res.ok) throw new Error("Failed to load invitations");
      const data = await res.json();
      setInvitations(data.invites);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const handleRespond = async (inviteId: string, accept: boolean) => {
    setProcessingId(inviteId);
    try {
      const res = await fetch("/api/invite/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, accept }),
      });

      if (!res.ok) throw new Error("Failed to process invitation");

      const status = accept ? "accepted" : "declined";
      toast.success(`Invitation ${status} successfully`);

      setInvitations((prev) => prev.filter((i) => i.id !== inviteId));
      if (onAction) onAction();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading || invitations.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <h2 className="text-sm font-semibold text-neutral-400 flex items-center gap-2">
        <Mail className="w-4 h-4 text-purple-400" />
        Pending Invitations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invitations.map((invite) => (
          <div
            key={invite.id}
            className="p-4 bg-zinc-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl flex flex-col gap-4 shadow-xl shadow-purple-950/10"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500 [font-variant:small-caps] lowercase">
                Invite to join
              </span>
              <span className="text-md font-bold text-white truncate">
                {invite.tenant_name}
              </span>
              <span className="text-[10px] text-purple-400 uppercase font-semibold">
                Colaborate as {invite.role}
              </span>
            </div>

            <div className="flex flex-row gap-2">
              <Button
                onClick={() => handleRespond(invite.id, true)}
                disabled={!!processingId}
                variant="default"
                className="flex-1 h-9 bg-purple-600 hover:bg-purple-500 text-xs gap-2 rounded-xl"
              >
                {processingId === invite.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                Accept
              </Button>
              <Button
                onClick={() => handleRespond(invite.id, false)}
                disabled={!!processingId}
                variant="outline"
                className="flex-1 h-9 border-neutral-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-xs gap-2 rounded-xl"
              >
                <X className="w-3 h-3" />
                Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
