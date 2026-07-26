"use client";

import { useState, useCallback } from "react";
import { ReviewCard } from "./ReviewCard";
import type { Review } from "@/types";

export function ReviewsSection({
  reviews,
}: {
  reviews: Review[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0) setCurrentIndex(reviews.length - 1);
      else if (index >= reviews.length) setCurrentIndex(0);
      else setCurrentIndex(index);
    },
    [reviews.length]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  if (reviews.length === 0) return null;

  const currentReview = reviews[currentIndex];

  return (
    <section className="bg-blue-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            نظرات مشتریان
          </h2>
          <p className="text-white/80 mt-2">
            آنچه مشتریان درباره‌ی ما می‌گویند
          </p>
        </div>

        <div className="relative flex items-center justify-center gap-4">
          {/* Left Arrow */}
          <button
            onClick={goPrev}
            className="shrink-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="قبلی"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Current Review Card */}
          <div className="flex-1 max-w-2xl mx-auto overflow-hidden">
            <div
              key={currentReview.id}
              className="transition-opacity duration-500 ease-in-out"
            >
              <ReviewCard review={currentReview} />
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={goNext}
            className="shrink-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="بعدی"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/40"
                }`}
                aria-label={`برو به نظر ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
