import { z } from "zod";
import { getBanners, saveBanners } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

const bannerSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  image: z.string().url().or(z.string().min(1)),
  buttonText: z.string().min(1),
  buttonHref: z.string().min(1),
  accent: z.string().optional(),
});

export async function GET() {
  const banners = await getBanners();
  return apiSuccess(banners);
}

export async function POST(request: Request) {

  try {
    const body = await request.json();
    const parsed = bannerSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const banners = await getBanners();
    const banner = {
      id: crypto.randomUUID(),
      ...parsed.data,
    };
    banners.push(banner);
    await saveBanners(banners);
    return apiSuccess(banner, 201);
  } catch {
    return apiError("Internal server error", 500);
  }
}
