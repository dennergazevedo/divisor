import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export default function Card({ title, description, icon: Icon }: CardProps) {
  return (
    <div className="rounded-xl border border-neutral-900 bg-zinc-900 p-6 border-b-4 border-b-purple-600 shadow-lg shadow-purple-600/20">
      <h3 className="text-lg font-medium text-purple-400 flex flex-row gap-2 items-center">
        {Icon && <Icon className="w-4 h-4" />}
        {title}
      </h3>
      <p className="mt-2 text-sm text-neutral-400">{description}</p>
    </div>
  );
}
