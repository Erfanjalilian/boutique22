import { getArticles } from "@/lib/data";
import { ArticlesAdminClient } from "@/features/admin/ArticlesAdminClient";

export default async function AdminArticlesPage() {
  const articles = await getArticles();

  return <ArticlesAdminClient initialArticles={articles} />;
}
