"use client";

import Link from "next/link";
import Image from "next/image";
import type { MouseEvent } from "react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/helpers";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useCart();
  const liked = isWishlisted(product.id);

  function handleWishlistToggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product);
  }

  return (
    <div className="group relative block">
      <Link href={`/products/${product.id}`} className="block">
        <div className="rounded-2xl bg-white border border-black/10 overflow-hidden transition-all duration-300 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-400/5">
          <div className="relative aspect-[3/4] bg-white overflow-hidden">
            <Image
              src={product.images[0] || "/Image/placeholder-product.svg"}
              alt={product.name}
              fill
              className="object-contain transition-all duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {product.newArrival && (
              <span className="absolute top-3 start-3 bg-black text-white text-xs px-2.5 py-1 rounded-full font-medium">
                جدید
              </span>
            )}
            {product.bestSeller && (
              <span className="absolute top-3 end-3 bg-yellow-500 text-black text-xs px-2.5 py-1 rounded-full font-medium">
                پرفروش
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-black group-hover:text-yellow-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="mt-1 text-lg font-semibold text-yellow-600">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={handleWishlistToggle}
        aria-label={liked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        className="absolute top-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-black shadow-lg backdrop-blur transition-all duration-200 hover:scale-110"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-5 w-5 transition-all duration-200 ${
            liked ? "fill-red-500 text-red-500 scale-110" : "fill-none text-black/70"
          }`}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 015.364-1.318L12 7.636l2.318-2.636a4.5 4.5 0 116.364 6.364L12 20.364 4.318 12.682a4.5 4.5 0 010-6.364z"
          />
        </svg>
      </button>
    </div>
  );
}