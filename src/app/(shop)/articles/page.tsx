import { getArticles } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-3">مقالات</h1>
        <p className="text-muted text-lg">
          جدیدترین مقالات مد و استایل را اینجا دنبال کنید.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden p-0">
            <Link href={`/articles/${article.id}`} className="block group">
              <div className="relative h-60 overflow-hidden bg-slate-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-3">{article.title}</h2>
                <p className="text-muted leading-relaxed">
                  {article.description}
                </p>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
