import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className="group block overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-56 bg-slate-100">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <p className="text-sm text-muted mb-2">{new Date(article.createdAt).toLocaleDateString("fa-IR")}</p>
        <h3 className="text-xl font-semibold mb-3 text-black">{article.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{article.description}</p>
      </div>
    </Link>
  );
}
