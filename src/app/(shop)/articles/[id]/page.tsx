import { notFound } from "next/navigation";
import Image from "next/image";
import { getArticleById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-3xl bg-slate-100">
          <div className="relative h-96">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-muted">{new Date(article.createdAt).toLocaleDateString("fa-IR")}</p>
          <h1 className="text-4xl font-bold mt-3">{article.title}</h1>
        </div>
        <div className="prose prose-sm max-w-none text-muted">
          <p>{article.description}</p>
        </div>
      </div>
    </div>
  );
}
