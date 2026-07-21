"use client";

import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-8 min-w-[280px] md:min-w-[400px]">
      <p className="text-white/90 text-lg leading-relaxed mb-6 max-w-md">
        &ldquo;{review.comment}&rdquo;
      </p>
      <p className="font-semibold text-white text-base">{review.fullName}</p>
    </div>
  );
}
