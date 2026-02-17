"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../schema";
import { useAuth } from "@/contexts/AuthContext";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/app/ui/atoms/Input";
import { Button } from "@/app/ui/atoms/Button";

export default function RegisterForm() {
  const { register: registerUser, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    await registerUser({
      email: data.email,
      password: data.password,
      tenant: {
        name: data.tenantName,
        slug: data.tenantSlug,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <h1 className="text-2xl font-semibold text-white mb-8">Create account</h1>

      <div>
        <Input {...register("email")} placeholder="E-mail" />
        {errors.email && (
          <p className="ml-4 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          type="password"
          {...register("password")}
          placeholder="Password"
        />
        {errors.password && (
          <p className="ml-4 text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Input {...register("tenantName")} placeholder="Tenant name" />
        {errors.tenantName && (
          <p className="ml-4 text-xs text-red-400">
            {errors.tenantName.message}
          </p>
        )}
      </div>

      <div>
        <Input
          {...register("tenantSlug")}
          placeholder="Tenant URL (ex: https://divisor.dev)"
        />
        {errors.tenantSlug && (
          <p className="ml-4 text-xs text-red-400">
            {errors.tenantSlug.message}
          </p>
        )}
      </div>

      <Button disabled={loading} type="submit" className="w-full mt-2">
        {loading ? <LoaderCircle className="animate-spin" /> : "Register"}
      </Button>
    </form>
  );
}
