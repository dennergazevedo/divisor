const flowSteps = [
  {
    title: "Client SDK",
    description: "Browser / Server",
  },
  {
    title: "Edge Function",
    description: "Low-latency decision",
  },
  {
    title: "Redis",
    description: "Config + counters",
  },
  {
    title: "Variant decision",
    description: "Returned instantly",
  },
];

const ArchitectureSection = () => (
  <section id="architecture" className="py-24 border-t border-border">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Architecture
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Simple, predictable, and designed for the edge.
        </p>
      </div>
      <div className="max-w-xl mx-auto mb-12">
        <div className="flex flex-col items-center gap-3">
          {flowSteps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center">
              <div className="rounded-lg border border-border bg-card px-8 py-3 text-sm font-medium text-foreground w-64 text-center">
                {step.title}
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {i < flowSteps.length - 1 && (
                <div className="h-6 w-px bg-gradient-to-b from-purple-600/60 to-border" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-lg mx-auto">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="ml-3 text-xs text-muted-foreground font-mono">
              deterministic-hash.ts
            </span>
          </div>
          <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto">
            <code>
              <span className="text-muted-foreground">
                {"// Deterministic variant assignment"}
              </span>
              {"\n"}
              <span className="text-purple-600">const</span>{" "}
              <span className="text-foreground">bucket</span>{" "}
              <span className="text-muted-foreground">=</span>{" "}
              <span className="text-foreground">hash</span>
              <span className="text-muted-foreground">(</span>
              <span className="text-foreground">userId</span>{" "}
              <span className="text-muted-foreground">+</span>{" "}
              <span className="text-foreground">testName</span>
              <span className="text-muted-foreground">)</span>{" "}
              <span className="text-muted-foreground">%</span>{" "}
              <span className="text-purple-600">100</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  </section>
);

export default ArchitectureSection;
