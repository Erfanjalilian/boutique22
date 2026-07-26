"use client";

import { useState } from "react";
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
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !comment.trim()) return;
    setLoading(true);
    setMessage("");

    // Validate URL if provided
    if (mediaUrl.trim() && !mediaType) {
      setMessage("لطفاً نوع رسانه (تصویر یا ویدئو) را انتخاب کنید.");
      setLoading(false);
      return;
    }

    // Save review with media URL
    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        comment,
        mediaUrl: mediaUrl.trim() || undefined,
        mediaType: mediaUrl.trim() ? mediaType : null,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setReviews((current) => [data.data, ...current]);
      setFullName("");
      setComment("");
      setMediaUrl("");
      setMediaType("");
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
            <label className="block text-sm font-medium mb-1">
              لینک تصویر یا ویدئو (اختیاری)
            </label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://example.com/media.jpg"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              dir="ltr"
            />
          </div>
          {mediaUrl.trim() && (
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="image"
                  checked={mediaType === "image"}
                  onChange={() => setMediaType("image")}
                  className="accent-primary"
                />
                <span className="text-sm">تصویر</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="video"
                  checked={mediaType === "video"}
                  onChange={() => setMediaType("video")}
                  className="accent-primary"
                />
                <span className="text-sm">ویدئو</span>
              </label>
            </div>
          )}
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