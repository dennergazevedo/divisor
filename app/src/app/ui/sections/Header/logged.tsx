"use client";

import { Bell, Check, X } from "lucide-react";
import { Button } from "../../atoms/Button";
import Logo from "../../atoms/Logo";
import { useAuth } from "@/contexts/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../molecules/Popover";
import { useState } from "react";
import { SidebarTrigger } from "../../organisms/Sidebar";

export default function LoggedHeader() {
  const { invites } = useAuth();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleRespond = async (inviteId: string, accept: boolean) => {
    setIsProcessing(inviteId);
    try {
      const res = await fetch("/api/invite/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, accept }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } finally {
      setIsProcessing(null);
    }
  };

  console.log("invites", invites);

  return (
    <div className="z-50 fixed top-0 w-full p-2 px-8 bg-zinc-900 border-b border-neutral-800 flex flex-row items-center justify-between gap-2">
      <SidebarTrigger className="md:hidden px-0! left-4 px-0 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12" />
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-purple-600 flex items-center justify-center">
          <Logo color="#FFF" size={16} />
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight">
          Divisor
        </span>
      </div>
      <div className="flex flex-row items-center gap-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="relative py-0 px-0 has-[>svg]:px-0 w-fit"
            >
              <Bell className="w-4 h-4" />
              {invites.length > 0 && (
                <span className="absolute top-2 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-purple-600 text-[8px] font-bold text-white">
                  {invites.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 rounded-md">
            <div className="space-y-4">
              <h4 className="font-medium leading-none text-neutral-200">
                Notifications
              </h4>
              <div className="grid gap-4">
                {invites.length === 0 ? (
                  <p className="text-xs text-neutral-500 text-center py-4">
                    No new notifications
                  </p>
                ) : (
                  invites.map((invite) => (
                    <div
                      key={invite.id}
                      className="grid gap-1 p-2 rounded-sm bg-white/5 border border-white/10"
                    >
                      <p className="text-xs font-medium text-neutral-200">
                        Invite to collaborate on{" "}
                        <span className="text-purple-400">
                          {invite.tenant_name}
                        </span>
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        Role: {invite.role}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="xs"
                          onClick={() => handleRespond(invite.id, true)}
                          disabled={isProcessing === invite.id}
                        >
                          <Check className="w-3 h-3" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleRespond(invite.id, false)}
                          disabled={isProcessing === invite.id}
                        >
                          <X className="w-3 h-3" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
