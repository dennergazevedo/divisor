"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../schema";
import { useAuth } from "@/contexts/AuthContext";
import { Github, LoaderCircle, UserRoundPlus } from "lucide-react";
import { Input } from "@/app/ui/atoms/Input";
import { Button } from "@/app/ui/atoms/Button";
import { Separator } from "@/app/ui/atoms/Separator";
import GoogleIcon from "@/app/ui/atoms/Icons/google";

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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2 flex-row">
            <UserRoundPlus className="w-5 h-5" />
            Create your account
          </h1>
          <span className="text-sm text-neutral-400">
            Get started with edge-native A/B testing in minutes
          </span>
        </div>

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
            <p className="ml-4 text-xs text-red-400">
              {errors.password.message}
            </p>
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
      <div className="mt-6 flex flex-col items-start justify-center gap-2 w-full">
        <div className="flex items-center gap-2 w-full">
          <Separator className="flex-1" />
          <p className="text-xs">or</p>
          <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2 w-full">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => alert("Disabled")}
          >
            <GoogleIcon />
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => alert("Disabled")}
          >
            <Github />
            Github
          </Button>
        </div>
      </div>
    </>
  );
}
