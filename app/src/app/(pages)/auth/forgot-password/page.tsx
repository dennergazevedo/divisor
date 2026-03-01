import { Background } from "@/app/ui/atoms/Background";
import ForgotPasswordForm from "./form";

export default function ForgotPasswordPage() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <Background />
      <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center items-center md:p-16">
        <div className="relative container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Open source &middot; Edge-native &middot; Stateless
          </div>
          <h1 className="mx-auto max-w-4xl flex flex-col text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="text-gradient-purple">Recovery</span>
            <span>Password</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
            Divisor is an open-source, stateless A/B testing and feature flag
            platform designed to scale to millions of users with minimal
            infrastructure.
          </p>
        </div>
        <div className="w-full max-w-[90%] md:max-w-md rounded-xl bg-neutral-950 backdrop-blur-xl border-b-4 shadow-xl shadow-purple-800/10 border-b-purple-800 p-8 shadow-lg">
          <ForgotPasswordForm />
        </div>
      </div>
    </section>
  );
}
