import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://www.divisor.dev";
const LOCALES = ["en", "pt"];
const STATIC_ROUTES = ["", "/blog", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [];

  // Static routes for each locale
  for (const locale of LOCALES) {
    for (const route of STATIC_ROUTES) {
      routes.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  // Blog posts for each locale
  for (const locale of LOCALES) {
    const posts = getAllPosts(locale);
    for (const post of posts) {
      routes.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  return routes;
}
