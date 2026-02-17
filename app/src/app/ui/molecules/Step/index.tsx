interface StepProps {
  index: string;
  title: string;
  description: string;
}

export default function Step({ index, title, description }: StepProps) {
  return (
    <div className="group relative rounded-2xl border border-neutral-800 border-l-4 border-l-purple-600 shadow-lg shadow-purple-600/20 bg-zinc-900/80 p-6 transition-all duration-300 hover:border-neutral-700 hover:bg-zinc-900/80">
      {/* Index */}
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10 text-sm font-medium text-purple-400 ring-1 ring-purple-500/30">
          {index}
        </span>

        <h3 className="text-lg font-medium text-neutral-100">{title}</h3>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-neutral-400">
        {description}
      </p>

      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
