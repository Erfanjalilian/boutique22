"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Order } from "@/types";

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderItems({ items }: { items: Order["items"] }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-background">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{item.name}</p>
            <p className="text-xs text-muted">
              {item.quantity} عدد × {formatPrice(item.price)}
              {item.size && ` — سایز ${item.size}`}
              {item.color && ` — ${item.color}`}
            </p>
          </div>
          <p className="shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</p>
        </div>
      ))}
    </div>
  );
}

function ShippingMethodLabel({ method }: { method: string }) {
  const labels: Record<string, string> = {
    pickup: "تحویل حضوری",
    tipax: "تیپاکس",
    poste_tajazzi: "پست تجزی",
  };
  return <span>{labels[method] || method}</span>;
}

export function OrdersAdminClient({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">مدیریت سفارش‌ها</h1>
        <Card className="p-8 text-center">
          <p className="text-lg font-medium">هیچ سفارشی ثبت نشده است.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">مدیریت سفارش‌ها</h1>
      <p className="text-sm text-muted mb-4">{orders.length} سفارش</p>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-border/50">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{order.id}</span>
                  <Badge status={order.status} />
                </div>
                <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
              </div>
              <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div>
                <p className="text-xs text-muted mb-0.5">نام مشتری</p>
                <p className="text-sm font-medium">{order.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">شماره تماس</p>
                <p className="text-sm font-medium" dir="ltr">{order.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">روش ارسال</p>
                <p className="text-sm font-medium">
                  <ShippingMethodLabel method={order.shippingMethod} />
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">هزینه ارسال</p>
                <p className="text-sm font-medium">{formatPrice(order.shippingCost)}</p>
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <p className="text-xs text-muted mb-0.5">آدرس</p>
              <p className="text-sm">
                {order.province && order.city ? `${order.province}، ${order.city}، ` : ""}
                {order.address}
                {order.postalCode && (
                  <span dir="ltr" className="text-xs text-muted block mt-0.5">
                    کد پستی: {order.postalCode}
                  </span>
                )}
              </p>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mb-4">
                <p className="text-xs text-muted mb-0.5">توضیحات</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}

            {/* Items */}
            <div>
              <p className="text-xs text-muted mb-2">محصولات سفارش</p>
              <OrderItems items={order.items} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}