import { Metadata } from "next";
import { getAlternates } from "@/lib/metadata";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });

  return {
    title: t("title"),
    alternates: getAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Privacy");

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
            <div className="space-y-4">
              <p>
                <strong>{t("s2.account").split(":")[0]}:</strong>{" "}
                {t("s2.account").split(":")[1]}
              </p>
              <p>
                <strong>{t("s2.usage").split(":")[0]}:</strong>{" "}
                {t("s2.usage").split(":")[1]}
              </p>
              <p>
                <strong>{t("s2.experiment").split(":")[0]}:</strong>{" "}
                {t("s2.experiment").split(":")[1]}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              {t("s3.title")}
            </h2>
            <p>{t("s3.p")}</p>
            <div className="bg-purple-500/5 border border-purple-500/20 p-6 rounded-lg mt-4">
              <p className="text-sm italic">
                <strong>{t("s3.note").split(":")[0]}:</strong>{" "}
                {t("s3.note").split(":")[1]}
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
            <p>
              {t("s6.p")}{" "}
              <Link
                href="https://app.divisor.dev/support"
                className="text-purple-400 hover:underline"
              >
                app.divisor.dev/support
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
