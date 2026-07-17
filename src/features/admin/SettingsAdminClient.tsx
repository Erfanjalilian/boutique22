"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { SiteSettings } from "@/types";

export function SettingsAdminClient({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const [form, setForm] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.success ? "تنظیمات ذخیره شد!" : data.error);
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">تنظیمات سایت</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">عمومی</h2>
          <Input
            label="نام وب‌سایت"
            value={form.websiteName}
            onChange={(e) => setForm({ ...form, websiteName: e.target.value })}
          />
          <Input
            label="عنوان متا (SEO)"
            value={form.metaTitle}
            onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
          />
          <Textarea
            label="توضیحات متا (SEO)"
            rows={3}
            value={form.metaDescription}
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
          />
          <Textarea
            label="متن فوتر"
            rows={2}
            value={form.footerText}
            onChange={(e) => setForm({ ...form, footerText: e.target.value })}
          />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">لوگو و فاویکون</h2>
          <Input
            label="لینک لوگو"
            placeholder="https://.../logo.png"
            value={form.logo || ""}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
          />
          <Input
            label="لینک فاویکون"
            placeholder="https://.../favicon.ico"
            value={form.favicon || ""}
            onChange={(e) => setForm({ ...form, favicon: e.target.value })}
          />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">تنظیمات پرداخت</h2>
          <Input
            label="شناسه پذیرنده زیبال"
            placeholder="ZIBAL merchant key"
            value={form.zibalMerchant || ""}
            onChange={(e) => setForm({ ...form, zibalMerchant: e.target.value })}
          />
          <Input
            label="هزینه ارسال به ازای هر کیلوگرم (تومان)"
            type="number"
            value={form.shippingRatePerKg ?? ""}
            onChange={(e) => setForm({ ...form, shippingRatePerKg: Number(e.target.value) })}
          />
        </Card>

        {message && <p className="text-sm text-green-400">{message}</p>}
        <Button type="submit" loading={loading}>ذخیره تنظیمات</Button>
      </form>
    </div>
  );
}
