"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { HeroBanner } from "@/types";

export function HeroBannerAdminClient({
  initialBanner,
}: {
  initialBanner: HeroBanner;
}) {
  const [form, setForm] = useState(initialBanner);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/hero-banner", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setMessage("بنر اصلی با موفقیت به‌روزرسانی شد!");
    } else {
      setMessage(data.error || "خطا در ذخیره تغییرات");
    }
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">ویرایش بنر اصلی (هیرو)</h1>

      {message && (
        <p
          className={`text-sm mb-4 ${
            message.includes("خطا") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <p className="text-sm text-muted">
            این بنر در بالای صفحه اصلی (Hero Section) نمایش داده می‌شود. می‌توانید لینک عکس و متن‌ها را تغییر دهید.
          </p>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-muted">تصویر بنر اصلی</label>
            <ImageUpload
              images={form.image ? [form.image] : []}
              onChange={(images) => setForm({ ...form, image: images[0] || "" })}
              multiple={false}
              prefix="hero-banner"
            />
          </div>

          <Input
            label="عنوان"
            placeholder="مثال: کالکشن جدید ۱۴۰۴"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <Input
            label="زیرعنوان"
            placeholder="مثال: سبک خود را ارتقا دهید"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />

          <Textarea
            label="توضیحات"
            rows={3}
            placeholder="مثال: اصالت و شرافت دنیای مجازی و حقیقی ندارد ، اصیل و شریف باشیم ."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Card>

        <Button type="submit" loading={loading}>
          ذخیره تغییرات
        </Button>
      </form>
    </div>
  );
}