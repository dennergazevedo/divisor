import { Github, Scale, Users, Puzzle } from "lucide-react";
import { getTranslations } from "next-intl/server";

const OpenSourceSection = async () => {
  const t = await getTranslations("OpenSource");

  return (
    <section id="open-source" className="py-24 border-t border-border">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {t("title")}{" "}
          <span className="text-gradient-purple">{t("titleHighlight")}</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-12">
          {t("description")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-purple-600" />
            {t("license")}
          </div>
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-purple-600" />
            {t("repository")}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            {t("community")}
          </div>
          <div className="flex items-center gap-2">
            <Puzzle className="h-4 w-4 text-purple-600" />
            {t("extensible")}
          </div>
        </div>
        <a
          href="https://github.com/dennergazevedo/divisor"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-purple-600/50 transition-colors"
        >
          <Github className="h-4 w-4" />
          {t("cta")}
        </a>
      </div>
    </section>
  );
};

export default OpenSourceSection;
