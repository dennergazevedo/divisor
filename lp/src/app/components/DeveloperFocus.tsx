"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

const DeveloperFocus = () => {
  const t = useTranslations("DeveloperFocus");

  const features = [
    t("features.0"),
    t("features.1"),
    t("features.2"),
    t("features.3"),
    t("features.4"),
    t("features.5"),
  ];

  return (
    <section
      id="implementation"
      className="py-24 border-t border-border w-full mx-auto"
    >
      <div className="flex flex-row justify-center container mx-auto px-6">
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center md:text-left md:mx-0">
          <h2 className="text-3xl sm:text-4xl text-center font-bold tracking-tight mb-4">
            {t("title")}{" "}
            <span className="text-gradient-purple">{t("titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg text-center">
            {t("description")}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-x-12">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600/10">
                  <Check className="h-3 w-3 text-purple-600" />
                </div>
                <span className="text-foreground">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DeveloperFocus;
