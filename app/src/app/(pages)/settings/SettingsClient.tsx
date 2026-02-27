/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/ui/atoms/Button";
import { Separator } from "@/app/ui/atoms/Separator";
import { toast } from "sonner";
import { Crown, Settings, Mail, User as UserIcon, Lock } from "lucide-react";
import Link from "next/link";

export default function SettingsClient() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      toast.success("Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h1 className="text-xl font-bold flex flex-row items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          General Settings
        </h1>
        <p className="text-sm text-neutral-400">
          Manage your account and preferences
        </p>
      </div>

      <Separator />

      <div className="flex flex-col w-full space-y-8">
        {/* Profile Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-neutral-200">Profile</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">
                  Full Name
                </p>
                <p className="text-sm text-neutral-200">
                  {user?.name || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">
                  Email Address
                </p>
                <p className="text-sm text-neutral-200">{user?.email}</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Subscription Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-neutral-200">
            Subscription Plan
          </h2>
          <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                  {user?.current_plan || "Free"} Plan
                </p>
                <p className="text-sm text-neutral-200">
                  {user?.current_plan === "free"
                    ? "You are using the free version."
                    : "Your plan is active."}
                </p>
              </div>
            </div>
            {user?.current_plan === "free" ? (
              <Link href="https://www.divisor.dev/#pricing">
                <Button>
                  <Crown />
                  Upgrade your plan
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                  Expires at
                </p>
                <p className="text-sm font-semibold text-purple-400">
                  {user?.expiration_date
                    ? new Date(user.expiration_date).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
            )}
          </div>
        </section>

        <Separator />

        {/* Password Section */}
        <section className="space-y-4 max-w-lg">
          <h2 className="text-sm font-semibold text-neutral-200">Security</h2>

          {user?.provider_id ? (
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-200">
                  Connected with Google
                </p>
                <p className="text-xs text-neutral-400">
                  You are using Google auth. Password changes are managed by
                  Google.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="password"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                      placeholder="••••••••"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                      placeholder="Minimum 8 characters"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="password"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                      placeholder="Confirm your new password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
