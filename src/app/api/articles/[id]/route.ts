import { getArticleById } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return apiError("مقاله یافت نشد", 404);
  return apiSuccess(article);
}
