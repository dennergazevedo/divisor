import { FileCode, Flame, Gem, Github, Zap } from "lucide-react";
import Card from "./ui/molecules/Card";
import Hero from "./ui/sections/Hero";
import Step from "./ui/molecules/Step";
import { Button } from "./ui/atoms/Button";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 w-full">
      <Hero />

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          <Card
            icon={Zap}
            title="Edge-native"
            description="Decisions happen at the edge using deterministic hashing. No backend bottlenecks, no latency penalties."
          />

          <Card
            icon={Flame}
            title="Stateless by design"
            description="Sticky sessions without sessions. No user storage, no cookies required, no sync issues."
          />

          <Card
            icon={Gem}
            title="Minimal cost"
            description="Built to scale to millions of users using Redis and edge functions — without expensive infra."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-neutral-900 bg-neutral-950/50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-3xl font-semibold tracking-tight">
            How Divisor works
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Step
              index="01"
              title="Create a test"
              description="Define your test, variants and traffic split using the Divisor dashboard."
            />

            <Step
              index="02"
              title="Fetch at the edge"
              description="The SDK requests the active test configuration directly from an edge function."
            />

            <Step
              index="03"
              title="Deterministic split"
              description="Users are assigned to variants using a deterministic hash — always consistent."
            />

            <Step
              index="04"
              title="Scale infinitely"
              description="No sessions, no per-user storage. Just math, cache and edge infrastructure."
            />
          </div>
        </div>
      </section>

      {/* OPEN SOURCE */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Open source by default
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-neutral-400">
          Divisor is fully open source. Self-host it, fork it, or build on top
          of it. No vendor lock-in.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="secondary">
            <FileCode />
            Documentation
          </Button>

          <Button variant="outline">
            <Github />
            Repository
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900">
        <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <span>© {new Date().getFullYear()} Divisor</span>
          <span>Edge-first A/B testing</span>
        </div>
      </footer>
    </main>
  );
}
