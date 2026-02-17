"use client";

import { useState } from "react";
import LoginForm from "./login";
import RegisterForm from "./register";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="w-full max-w-md rounded-xl bg-neutral-900 p-8 shadow-lg">
      {mode === "login" ? (
        <>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-neutral-400">
            Não tem conta?{" "}
            <button
              className="text-white underline"
              onClick={() => setMode("register")}
            >
              Criar conta
            </button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-neutral-400">
            Já tem conta?{" "}
            <button
              className="text-white underline"
              onClick={() => setMode("login")}
            >
              Fazer login
            </button>
          </p>
        </>
      )}
    </div>
  );
}
