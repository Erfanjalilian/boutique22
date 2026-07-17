"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Category } from "@/types";

export function CategoriesAdminClient({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image: imageUrl.trim() || undefined }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setCategories([...categories, data.data]);
      setName("");
      setImageUrl("");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;
    const res = await fetch(`/api/admin/categories?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditImageUrl(cat.image || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditImageUrl("");
  }

  async function handleSaveEdit(id: string) {
    if (!editName.trim()) return;
    setLoading(true);
    const res = await fetch("/api/admin/categories", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editName.trim(), image: editImageUrl.trim() || undefined }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setCategories(categories.map((c) => (c.id === id ? data.data : c)));
      cancelEdit();
    }
  }

  return (
    <div className="animate-fade-in max-w-lg">
      <h1 className="text-2xl font-bold mb-6">مدیریت دسته‌بندی‌ها</h1>

      <Card className="p-5 mb-6 space-y-4">
        <form onSubmit={handleAdd}>
          <Input
            label="نام دسته‌بندی"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="لینک تصویر دسته‌بندی (اختیاری)"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-4"
          />
          <Button type="submit" loading={loading} className="mt-4">
            افزودن دسته‌بندی
          </Button>
        </form>
      </Card>

      <div className="space-y-2">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {cat.image && (
                  <img src={cat.image} alt={cat.name} className="w-12 h-8 object-cover rounded" />
                )}
                <div>
                  {editingId === cat.id ? (
                    <div className="flex gap-2">
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                      <Input value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} placeholder="لینک تصویر (اختیاری)" />
                    </div>
                  ) : (
                    <span className="font-medium">{cat.name}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {editingId === cat.id ? (
                  <>
                    <Button size="sm" onClick={() => handleSaveEdit(cat.id)} loading={loading}>ذخیره</Button>
                    <Button size="sm" variant="secondary" onClick={cancelEdit}>انصراف</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => startEdit(cat)}>ویرایش</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(cat.id)}>حذف</Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
