import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/utils/helpers";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="rounded-2xl bg-white border border-black/10 overflow-hidden transition-all duration-300 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-400/5">
        <div className="relative aspect-[3/4] bg-white overflow-hidden">
          <Image
            src={product.images[0] || "/Image/placeholder-product.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
  );
}