import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  newTab?: boolean;
  disabled?: boolean;
}

export function MenuLink({
  href,
  icon: Icon,
  label,
  newTab,
  disabled,
}: MenuLinkProps) {
  return (
    <Link
      href={href}
      target={newTab ? "_blank" : "_self"}
      className={cn(
        "flex rounded-md flex-row items-center gap-2 text-neutral-100 transition-colors px-6 py-2 hover:bg-zinc-900",
        disabled && "opacity-20 cursor-not-allowed",
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-sm">{label}</span>
      {disabled && (
        <span className="[font-variant=small-caps] text-xs bg-purple-600 px-2 py-0 rounded-full text-neutral-100">
          soon
        </span>
      )}
    </Link>
  );
}
