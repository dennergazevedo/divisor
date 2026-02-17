"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schema";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {
  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    await login(data.email, data.password);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Entrar</h1>

      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full rounded-md bg-neutral-800 px-4 py-3 text-white outline-none"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Senha"
          className="w-full rounded-md bg-neutral-800 px-4 py-3 text-white outline-none"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <button
        disabled={loading}
        className="w-full rounded-md bg-white py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
