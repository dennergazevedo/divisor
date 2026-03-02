"use client";

import { useState } from "react";
import { Github, Menu, X } from "lucide-react";
import Logo from "./ui/logo";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const t = useTranslations("Navbar");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/20 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-purple-600 flex items-center justify-center">
              <Logo color="#FFF" size={16} />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              Divisor
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link
            href="/#why-divisor"
            className="hover:text-foreground transition-colors"
          >
            {t("whyDivisor")}
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-foreground transition-colors"
          >
            {t("howItWorks")}
          </Link>
          <Link
            href="/#pricing"
            className="hover:text-foreground transition-colors"
          >
            {t("pricing")}
          </Link>
          <Link
            href="/#implementation"
            className="hover:text-foreground transition-colors"
          >
            {t("implementation")}
          </Link>
          <Link
            href="/blog"
            className="hover:text-foreground transition-colors"
          >
            {t("blog")}
          </Link>
          <Link
            href="/#faq"
            className="hover:text-foreground transition-colors"
          >
            {t("faq")}
          </Link>
        </div>

        <div className="flex flex-row items-center gap-4">
          {/* Desktop Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          <div className="flex flex-row items-center gap-2">
            <a
              href="https://app.divisor.dev/"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-muted-foreground transition-all hover:text-neutral-100 hover:drop-shadow-md hover:drop-shadow-purple-900"
            >
              <span>{t("login")}</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border py-6 px-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 text-sm text-muted-foreground">
              <Link
                href="/#why-divisor"
                onClick={toggleMenu}
                className="hover:text-foreground transition-colors py-2"
              >
                {t("whyDivisor")}
              </Link>
              <Link
                href="/#how-it-works"
                onClick={toggleMenu}
                className="hover:text-foreground transition-colors py-2"
              >
                {t("howItWorks")}
              </Link>
              <Link
                href="/#pricing"
                onClick={toggleMenu}
                className="hover:text-foreground transition-colors py-2"
              >
                {t("pricing")}
              </Link>
              <Link
                href="/#implementation"
                onClick={toggleMenu}
                className="hover:text-foreground transition-colors py-2"
              >
                {t("implementation")}
              </Link>
              <Link
                href="/blog"
                onClick={toggleMenu}
                className="hover:text-foreground transition-colors py-2"
              >
                {t("blog")}
              </Link>
              <Link
                href="/#faq"
                onClick={toggleMenu}
                className="hover:text-foreground transition-colors py-2"
              >
                {t("faq")}
              </Link>
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t("language")}
              </span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
