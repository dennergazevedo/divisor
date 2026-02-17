"use client";

import { useState } from "react";
import LoginForm from "./login";
import RegisterForm from "./register";
import { Separator } from "@/app/ui/atoms/Separator";
import Link from "next/link";
import { Button } from "@/app/ui/atoms/Button";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="w-full max-w-[90%] md:max-w-md rounded-xl bg-neutral-400/10 backdrop-blur-xl border-b-4 shadow-xl shadow-purple-800/10 border-b-purple-800 p-8 shadow-lg">
      {mode === "login" ? (
        <>
          <LoginForm />
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
            <Button
              variant="secondary"
              onClick={() => setMode("register")}
              className="w-full mt-2"
            >
              Create account
            </Button>
          </div>
        </>
      ) : (
        <>
          <RegisterForm />
          <div className="mt-6 flex flex-col items-start justify-center gap-2 w-full">
            <div className="flex items-center gap-2 w-full">
              <Separator className="flex-1" />
              <p className="text-xs">Have account?</p>
              <Separator className="flex-1" />
            </div>
            <Button
              variant="secondary"
              onClick={() => setMode("login")}
              className="w-full mt-2"
            >
              Login
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
