"use client";

import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 w-full max-w-full">
      <p className="text-black text-sm sm:text-base md:text-lg leading-relaxed mb-6 w-full break-words">
        &ldquo;{review.comment}&rdquo;
      </p>
      {review.mediaUrl && review.mediaType === "image" && (
        <div className="mb-4 w-full max-w-[200px] sm:max-w-xs mx-auto">
          <img
            src={review.mediaUrl}
            alt={review.fullName}
            className="w-full rounded-lg shadow-lg"
            style={{ maxHeight: "250px", objectFit: "cover" }}
          />
        </div>
      )}
      {review.mediaUrl && review.mediaType === "video" && (
        <div className="mb-4 w-full max-w-[200px] sm:max-w-sm mx-auto">
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
      <p className="font-semibold text-black text-sm sm:text-base">{review.fullName}</p>
    </div>
  );
}
