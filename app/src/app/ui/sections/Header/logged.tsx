"use client";
import { Bell, LoaderCircle } from "lucide-react";
import { Button } from "../../atoms/Button";
import Logo from "../../atoms/Logo";
import { useAuth } from "@/contexts/AuthContext";

export default function LoggedHeader() {
  const { logout, loading } = useAuth();

  return (
    <div className="z-10 fixed top-0 w-full p-2 px-8 bg-zinc-900 border-b border-neutral-800 flex flex-row items-center justify-between gap-2">
      <div className="flex flex-row items-center gap-2">
        <div className="hidden md:flex flex-row items-center gap-2">
          <Logo color="#A1A1A1" size={20} />
          <span className="[font-variant:small-caps] text-neutral-400 cursor-default">
            divisor
          </span>
        </div>
      </div>
      <div className="flex flex-row items-center gap-8">
        <Button variant="ghost" className="py-0 px-0 has-[>svg]:px-0 w-fit">
          <Bell className="w-4 h-4" />
        </Button>
        <Button
          onClick={logout}
          variant="ghost"
          className="py-0 px-0 has-[>svg]:px-0 w-fit"
        >
          {loading ? (
            <LoaderCircle className="animate-spin text-neutral-100" />
          ) : (
            "Logout"
          )}
        </Button>
      </div>
    </div>
  );
}
