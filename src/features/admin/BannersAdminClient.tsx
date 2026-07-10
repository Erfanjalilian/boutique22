"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { SiteBanner } from "@/types";

const emptyBanner = (): SiteBanner => ({
  id: "",
  title: "",
  subtitle: "",
  image: "",
  buttonText: "",
  buttonHref: "",
  accent: "",
});

export function BannersAdminClient({ initialBanners }: { initialBanners: SiteBanner[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<SiteBanner>(emptyBanner());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function startNew() {
    setEditingId(null);
    setDraft(emptyBanner());
  }

  function startEdit(banner: SiteBanner) {
    setEditingId(banner.id);
    setDraft(banner);
  }

  async function saveBanner() {
    setLoading(true);
    setMessage("");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/banners/${editingId}` : "/api/admin/banners";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      const saved = data.data as SiteBanner;
      setBanners((prev) => {
        if (editingId) {
          return prev.map((item) => (item.id === saved.id ? saved : item));
        }
        return [...prev, saved];
      });
      setEditingId(null);
      setDraft(emptyBanner());
      setMessage(editingId ? "بنر به‌روزرسانی شد" : "بنر اضافه شد");
    } else {
      setMessage(data.error || "عملیات ناموفق بود");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این بنر اطمینان دارید؟")) return;

    const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setBanners((prev) => prev.filter((item) => item.id !== id));
      setMessage("بنر حذف شد");
    } else {
      setMessage(data.error || "حذف بنر ناموفق بود");
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت بنرها</h1>
          <p className="text-sm text-muted mt-1">لینک تصویر را وارد کنید و بنرها را به‌روزرسانی کنید.</p>
        </div>
        <Button onClick={startNew}>افزودن بنر</Button>
      </div>

      {message && <p className="text-sm text-green-500">{message}</p>}

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">{editingId ? "ویرایش بنر" : "بنر جدید"}</h2>
        <Input label="عنوان" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        <Textarea label="توضیح" rows={3} value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} />
        <Input label="لینک تصویر" value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} />
        <Input label="متن دکمه" value={draft.buttonText} onChange={(e) => setDraft({ ...draft, buttonText: e.target.value })} />
        <Input label="آدرس دکمه" value={draft.buttonHref} onChange={(e) => setDraft({ ...draft, buttonHref: e.target.value })} />
        <Input label="رنگ مکمل" value={draft.accent || ""} onChange={(e) => setDraft({ ...draft, accent: e.target.value })} />
        <div className="flex gap-3">
          <Button onClick={saveBanner} loading={loading}>ذخیره</Button>
          <Button variant="secondary" onClick={startNew}>پاک کردن</Button>
        </div>
      </Card>

      <div className="space-y-3">
        {banners.map((banner) => (
          <Card key={banner.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{banner.title}</p>
                <p className="text-sm text-muted">{banner.subtitle}</p>
                <p className="text-xs text-muted mt-2">{banner.image}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => startEdit(banner)}>ویرایش</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(banner.id)}>حذف</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
