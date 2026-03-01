"use client";

import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function TermsOfService() {
  const t = useTranslations("Terms");
  const locale = useLocale();

  const formattedDate = new Date().toLocaleDateString(
    locale === "pt" ? "pt-BR" : "en-US",
  );

  return (
    <div className="min-h-screen bg-background text-neutral-100 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-400 transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          {t("back")}
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mb-12">
          {t("lastUpdated", { date: formattedDate })}
        </p>

        <div className="space-y-12 prose prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              {t("s1.title")}
            </h2>
            <p>{t("s1.p")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              {t("s2.title")}
            </h2>
            <p>{t("s2.p")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>{t("s2.free").split(":")[0]}:</strong>{" "}
                {t("s2.free").split(":")[1]}
              </li>
              <li>
                <strong>{t("s2.growth").split(":")[0]}:</strong>{" "}
                {t("s2.growth").split(":")[1]}
              </li>
              <li>
                <strong>{t("s2.pro").split(":")[0]}:</strong>{" "}
                {t("s2.pro").split(":")[1]}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              {t("s3.title")}
            </h2>
            <div className="space-y-4">
              <p>
                <strong>{t("s3.monthly").split(":")[0]}:</strong>{" "}
                {t("s3.monthly").split(":")[1]}
              </p>
              <p>
                <strong>{t("s3.annual").split(":")[0]}:</strong>{" "}
                {t("s3.annual").split(":")[1]}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              {t("s4.title")}
            </h2>
            <p>{t("s4.p")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              {t("s5.title")}
            </h2>
            <p>{t("s5.p")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              {t("s6.title")}
            </h2>
            <p>{t("s6.p")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              {t("s7.title")}
            </h2>
            <p>{t("s7.p")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              {t("s8.title")}
            </h2>
            <p>{t("s8.p")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              {t("s9.title")}
            </h2>
            <p>{t("s9.p")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
