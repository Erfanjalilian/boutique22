"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatPrice, formatDate } from "@/utils/helpers";
import type { Order } from "@/types";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setOrder(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) return <LoadingSpinner />;
  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">سفارش یافت نشد.</p>
        <Link href="/" className="text-primary mt-4 inline-block">
          بازگشت به خانه
        </Link>
      </div>
    );
  }

  const isFailed = order.status === "Failed";
  const badgeColor = isFailed ? "bg-red-500/20" : "bg-green-500/20";
  const icon = isFailed ? "✕" : "✓";
  const title = isFailed ? "پرداخت ناموفق بود" : "سفارش با موفقیت ثبت شد!";
  const subtitle = isFailed
    ? "پرداخت شما تأیید نشد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید."
    : "از خرید شما سپاسگزاریم. سفارش شما در حال پردازش است.";

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-fade-in">
      <div className={`${badgeColor} rounded-full flex items-center justify-center mx-auto mb-6 w-16 h-16`}>
        <span className="text-3xl">{icon}</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted mb-8">{subtitle}</p>

      <Card className="p-6 text-start mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-muted">شناسه سفارش</p>
            <p className="font-mono text-sm">{order.id}</p>
          </div>
          <Badge status={order.status} />
        </div>
        <p className="text-sm text-muted mb-1">تاریخ</p>
        <p className="mb-4">{formatDate(order.createdAt)}</p>
        <p className="text-sm text-muted mb-1">مبلغ کل</p>
        <p className="text-2xl font-bold text-primary mb-4">
          {formatPrice(order.total)}
        </p>
        <div className="border-t border-border pt-4 space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-4 justify-center">
        <Link href="/dashboard/orders">
          <Button variant="secondary">مشاهده سفارش‌ها</Button>
        </Link>
        <Link href="/products">
          <Button>{isFailed ? "بازگشت به خرید" : "ادامه خرید"}</Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
