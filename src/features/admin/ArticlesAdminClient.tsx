"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Article } from "@/types";

export function ArticlesAdminClient({
  initialArticles,
}: {
  initialArticles: Article[];
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !image.trim() || !description.trim()) return;
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/articles", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, image, description }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setArticles((current) => [data.data, ...current]);
      setTitle("");
      setImage("");
      setDescription("");
      setMessage("مقاله با موفقیت اضافه شد.");
    } else {
      setMessage(data.error || "خطا در افزودن مقاله.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این مقاله اطمینان دارید؟")) return;
    const res = await fetch(`/api/admin/articles/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();

    if (data.success) {
      setArticles((current) => current.filter((article) => article.id !== id));
    } else {
      alert(data.error || "خطا در حذف مقاله.");
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">مدیریت مقالات</h1>
      <Card className="p-6 mb-6">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="عنوان مقاله"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان مقاله را وارد کنید"
          />
          <Input
            label="لینک تصویر"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
          <Textarea
            label="متن توضیحات"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="متن توضیحات مقاله را وارد کنید"
          />
          {message && <p className="text-sm text-green-500">{message}</p>}
          <Button type="submit" loading={loading}>افزودن مقاله</Button>
        </form>
      </Card>

      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id} className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{article.title}</h2>
              <p className="text-sm text-muted mt-1">{article.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={article.image}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary underline"
              >
                مشاهده عکس
              </a>
              <Button variant="danger" size="sm" onClick={() => handleDelete(article.id)}>
                حذف
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
