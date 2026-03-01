"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/ui/atoms/Button";
import { Input } from "@/app/ui/atoms/Input";
import { LoaderCircle, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset email");
      }

      setSubmitted(true);
      toast.success("Reset link sent!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 text-purple-500 mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Check your email</h2>
        <p className="text-sm text-neutral-400">
          We&apos;ve sent a password reset link to your email address.
        </p>
        <div className="pt-6">
          <Link
            href="/auth"
            className="text-sm text-purple-600 hover:underline flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2 flex-row">
          <Mail className="w-5 h-5" />
          Forgot password?
        </h1>
        <span className="text-sm text-neutral-400">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input {...register("email")} placeholder="E-mail" type="email" />
          {errors.email && (
            <p className="ml-4 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <Button disabled={loading} type="submit" className="w-full">
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/auth"
          className="text-sm text-purple-600 hover:underline flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
