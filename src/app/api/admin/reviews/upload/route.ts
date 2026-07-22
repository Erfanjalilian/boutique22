import { getSession } from "@/lib/auth";
import { apiSuccess, apiError } from "@/utils/api";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const IMAGE_DIR = path.join(process.cwd(), "public", "images");
const VIDEO_DIR = path.join(process.cwd(), "public", "videos");

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEOS = ["video/mp4", "video/webm", "video/ogg"];

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

    const isImage = ALLOWED_IMAGES.includes(file.type);
    const isVideo = ALLOWED_VIDEOS.includes(file.type);

    if (!isImage && !isVideo) {
      return apiError("فرمت فایل نامعتبر است. فقط تصویر (jpg, png, webp, gif) یا ویدئو (mp4, webm, ogg) مجاز است.");
    }

    if (isImage && file.size > 5 * 1024 * 1024) {
      return apiError("حجم تصویر بیش از حد مجاز است (حداکثر ۵ مگابایت).");
    }

    if (isVideo && file.size > 100 * 1024 * 1024) {
      return apiError("حجم ویدئو بیش از حد مجاز است (حداکثر ۱۰۰ مگابایت).");
    }

    const targetDir = isImage ? IMAGE_DIR : VIDEO_DIR;
    await mkdir(targetDir, { recursive: true });

    const ext = path.extname(file.name) || (isImage ? ".jpg" : ".mp4");
    const prefix = isImage ? "review-image" : "review-video";
    const filename = `${prefix}-${Date.now()}${ext}`;
    const filePath = path.join(targetDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const mediaUrl = isImage ? `/images/${filename}` : `/videos/${filename}`;
    const mediaType = isImage ? "image" : "video";

    return apiSuccess({ mediaUrl, mediaType });
  } catch {
    return apiError("آپلود ناموفق بود", 500);
  }
}