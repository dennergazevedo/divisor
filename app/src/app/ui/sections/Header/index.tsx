import Logo from "../../atoms/Logo";
import Link from "next/link";
import { Button } from "../../atoms/Button";

export default function Header() {
  return (
    <header
      className="
        sticky top-4 z-50
        mx-4
        flex items-center justify-between
        rounded-full
        backdrop-blur-lg bg-purple-400/10
        px-8 py-2 pr-4
        border-b-2
        border-b-purple-100/20
      "
    >
      <Logo color="#F5F5F5" size={24} />
      <Link href="/" className="flex flex-row items-center gap-2">
        <span className="[font-variant:small-caps] text-xl font-bold cursor-pointer">
          divisor
        </span>
      </Link>
      <div className="flex flex-row items-center gap-2">
        <Link href="/dashboard" className="text-sm text-neutral-100">
          <Button variant="secondary">Dashboard</Button>
        </Link>
      </div>
    </header>
  );
}
