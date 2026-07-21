import { ReviewCard } from "./ReviewCard";
import type { Review } from "@/types";

export function ReviewsSection({
  reviews,
}: {
  reviews: Review[];
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          نظرات مشتریان
        </h2>
        <p className="text-black/70 mt-2">
          آنچه مشتریان ما می‌گویند
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}