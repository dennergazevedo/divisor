import { ArrowRight } from "lucide-react";
import Link from "next/link";

const FinalCTA = () => (
  <section className="relative py-32 border-t border-border overflow-hidden">
    <div className="absolute inset-0 hero-glow" />
    <div className="relative container mx-auto px-6 text-center">
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
        Experiment at the edge.
        <br />
        <span className="text-gradient-purple">Scale without limits.</span>
      </h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
        <Link href="https://app.divisor.dev">
          <button className="group cursor-pointer flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-purple-600-foreground hover:bg-purple-600/90 transition-colors">
            Start Building
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </Link>
        <Link href="https://docs.divisor.dev" target="_blank">
          <button className="rounded-lg border cursor-pointer border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-purple-600/50 transition-colors">
            Read the Docs
          </button>
        </Link>
      </div>
    </div>
  </section>
);

export default FinalCTA;
