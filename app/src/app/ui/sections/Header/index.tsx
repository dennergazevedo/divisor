"use client";

import Logo from "../../atoms/Logo";
import Link from "next/link";
import { Button } from "../../atoms/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header
      className="
        fixed top-4 z-50 left-1/2 -translate-x-1/2
        flex items-center justify-between
        rounded-full
        backdrop-blur-lg bg-purple-400/10
        px-8 py-2 pr-4
        border-b-2
        border-b-purple-100/20
        max-w-[90%]
        md:max-w-5xl
        w-full
      "
    >
      <Link href="/">
        <Logo color="#F5F5F5" size={24} />
      </Link>
      <Link href="/" className="hidden md:flex flex-row items-center gap-2">
        <span className="[font-variant:small-caps] text-xl font-bold cursor-pointer">
          divisor
        </span>
      </Link>
      <div className="flex flex-row items-center gap-2">
        {user ? (
          <Link href="/dashboard" className="text-sm text-neutral-100">
            <Button variant="secondary">Dashboard</Button>
          </Link>
        ) : (
          <Link href="/auth" className="text-sm text-neutral-100">
            <Button variant="secondary">Login or Register</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
