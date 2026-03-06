import { getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

import { getAlternates } from "@/lib/metadata";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: "Post não encontrado",
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: getAlternates(locale, `/blog/${slug}`),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section Header */}
        <div className="border-b-2 border-foreground mb-12 pb-2 flex justify-between items-end">
          <Link
            href="/blog"
            className="text-xs uppercase tracking-[0.3em] font-black hover:text-primary transition-colors flex items-center"
          >
            <span className="mr-2 text-lg">←</span> Blog / Tecnologia
          </Link>
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hidden md:block">
            The Divisor Times • Digital Edition
          </div>
        </div>

        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-foreground tracking-tight leading-[1.05]">
            {post.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between border-y border-border py-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">
                  Por {post.author}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Correspondente Especial
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
              {new Date(post.date).toLocaleDateString(
                locale === "pt" ? "pt-BR" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-2xl text-muted-foreground font-serif italic leading-relaxed">
              {post.description}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12 post-content prose prose-invert prose-purple max-w-none prose-headings:font-bold prose-h2:text-4xl prose-h2:tracking-tight prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h3:text-2xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:border prose-img:border-border font-serif text-xl leading-relaxed">
            <ReactMarkdown
              components={{
                p: ({ children }: { children?: React.ReactNode }) => (
                  <p className="mb-6">{children}</p>
                ),
                input(props) {
                  if (props.type === "checkbox") {
                    return (
                      <input
                        type="checkbox"
                        checked={props.checked}
                        readOnly
                        className="markdown-checkbox"
                      />
                    );
                  }
                  return <input {...props} />;
                },
              }}
              remarkPlugins={[remarkGfm]}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        <footer className="mt-20 pt-10 border-t-2 border-foreground">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Fim da Matéria
            </div>
            <Link
              href="/blog"
              className="px-6 py-3 border border-foreground hover:bg-foreground hover:text-background transition-all uppercase text-xs font-black tracking-widest"
            >
              Ver mais notícias
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
}
