import { Menu } from "lucide-react";
import Logo from "../../atoms/Logo";

export default function Header() {
  return (
    <header className="flex flex-row justify-between items-center backdrop-blur-lg bg-neutral-950/10 items-center fixed top-0 right-0 w-full p-4 z-50">
      <Logo color="#F5F5F5" size={24} />
      <Menu className="text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer" />
    </header>
  );
}
