"use client";

import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-8 min-w-[280px] md:min-w-[400px]">
      <p className="text-white/90 text-lg leading-relaxed mb-6 max-w-md">
        &ldquo;{review.comment}&rdquo;
      </p>
      {review.mediaUrl && review.mediaType === "image" && (
        <div className="mb-4 w-full max-w-xs mx-auto">
          <img
            src={review.mediaUrl}
            alt={review.fullName}
            className="w-full rounded-lg shadow-lg"
            style={{ maxHeight: "250px", objectFit: "cover" }}
          />
        </div>
      )}
      {review.mediaUrl && review.mediaType === "video" && (
        <div className="mb-4 w-full max-w-sm mx-auto">
          <video
            src={review.mediaUrl}
            controls
            className="w-full rounded-lg shadow-lg"
            style={{ maxHeight: "250px" }}
          >
            مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.
          </video>
        </div>
      )}
      <p className="font-semibold text-white text-base">{review.fullName}</p>
    </div>
  );
}