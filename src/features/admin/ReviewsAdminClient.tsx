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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !comment.trim()) return;
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, comment }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setReviews((current) => [data.data, ...current]);
      setFullName("");
      setComment("");
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
      <h1 className="text-2xl font-bold mb-6">نظرات مشتریان</h1>
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
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="متن نظر مشتری را وارد کنید"
          />
          {message && <p className="text-sm text-green-500">{message}</p>}
          <Button type="submit" loading={loading}>ثبت نظر</Button>
        </form>
      </Card>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-muted text-sm">هنوز نظری ثبت نشده است.</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{review.fullName}</h2>
                <p className="text-sm text-muted mt-1">{review.comment}</p>
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