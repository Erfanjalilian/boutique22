import { notFound } from "next/navigation";
import { getCategories, getProductById } from "@/lib/data";
import { ProductForm } from "@/features/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">ویرایش محصول</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
