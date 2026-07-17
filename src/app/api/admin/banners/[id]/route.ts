import { z } from "zod";
import { getBanners, saveBanners } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

const bannerSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().min(1).optional(),
  image: z.string().url().or(z.string().min(1)).optional(),
  buttonText: z.string().min(1).optional(),
  buttonHref: z.string().min(1).optional(),
  accent: z.string().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;
  const body = await request.json();
  const parsed = bannerSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const banners = await getBanners();
  const idx = banners.findIndex((banner) => banner.id === id);
  if (idx === -1) return apiError("Banner not found", 404);

  banners[idx] = { ...banners[idx], ...parsed.data };
  await saveBanners(banners);
  return apiSuccess(banners[idx]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;
  const banners = await getBanners();
  const filtered = banners.filter((banner) => banner.id !== id);
  if (filtered.length === banners.length) {
    return apiError("Banner not found", 404);
  }
  await saveBanners(filtered);
  return apiSuccess({ message: "Banner deleted" });
}
