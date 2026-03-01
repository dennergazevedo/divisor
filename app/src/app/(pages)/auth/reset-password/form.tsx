"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/ui/atoms/Button";
import { Input } from "@/app/ui/atoms/Input";
import { LoaderCircle, KeyRound, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password");
      }

      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Password reset!</h2>
        <p className="text-sm text-neutral-400">
          Your password has been successfully updated. You can now log in with
          your new password.
        </p>
        <div className="pt-6">
          <Link
            href="/auth"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-white">Invalid Link</h2>
        <p className="text-sm text-neutral-400">
          This password reset link is invalid or has expired.
        </p>
        <div className="pt-6">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-purple-600 hover:underline"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2 flex-row">
          <KeyRound className="w-5 h-5" />
          Reset password
        </h1>
        <span className="text-sm text-neutral-400">
          Enter your new password below.
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            {...register("password")}
            placeholder="New Password"
            type="password"
          />
          {errors.password && (
            <p className="ml-4 text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Input
            {...register("confirmPassword")}
            placeholder="Confirm New Password"
            type="password"
          />
          {errors.confirmPassword && (
            <p className="ml-4 text-xs text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button disabled={loading} type="submit" className="w-full">
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
}
