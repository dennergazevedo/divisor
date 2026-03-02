import { getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string; locale: string }>;
};

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
            <div className="container mx-auto px-6 max-w-3xl">
                <header className="mb-16 text-center">
                    <div className="text-sm text-primary mb-4 font-medium uppercase tracking-wider">
                        {new Date(post.date).toLocaleDateString("pt-BR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}{" "}
                        • {post.author}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
                        {post.title}
                    </h1>
                    <p className="text-xl text-muted-foreground">{post.description}</p>
                </header>

                <div className="prose prose-invert prose-purple max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:border prose-img:border-border">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </div>
        </article>
    );
}
