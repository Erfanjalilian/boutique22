import { getReviews } from "@/lib/data";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const reviews = await getReviews();
  return apiSuccess(reviews);
}