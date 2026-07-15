import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types";

export function ArticleGrid({
  articles,
  title,
  subtitle,
}: {
  articles: Article[];
  title?: string;
  subtitle?: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-black">{title}</h2>
          )}
          {subtitle && (
            <p className="text-black/70 mt-2">{subtitle}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
