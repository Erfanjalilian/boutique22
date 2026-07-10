import { getProducts, getCategories } from "@/lib/data";
import { ProductsAdminClient } from "@/features/admin/ProductsAdminClient";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ProductsAdminClient initialProducts={products} categories={categories} />;
}
