import { getSession } from "@/lib/auth";
import { apiSuccess, apiError } from "@/utils/api";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const VIDEO_DIR = path.join(process.cwd(), "public", "video");

const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov", "video/mkv"];

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return apiError("دسترسی غیرمجاز", 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("فایلی انتخاب نشده است");
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return apiError("فرمت فایل نامعتبر است. فقط ویدئو مجاز است.");
    }

    if (file.size > 100 * 1024 * 1024) {
      return apiError("حجم فایل بیش از حد مجاز است (حداکثر ۱۰۰ مگابایت).");
    }

    await mkdir(VIDEO_DIR, { recursive: true });

    const ext = path.extname(file.name) || ".mp4";
    const filename = `customer-video-${Date.now()}${ext}`;
    const filePath = path.join(VIDEO_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const videoUrl = `/video/${filename}`;
    return apiSuccess({ path: videoUrl });
  } catch {
    return apiError("آپلود ناموفق بود", 500);
  }
}