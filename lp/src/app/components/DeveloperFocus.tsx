import { Check } from "lucide-react";

const features = [
  "Open source by default",
  "No vendor lock-in",
  "Transparent architecture",
  "Fully self-hostable",
  "Minimal dependencies",
  "TypeScript-first",
];

const DeveloperFocus = () => (
  <section className="py-24 border-t border-border w-full mx-auto">
    <div className="flex flex-row justify-center container mx-auto px-6">
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center md:text-left md:mx-0">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Built from developers{" "}
          <span className="text-gradient-purple">to developers</span>
        </h2>
        <p className="text-muted-foreground mb-10 max-w-lg">
          Divisor is designed with the same principles you apply to your own
          infrastructure.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-x-12">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default DeveloperFocus;
