import { z } from "zod";
import { getCustomerVideos, saveCustomerVideos } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const videoSchema = z.object({
  title: z.string().min(1, "عنوان ویدئو الزامی است"),
  description: z.string().optional().default(""),
  videoUrl: z.string().min(1, "آدرس ویدئو الزامی است"),
});

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return apiError("دسترسی غیرمجاز", 401);
  }

  const videos = await getCustomerVideos();
  return apiSuccess(videos);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return apiError("دسترسی غیرمجاز", 401);
  }

  try {
    const body = await request.json();
    const parsed = videoSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const videos = await getCustomerVideos();
    const video = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...parsed.data,
    };
    videos.unshift(video);
    await saveCustomerVideos(videos);
    return apiSuccess(video, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return apiError(message, 500);
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return apiError("دسترسی غیرمجاز", 401);
  }

  try {
    const { id } = await request.json();
    if (!id) return apiError("شناسه ویدئو الزامی است");

    const videos = await getCustomerVideos();
    const filtered = videos.filter((v) => v.id !== id);
    if (filtered.length === videos.length) {
      return apiError("ویدئو یافت نشد");
    }
    await saveCustomerVideos(filtered);
    return apiSuccess({ message: "ویدئو با موفقیت حذف شد" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return apiError(message, 500);
  }
}