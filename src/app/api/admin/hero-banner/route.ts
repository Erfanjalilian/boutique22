import { getHeroBanner, saveHeroBanner } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";
import { z } from "zod";

const heroBannerSchema = z.object({
  image: z.string().min(1, "لینک تصویر الزامی است"),
  title: z.string().min(1, "عنوان الزامی است"),
  subtitle: z.string().min(1, "زیرعنوان الزامی است"),
  description: z.string().min(1, "توضیحات الزامی است"),
});

export async function GET() {
  const banner = await getHeroBanner();
  return apiSuccess(banner);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = heroBannerSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  await saveHeroBanner(parsed.data);
  return apiSuccess(parsed.data);
}