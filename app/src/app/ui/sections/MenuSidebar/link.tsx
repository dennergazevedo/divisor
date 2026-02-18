import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface MenuLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  newTab?: boolean;
}

export function MenuLink({ href, icon: Icon, label, newTab }: MenuLinkProps) {
  return (
    <Link
      href={href}
      target={newTab ? "_blank" : "_self"}
      className="flex rounded-md flex-row items-center gap-2 text-neutral-100 transition-colors px-6 py-2 hover:bg-zinc-900"
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-sm">{label}</span>
    </Link>
  );
}
