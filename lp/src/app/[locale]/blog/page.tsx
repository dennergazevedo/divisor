import { getAllPosts } from "@/lib/blog";
import { Link } from "@/i18n/routing";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog",
    description: "Leia as últimas novidades e tutoriais sobre Testes A/B.",
};

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function BlogList({ params }: Props) {
    const { locale } = await params;
    const posts = getAllPosts(locale);

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
                        Divisor <span className="text-gradient-purple">Blog</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Insights, tutoriais e novidades sobre Teste A/B, CRO e desenvolvimento de produto.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group relative rounded-2xl border border-border bg-card p-8 hover:border-glow hover:glow-purple-sm transition-all duration-300"
                        >
                            <div className="flex flex-col h-full">
                                <div className="text-sm text-primary mb-4 font-medium uppercase tracking-wider">
                                    {new Date(post.date).toLocaleDateString("pt-BR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                                <h2 className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-muted-foreground flex-grow">
                                    {post.description}
                                </p>
                                <div className="mt-8 flex items-center text-sm font-medium text-primary">
                                    Ler artigo{" "}
                                    <span className="ml-2 transition-transform group-hover:translate-x-1">
                                        →
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
