import { FileCode, User } from "lucide-react";
import Logo from "../../atoms/Logo";
import Link from "next/link";
import { Button } from "../../atoms/Button";

export default function Header() {
  return (
    <header className="flex flex-row justify-between items-center backdrop-blur-lg bg-zinc-900/10 items-center sticky w-full top-0 right-0 w-full p-4 px-8 z-50">
      <Logo color="#F5F5F5" size={24} />
      <div className="flex flex-row items-center gap-2">
        <Link href="#" className="text-sm text-neutral-100">
          <Button variant="outline">
            <FileCode />
            Documentation
          </Button>
        </Link>
        <Link href="/dashboard" className="text-sm text-neutral-100">
          <Button variant="outline">
            <User />
            Dashboard
          </Button>
        </Link>
      </div>
    </header>
  );
}
