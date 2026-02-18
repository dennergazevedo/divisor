const steps = [
  {
    number: "01",
    title: "Create a test",
    description:
      "Define your experiment in the dashboard with variants and traffic allocation.",
  },
  {
    number: "02",
    title: "SDK fetches config",
    description:
      "The client SDK retrieves the test configuration from the edge.",
  },
  {
    number: "03",
    title: "Deterministic hash",
    description:
      "A mathematical hash assigns the user to a variant — no randomness.",
  },
  {
    number: "04",
    title: "Variant returned",
    description: "The correct variant is returned instantly at the edge.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 border-t border-border">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          How it works
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Four steps. No complexity.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={step.number} className="relative">
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
            )}
            <div className="relative z-10">
              <span className="text-xs font-mono text-purple-600 mb-3 block">
                {step.number}
              </span>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
