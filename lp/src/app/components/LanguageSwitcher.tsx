"use client";

import { useLocale } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(nextLocale: string) {
    router.replace(
      // @ts-expect-error -- pathname is typesafe
      { pathname, params },
      { locale: nextLocale },
    );
  }

  return (
    <div className="flex items-center gap-1 bg-secondary/30 rounded-lg p-1 border border-border/50">
      {routing.locales.map((cur) => (
        <button
          key={cur}
          onClick={() => onSelectChange(cur)}
          className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
            locale === cur
              ? "bg-purple-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          {cur === "pt" ? "PT-BR" : "EN"}
        </button>
      ))}
    </div>
  );
}
