"use client";

import { useState } from "react";
import LoginForm from "./login";
import RegisterForm from "./register";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="w-full max-w-[90%] md:max-w-md rounded-xl bg-neutral-950 backdrop-blur-xl border-b-4 shadow-xl shadow-purple-800/10 border-b-purple-800 p-8 shadow-lg">
      {mode === "login" ? (
        <>
          <LoginForm />
          <p className="w-full mt-8 text-center w-full text-sm">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => setMode("register")}
              className="text-purple-600 ml-1 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </>
      ) : (
        <>
          <RegisterForm />
          <p className="w-full mt-8 text-center w-full text-sm">
            Already have an account?{" "}
            <span
              onClick={() => setMode("login")}
              className="text-purple-600 ml-1 cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </>
      )}
    </div>
  );
}
