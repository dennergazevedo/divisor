import { getAllPosts } from "@/lib/blog";
import { Link } from "@/i18n/routing";
import { Metadata } from "next";

import { getAlternates } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Blog",
    description: "Leia as últimas novidades e tutoriais sobre Testes A/B.",
    alternates: getAlternates(locale, "/blog"),
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogList({ params }: Props) {
  const { locale } = await params;
  const posts = getAllPosts(locale);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Newspaper Masthead */}
        <div className="border-y-2 border-foreground py-8 mb-12 text-center relative">
          <div className="absolute top-2 left-0 right-0 flex justify-between px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground border-b border-border/50 pb-1 mb-4">
            <span>
              {new Date().toLocaleDateString(
                locale === "pt" ? "pt-BR" : "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </span>
            <span>Divisor.dev</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mt-6 mb-2 text-foreground tracking-tighter uppercase italic">
            <span className="text-gradient-purple">Divisor </span>blog
          </h1>
          <div className="text-sm font-serif italic text-muted-foreground border-t border-border mt-4 pt-2">
            Insights, tutoriais e novidades sobre Teste A/B, CRO e
            desenvolvimento de produto.
          </div>
        </div>

        {posts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 border-b border-border">
            {/* Featured Post (Main Story) */}
            <div className="lg:col-span-3 lg:border-r border-border p-6 lg:p-8 hover:bg-card/30 transition-colors group">
              <Link href={`/blog/${posts[0].slug}`} className="block">
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest mb-6">
                  Destaque
                </span>
                <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight group-hover:text-primary transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-xl text-muted-foreground mb-8 line-clamp-3 leading-relaxed font-serif">
                  {posts[0].description}
                </p>
                <div className="flex items-center justify-between text-xs uppercase tracking-widest font-bold text-muted-foreground border-t border-border pt-6">
                  <span>Por {posts[0].author}</span>
                  <span>
                    {new Date(posts[0].date).toLocaleDateString(
                      locale === "pt" ? "pt-BR" : "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              </Link>
            </div>

            {/* Recent Stories (Side Column) */}
            <div className="lg:col-span-1 flex flex-col divide-y divide-border">
              <div className="p-4 bg-muted/30 text-[10px] uppercase font-black tracking-[0.2em] text-center border-b border-border">
                Últimas Notícias
              </div>
              {posts.slice(1, 4).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="p-6 hover:bg-card/30 transition-colors group"
                >
                  <h3 className="text-lg font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    {new Date(post.date).toLocaleDateString(
                      locale === "pt" ? "pt-BR" : "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Remaining Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-x border-border border-b border-border">
          {posts.slice(4).map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`p-8 hover:bg-card/30 transition-colors group border-b border-border md:border-r last:border-r-0 ${(index + 1) % 2 === 0 ? "md:border-r-0 lg:border-r" : ""} ${(index + 1) % 3 === 0 ? "lg:border-r-0" : ""}`}
            >
              <div className="flex flex-col h-full">
                <div className="text-[10px] uppercase tracking-widest font-bold text-primary mb-4">
                  Artigo
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-3 text-sm font-serif">
                  {post.description}
                </p>
                <div className="mt-auto pt-6 border-t border-border/50 text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex justify-between">
                  <span>{post.author}</span>
                  <span>
                    {new Date(post.date).toLocaleDateString(
                      locale === "pt" ? "pt-BR" : "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
