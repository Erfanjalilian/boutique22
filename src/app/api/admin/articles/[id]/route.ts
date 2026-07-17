import { getArticles, saveArticles } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;
  const articles = await getArticles();
  const filtered = articles.filter((article) => article.id !== id);
  if (filtered.length === articles.length) return apiError("مقاله یافت نشد", 404);
  await saveArticles(filtered);
  return apiSuccess({ message: "Article deleted" });
}
