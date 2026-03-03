import { ArrowRight, TestTubeDiagonal } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const HeroSection = async () => {
  const t = await getTranslations("Hero");

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
          {t("badge")}
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          <span className="text-gradient-purple">{t("title1")}</span>{" "}
          <br className="hidden sm:block" />
          {t("title2")}
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
          {t("description")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="https://app.divisor.dev">
            <button className="group cursor-pointer flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-purple-600-foreground hover:bg-purple-600/90 transition-colors">
              {t("getStarted")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <Link
            href="/#pricing"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-purple-600/50 transition-colors"
          >
            <TestTubeDiagonal className="h-4 w-4" />
            {t("tryForFree")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
