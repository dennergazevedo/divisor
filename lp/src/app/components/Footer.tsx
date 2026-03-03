import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const Footer = async () => {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Info */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
            >
              DIVISOR
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("description")}
            </p>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-neutral-100">{t("platform")}</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="https://app.divisor.dev/auth"
                  className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  {t("login")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  {t("pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://docs.divisor.dev"
                  className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  {t("documentation")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/dennergazevedo/divisor"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  {t("github")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  {t("blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-neutral-100">{t("support")}</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="https://app.divisor.dev/support"
                  className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://docs.divisor.dev/docs/sdk/intro"
                  className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  {t("tutorials")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://docs.divisor.dev/docs/concepts/ab-testing"
                  className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  {t("abTesting")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {t("copyright", { year: new Date().getFullYear() })}
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
            >
              {t("terms")}
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
            >
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
