import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const FinalCTA = async () => {
  const t = await getTranslations("FinalCTA");

  return (
    <section className="relative py-32 border-t border-border overflow-hidden">
      <div className="absolute inset-0 hero-glow rotate" />
      <div className="relative container mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
          {t("title")}
          <br />
          <span className="text-gradient-purple">{t("subtitle")}</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link href="https://app.divisor.dev">
            <button className="group cursor-pointer flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-purple-600-foreground hover:bg-purple-600/90 transition-colors">
              {t("start")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <Link href="https://docs.divisor.dev" target="_blank">
            <button className="rounded-lg border cursor-pointer border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-purple-600/50 transition-colors">
              {t("docs")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
