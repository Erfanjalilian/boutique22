import { Suspense } from "react";
import { ProductsClient } from "@/features/products/ProductsClient";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getProducts, getCategories } from "@/lib/data";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductsClient
        initialProducts={products}
        categories={categories}
      />
    </Suspense>
  );
}
