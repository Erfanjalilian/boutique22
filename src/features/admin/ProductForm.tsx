"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Product, Category } from "@/types";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageInput, setImageInput] = useState((product?.images || []).join("\n"));
  const [videoInput, setVideoInput] = useState(product?.video || "");
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    categoryId: product?.categoryId || "",
    images: product?.images || [],
    video: product?.video || "",
    featured: product?.featured || false,
    bestSeller: product?.bestSeller || false,
    newArrival: product?.newArrival || false,
    stock: product?.stock?.toString() || "0",
    preparationTime: product?.preparationTime?.toString() || "",
    netWeight: product?.netWeight?.toString() || "",
    packageWeight: product?.packageWeight?.toString() || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      categoryId: form.categoryId,
      images: form.images,
      video: form.video,
      featured: form.featured,
      bestSeller: form.bestSeller,
      newArrival: form.newArrival,
      stock: Number(form.stock),
      preparationTime: Number(form.preparationTime || 0),
      netWeight: Number(form.netWeight || 0),
      packageWeight: Number(form.packageWeight || 0),
    };

    const url = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(data.error || "ذخیره محصول ناموفق بود");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Card className="p-6 space-y-4">
        <Input
          label="نام محصول"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Textarea
          label="توضیحات"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="grid grid-cols-4 gap-4">
          <Input
            label="قیمت (تومان)"
            type="number"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Input
            label="موجودی"
            type="number"
            required
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <Input
            label="زمان آماده‌سازی (روز)"
            type="number"
            min={0}
            value={form.preparationTime}
            onChange={(e) => setForm({ ...form, preparationTime: e.target.value })}
          />
          <Input
            label="وزن خالص (گرم)"
            type="number"
            value={form.netWeight}
            onChange={(e) => setForm({ ...form, netWeight: e.target.value })}
          />
          <Input
            label="وزن با بسته‌بندی (گرم)"
            type="number"
            value={form.packageWeight}
            onChange={(e) => setForm({ ...form, packageWeight: e.target.value })}
          />
        </div>
        <Select
          label="دسته‌بندی"
          required
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          options={[
            { value: "", label: "انتخاب دسته‌بندی" },
            ...categories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
          ]}
        />
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-medium">تصاویر</h3>
        <p className="text-sm text-muted">
          برای هر تصویر، یک لینک تصویر وارد کنید. لینک‌ها در API ذخیره می‌شود.
        </p>
        <Textarea
          label="لینک‌های تصویر"
          rows={5}
          placeholder="هر لینک در یک خط"
          value={imageInput}
          onChange={(e) => {
            const value = e.target.value;
            setImageInput(value);
            setForm({
              ...form,
              images: value
                .split(/\n+/)
                .map((item) => item.trim())
                .filter(Boolean),
            });
          }}
        />
      </Card>

      {/* Video */}
      <Card className="p-6 space-y-4">
        <h3 className="font-medium">ویدئو (اختیاری)</h3>
        <p className="text-sm text-muted">
          لینک ویدئو محصول را وارد کنید (مثلاً از آپارات، یوتیوب و ...). ویدئو در صفحه جزییات محصول نمایش داده می‌شود.
        </p>
        <Input
          label="لینک ویدئو"
          placeholder="https://aparat.com/v/..."
          value={videoInput}
          onChange={(e) => {
            setVideoInput(e.target.value);
            setForm({ ...form, video: e.target.value });
          }}
        />
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          {([
            { key: "featured" as const, label: "ویژه" },
            { key: "bestSeller" as const, label: "پرفروش" },
            { key: "newArrival" as const, label: "جدید" },
          ]).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="rounded"
              />
              {label}
            </label>
          ))}
        </div>
      </Card>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {product ? "به‌روزرسانی محصول" : "ایجاد محصول"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
