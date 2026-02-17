import { Button } from "../../atoms/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-6 py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          Edge-first A/B testing
          <br />
          <span className="text-purple-400">without complexity</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-neutral-400 text-lg">
          Divisor is an open-source platform for A/B testing and feature flags,
          designed to run at the edge with minimal cost and massive scale.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Button>Get started</Button>

          <Button variant="outline">View on GitHub</Button>
        </div>
      </div>
    </section>
  );
}
