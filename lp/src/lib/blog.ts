import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  content: string;
}

export function getPostBySlug(slug: string, locale: string = "pt"): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.md$/, "");

    // First try the localized file (e.g., post.pt.md or post.en.md)
    let fullPath = path.join(contentDir, `${realSlug}.${locale}.md`);

    if (!fs.existsSync(fullPath)) {
      // Fallback to exactly what the slug is (in case of legacy files)
      fullPath = path.join(contentDir, `${realSlug}.md`);
      if (!fs.existsSync(fullPath)) {
        return null;
      }
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: realSlug,
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author,
      content,
    };
  } catch (e) {
    return null;
  }
}

export function getAllPosts(locale: string = "pt"): BlogPost[] {
  try {
    const files = fs.readdirSync(contentDir);
    const posts: BlogPost[] = [];
    const processedSlugs = new Set<string>();

    for (const file of files) {
      if (!file.endsWith(".md")) continue;

      // Extract the base slug by removing any .locale.md or .md
      const baseSlug = file.replace(/\.(pt|en)?\.?md$/, "");

      if (processedSlugs.has(baseSlug)) continue;

      const post = getPostBySlug(baseSlug, locale);
      if (post) {
        posts.push(post);
        processedSlugs.add(baseSlug);
      }
    }

    return posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  } catch (e) {
    return [];
  }
}
