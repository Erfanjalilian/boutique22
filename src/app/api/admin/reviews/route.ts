import { z } from "zod";
import { getReviews, saveReviews } from "@/lib/data";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const reviewSchema = z.object({
  fullName: z.string().min(1, "نام و نام خانوادگی الزامی است"),
  comment: z.string().min(1, "متن نظر الزامی است"),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(["image", "video"]).optional().nullable(),
});

export async function GET() {
  const reviews = await getReviews();
  return apiSuccess(reviews);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const reviews = await getReviews();
    const review = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      fullName: parsed.data.fullName,
      comment: parsed.data.comment,
      mediaUrl: parsed.data.mediaUrl || undefined,
      mediaType: parsed.data.mediaType || null,
    };
    reviews.unshift(review);
    await saveReviews(reviews);
    return apiSuccess(review, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return apiError(message, 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return apiError("شناسه نظر الزامی است");

    const reviews = await getReviews();
    const filtered = reviews.filter((r) => r.id !== id);
    if (filtered.length === reviews.length) {
      return apiError("نظر یافت نشد");
    }
    await saveReviews(filtered);
    return apiSuccess({ message: "نظر با موفقیت حذف شد" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return apiError(message, 500);
  }
}