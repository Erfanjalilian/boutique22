import { ProductForm } from "@/features/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">افزودن محصول جدید</h1>
      <ProductForm />
    </div>
  );
}
