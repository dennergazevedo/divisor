"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schema";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/ui/atoms/Button";
import { Input } from "@/app/ui/atoms/Input";
import { LoaderCircle } from "lucide-react";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <h1 className="text-2xl font-semibold text-white mb-8">Login</h1>

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

      <Button disabled={loading} type="submit" className="w-full">
        {loading ? <LoaderCircle className="animate-spin" /> : "Login"}
      </Button>
    </form>
  );
}
