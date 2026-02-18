import Link from "next/link";
import { Button } from "../../atoms/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-6 md:px-0 py-32 pt-40 md:pt-48 text-center">
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
          <Link
            href="https://docs.divisor.dev/docs/get-started"
            target="_blank"
          >
            <Button>Get started</Button>
          </Link>

          <Link
            href="https://github.com/dennergazevedo/divisor"
            target="_blank"
          >
            <Button variant="outline">View on GitHub</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
