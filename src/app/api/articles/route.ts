import { getArticles } from "@/lib/data";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const articles = await getArticles();
  return apiSuccess(articles);
}
