"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schema";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/ui/atoms/Button";
import { Input } from "@/app/ui/atoms/Input";
import { Github, LoaderCircle, User } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/app/ui/atoms/Separator";
import GoogleIcon from "@/app/ui/atoms/Icons/google";

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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2 flex-row">
            <User className="w-5 h-5" />
            Welcome back
          </h1>
          <span className="text-sm text-neutral-400">
            Sign in to your account to continue
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

        <Button disabled={loading} type="submit" className="w-full">
          {loading ? <LoaderCircle className="animate-spin" /> : "Login"}
        </Button>
      </form>
      <Link
        href="#"
        className="text-xs hover:underline w-full flex justify-end mt-4"
      >
        Forgot password?
      </Link>
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
