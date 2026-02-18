"use client";

import { useState } from "react";
import { Button } from "@/app/ui/atoms/Button";
import { Input } from "@/app/ui/atoms/Input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/app/ui/molecules/Dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/app/ui/molecules/Select";
import { Send, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Role = "admin" | "member";

export default function InviteMemberDialog() {
  const { selectedTenant } = useAuth();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [loading, setLoading] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedTenant || !email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/invite/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tenantId: selectedTenant.id,
          email,
          role,
        }),
      });

      if (!res.ok) {
        throw await res.json();
      }

      setEmail("");
      setRole("member");
      setOpen(false);
      toast.success("Invite sent successfully");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send invite");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleInvite}>
          <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>
            <DialogDescription>
              Send an invitation to join this workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-neutral-400">Email</label>
              <Input
                type="email"
                placeholder="user@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-neutral-400">Role</label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as Role)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6 grid grid-cols-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={loading}>
              <Send />
              {loading ? "Sending..." : "Send invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
