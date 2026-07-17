"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { AboutInfo } from "@/types";

export function AboutAdminClient({
  initialAbout,
}: {
  initialAbout: AboutInfo;
}) {
  const [form, setForm] = useState(initialAbout);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/about", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.success ? "صفحه درباره ما به‌روزرسانی شد!" : data.error);
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">مدیریت درباره ما</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            label="متن درباره ما"
            rows={8}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {message && <p className="text-sm text-green-400">{message}</p>}
          <Button type="submit" loading={loading}>ذخیره تغییرات</Button>
        </form>
      </Card>
    </div>
  );
}
