import { getCategories } from "@/lib/data";
import { ProductForm } from "@/features/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">افزودن محصول جدید</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
