import { Metadata } from "next";

const BASE_URL = "https://www.divisor.dev";

export function getAlternates(locale: string, path: string = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const finalPath = cleanPath === "/" ? "" : cleanPath;

  return {
    canonical: `${BASE_URL}/${locale}${finalPath}`,
    languages: {
      en: `${BASE_URL}/en${finalPath}`,
      "pt-BR": `${BASE_URL}/pt${finalPath}`,
      "x-default": `${BASE_URL}/en${finalPath}`,
    },
  };
}

export function constructMetadata({
  title,
  description,
  locale,
  path = "",
}: {
  title?: string;
  description?: string;
  locale: string;
  path?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: getAlternates(locale, path),
  };
}
