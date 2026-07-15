import { z } from "zod";
import { getAdminSessionOrFallback } from "@/lib/auth";
import { getArticles, saveArticles } from "@/lib/data";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const articleSchema = z.object({
  title: z.string().min(1),
  image: z.string().url(),
  description: z.string().min(1),
});

async function requireAdmin() {
  const session = await getAdminSessionOrFallback();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);
  const articles = await getArticles();
  return apiSuccess(articles);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = articleSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const articles = await getArticles();
    const article = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...parsed.data,
    };
    articles.unshift(article);
    await saveArticles(articles);
    return apiSuccess(article, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return apiError(message, 500);
  }
}
