"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../schema";
import { useAuth } from "@/contexts/AuthContext";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Criar conta</h1>

      <input
        {...register("email")}
        placeholder="Email"
        className="w-full rounded-md bg-neutral-800 px-4 py-3 text-white"
      />
      {errors.email && (
        <p className="text-sm text-red-400">{errors.email.message}</p>
      )}

      <input
        type="password"
        {...register("password")}
        placeholder="Senha"
        className="w-full rounded-md bg-neutral-800 px-4 py-3 text-white"
      />
      {errors.password && (
        <p className="text-sm text-red-400">{errors.password.message}</p>
      )}

      <input
        {...register("tenantName")}
        placeholder="Nome da empresa"
        className="w-full rounded-md bg-neutral-800 px-4 py-3 text-white"
      />
      {errors.tenantName && (
        <p className="text-sm text-red-400">{errors.tenantName.message}</p>
      )}

      <input
        {...register("tenantSlug")}
        placeholder="Slug (ex: minha-empresa)"
        className="w-full rounded-md bg-neutral-800 px-4 py-3 text-white"
      />
      {errors.tenantSlug && (
        <p className="text-sm text-red-400">{errors.tenantSlug.message}</p>
      )}

      <button
        disabled={loading}
        className="w-full rounded-md bg-white py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
      >
        {loading ? "Criando..." : "Criar conta"}
      </button>
    </form>
  );
}
