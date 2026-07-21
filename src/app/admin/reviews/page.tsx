import { getReviews } from "@/lib/data";
import { ReviewsAdminClient } from "@/features/admin/ReviewsAdminClient";

export default async function AdminReviewsPage() {
  const reviews = await getReviews();

  return <ReviewsAdminClient initialReviews={reviews} />;
}