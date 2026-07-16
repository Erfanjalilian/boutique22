"use client";

import { useEffect, useState } from "react";
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

export function BannersAdminClient() {
  const [banners, setBanners] = useState<SiteBanner[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<SiteBanner>(emptyBanner());
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [fetchError, setFetchError] = useState("");

  async function loadBanners() {
    setListLoading(true);
    setFetchError("");

    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();

      if (res.ok && data.success) {
        setBanners(data.data);
      } else {
        setFetchError(data.error || "خطا در دریافت لیست بنرها");
      }
    } catch {
      setFetchError("خطا در دریافت لیست بنرها");
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    loadBanners();
  }, []);

  function startEdit(banner: SiteBanner) {
    setEditingId(banner.id);
    setDraft(banner);
  }

  async function saveBanner() {
    if (!editingId) {
      setMessage("لطفاً ابتدا یک بنر را برای ویرایش انتخاب کنید.");
      return;
    }

    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/admin/banners/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      const saved = data.data as SiteBanner;
      setBanners((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
      setEditingId(null);
      setDraft(emptyBanner());
      setMessage("بنر به‌روزرسانی شد");
      await loadBanners();
    } else {
      setMessage(data.error || "عملیات ناموفق بود");
    }
  }


  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مدیریت بنرها</h1>
        <p className="text-sm text-muted mt-1">
          همه بنرها نمایش داده می‌شوند. برای ویرایش هر بنر روی دکمه ویرایش کلیک کنید.
        </p>
      </div>

      {message && <p className="text-sm text-green-500">{message}</p>}
      {fetchError && <p className="text-sm text-red-500">{fetchError}</p>}

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">ویرایش بنر</h2>
        <p className="text-sm text-muted">
          ابتدا یک بنر را از لیست انتخاب کنید، سپس اطلاعات را به‌روزرسانی کنید.
        </p>
        <Input label="عنوان" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        <Textarea label="توضیح" rows={3} value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} />
        <Input label="لینک تصویر" value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} />
        <Input label="متن دکمه" value={draft.buttonText} onChange={(e) => setDraft({ ...draft, buttonText: e.target.value })} />
        <Input label="آدرس دکمه" value={draft.buttonHref} onChange={(e) => setDraft({ ...draft, buttonHref: e.target.value })} />
        <Input label="رنگ مکمل" value={draft.accent || ""} onChange={(e) => setDraft({ ...draft, accent: e.target.value })} />
        <div className="flex gap-3">
          <Button onClick={saveBanner} loading={loading} disabled={!editingId}>
            ذخیره
          </Button>
          <Button variant="secondary" onClick={() => setEditingId(null)}>
            انصراف
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        {listLoading ? (
          <Card className="p-4 text-center text-sm text-muted">در حال بارگذاری بنرها...</Card>
        ) : banners.length === 0 ? (
          <Card className="p-4 text-sm text-muted">هیچ بنری یافت نشد.</Card>
        ) : (
          banners.map((banner) => (
            <Card key={banner.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{banner.title}</p>
                  <p className="text-sm text-muted">{banner.subtitle}</p>
                  <p className="text-xs text-muted mt-2">{banner.image}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => startEdit(banner)}>ویرایش</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
