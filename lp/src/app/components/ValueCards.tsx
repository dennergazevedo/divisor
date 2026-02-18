import { Globe, Fingerprint, Hash, Zap } from "lucide-react";

const cards = [
  {
    icon: Globe,
    title: "Edge-native",
    description:
      "Decisions happen at the edge using deterministic hashing. No centralized bottlenecks.",
  },
  {
    icon: Fingerprint,
    title: "Stateless by design",
    description:
      "Sticky sessions without sessions. No per-user storage required.",
  },
  {
    icon: Hash,
    title: "Deterministic traffic splitting",
    description:
      "Users are assigned to variants using mathematical hashing — always consistent.",
  },
  {
    icon: Zap,
    title: "Built for scale",
    description:
      "Designed to handle millions of users with Redis and edge functions.",
  },
];

const ValueCards = () => (
  <section id="why-divisor" className="py-24 border-t border-border">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Why Divisor
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          A fundamentally different approach to A/B testing infrastructure.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group rounded-xl border border-border bg-card p-6 hover:border-purple-600/40 hover:glow-purple-sm transition-all duration-300"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/10">
              <card.icon className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ValueCards;
