"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Review } from "@/types";

export function ReviewsAdminClient({
  initialReviews,
}: {
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [fullName, setFullName] = useState("");
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !comment.trim()) return;
    setLoading(true);
    setMessage("");

    let mediaUrl: string | undefined;
    let mediaType: "image" | "video" | null = null;

    // If a file is selected, upload it first
    if (selectedFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);

      const uploadRes = await fetch("/api/admin/reviews/upload", {
        method: "POST",
        credentials: "include",
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        setMessage(uploadData.error || "خطا در آپلود فایل");
        setLoading(false);
        return;
      }

      mediaUrl = uploadData.data.mediaUrl;
      mediaType = uploadData.data.mediaType;
    }

    // Save review with media
    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, comment, mediaUrl, mediaType }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setReviews((current) => [data.data, ...current]);
      setFullName("");
      setComment("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage("نظر با موفقیت ثبت شد.");
    } else {
      setMessage(data.error || "خطا در ثبت نظر.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این نظر اطمینان دارید؟")) return;
    const res = await fetch("/api/admin/reviews", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();

    if (data.success) {
      setReviews((current) => current.filter((review) => review.id !== id));
    } else {
      alert(data.error || "خطا در حذف نظر.");
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">رضایت مشتریان</h1>
      <Card className="p-6 mb-6">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="نام و نام خانوادگی"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="نام و نام خانوادگی مشتری را وارد کنید"
          />
          <Textarea
            label="نظر مشتری"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="متن نظر مشتری را وارد کنید"
          />
          <div>
            <label className="block text-sm font-medium mb-1">تصویر یا ویدئو (اختیاری)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            <p className="text-xs text-muted mt-1">
              حداکثر حجم: تصویر ۵ مگابایت | ویدئو ۱۰۰ مگابایت
            </p>
          </div>
          {message && (
            <p className={`text-sm ${message.includes("خطا") ? "text-red-400" : "text-green-500"}`}>
              {message}
            </p>
          )}
          <Button type="submit" loading={loading}>ثبت نظر</Button>
        </form>
      </Card>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-muted text-sm">هنوز نظری ثبت نشده است.</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{review.fullName}</h2>
                <p className="text-sm text-muted mt-1">{review.comment}</p>
                {review.mediaUrl && review.mediaType === "image" && (
                  <div className="mt-3">
                    <img
                      src={review.mediaUrl}
                      alt={review.fullName}
                      className="max-w-xs rounded-lg border border-border"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
                {review.mediaUrl && review.mediaType === "video" && (
                  <div className="mt-3 max-w-sm">
                    <video
                      src={review.mediaUrl}
                      controls
                      className="w-full rounded-lg"
                      style={{ maxHeight: "200px" }}
                    >
                      مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.
                    </video>
                  </div>
                )}
                <p className="text-xs text-muted/60 mt-2">
                  {new Date(review.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
              <Button variant="danger" size="sm" onClick={() => handleDelete(review.id)}>
                حذف
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}