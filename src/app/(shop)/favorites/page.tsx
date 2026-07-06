"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/utils/helpers";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, moveToCart } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-yellow-600">علاقه‌مندی‌ها</p>
          <h1 className="text-3xl font-bold text-black">لیست علاقه‌مندی‌های شما</h1>
          <p className="mt-2 text-sm text-black/70">
            محصولاتی که ذخیره کرده‌اید برای مراجعه بعدی در همینجا نگهداری می‌شوند.
          </p>
        </div>
        <Link href="/products" className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5">
          ادامه خرید
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/15 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current">
              <path d="M4.318 6.318a4.5 4.5 0 015.364-1.318L12 7.636l2.318-2.636a4.5 4.5 0 116.364 6.364L12 20.364 4.318 12.682a4.5 4.5 0 010-6.364z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-black">هنوز محصولی به علاقه‌مندی‌ها اضافه نشده</h2>
          <p className="mt-2 text-sm text-black/70">
            با کلیک روی آیکن قلبی در کارت محصولات، آن‌ها را ذخیره کنید.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {wishlistItems.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition-all duration-200 hover:shadow-lg">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                <Link href={`/products/${product.id}`} className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl sm:w-40">
                  <Image
                    src={product.images[0] || "/Image/placeholder-product.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-black">{product.name}</h3>
                        <p className="mt-1 text-sm text-black/70 line-clamp-2">{product.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        className="rounded-full p-2 text-black/60 transition-colors hover:bg-black/5 hover:text-red-500"
                        aria-label="حذف از علاقه‌مندی‌ها"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                          <path d="M6 7h12v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7zm2 0V5a2 2 0 012-2h4a2 2 0 012 2v2h5v2H3V7h5z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xl font-bold text-yellow-600">{formatPrice(product.price)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full">
                        مشاهده جزئیات
                      </Button>
                    </Link>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => moveToCart(product)}
                    >
                      افزودن به سبد
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
