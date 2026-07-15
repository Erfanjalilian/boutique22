import { getAdminSessionOrFallback } from "@/lib/auth";
import { getArticles, saveArticles } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

async function requireAdmin() {
  const session = await getAdminSessionOrFallback();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  const { id } = await params;
  const articles = await getArticles();
  const filtered = articles.filter((article) => article.id !== id);
  if (filtered.length === articles.length) return apiError("مقاله یافت نشد", 404);
  await saveArticles(filtered);
  return apiSuccess({ message: "Article deleted" });
}
