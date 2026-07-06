"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/utils/helpers";
import type { Product, Category } from "@/types";

export function ProductDetailClient({
  product,
  related,
  categories,
}: {
  product: Product;
  related: Product[];
  categories: Category[];
}) {
  const { addItem, toggleWishlist, isWishlisted } = useCart();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const liked = isWishlisted(product.id);

  const category = categories.find((c) => c.id === product.categoryId);

  function handleAddToCart() {
    // Clear previous error
    setError("");

    // Check if product is in stock
    if (product.stock <= 0) {
      setError("این محصول موجود نیست");
      return;
    }

    // Check if requested quantity exceeds stock
    if (quantity > product.stock) {
      setError(`فقط ${product.stock} عدد از این محصول موجود است`);
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/Image/placeholder-product.svg",
      quantity,
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleQuantityChange(newQuantity: number) {
    setError("");
    setQuantity(newQuantity);
  }

  function handleWishlistToggle() {
    toggleWishlist(product);
    toast(liked ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد", "success");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-card border border-border/50">
            <button
              type="button"
              onClick={handleWishlistToggle}
              className="absolute top-4 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/90 text-black shadow-lg backdrop-blur transition-transform duration-200 hover:scale-110"
              aria-label={liked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-6 w-6 transition-all duration-200 ${
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
            <Image
              src={product.images[selectedImage] || "/Image/placeholder-product.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-primary" : "border-border"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="animate-fade-in">
          {category && (
            <p className="text-sm text-primary font-medium mb-2">{category.name}</p>
          )}
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mb-6">
            {formatPrice(product.price)}
          </p>
          <p className="text-muted leading-relaxed mb-8">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <p className="text-sm text-green-600">
                موجودی: {product.stock} عدد
                {product.stock < 10 && (
                  <span className="text-yellow-600 mr-2">(موجودی محدود)</span>
                )}
              </p>
            ) : (
              <p className="text-sm text-red-600">ناموجود</p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted mb-3">تعداد</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                  disabled={product.stock <= 0}
                  className="w-10 h-10 rounded-xl border border-border hover:border-primary/50 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  className="w-10 h-10 rounded-xl border border-border hover:border-primary/50 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            {/* Add to Cart Button */}
            <Button 
              size="lg" 
              className="w-full" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock <= 0 
                ? "ناموجود" 
                : added 
                  ? "به سبد اضافه شد ✓" 
                  : "افزودن به سبد خرید"
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <ProductGrid products={related} title="محصولات مرتبط" />
        </div>
      )}
    </div>
  );
}