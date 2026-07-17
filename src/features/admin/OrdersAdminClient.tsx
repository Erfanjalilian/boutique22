"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { formatPrice, formatDate } from "@/utils/helpers";
import { orderStatusLabels } from "@/utils/labels";
import type { Order, OrderStatus } from "@/types";

function getShippingMethodLabel(method?: Order["shippingMethod"]) {
  if (method === "pickup") return "پیک";
  if (method === "tipax") return "تیپاکس";
  return "—";
}

const statuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Paid",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Failed",
];

export function OrdersAdminClient({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);

  async function updateStatus(id: string, status: OrderStatus) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setOrders(orders.map((o) => (o.id === id ? data.data : o)));
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">مدیریت سفارش‌ها</h1>

      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-lg font-medium">هنوز سفارشی ثبت نشده است.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-5 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{order.fullName}</p>
                  <p className="text-sm text-muted">
                    #{order.id.slice(0, 8)} · {formatDate(order.createdAt)} · {order.items.length.toLocaleString("fa-IR")} قلم
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-44">
                    <Select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      options={statuses.map((s) => ({ value: s, label: orderStatusLabels[s] }))}
                    />
                  </div>
                  <p className="text-lg font-semibold text-primary">{formatPrice(order.total)}</p>
                  <Link href={`/admin/orders/${order.id}`} className="text-sm text-primary hover:underline">
                    جزئیات
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-3xl border border-border/50 bg-background/60 p-4 text-sm">
                  <p className="text-muted text-xs uppercase tracking-[0.2em] mb-2">آدرس و تماس</p>
                  <p>{order.address}</p>
                  <p className="text-muted">کد پستی: {order.postalCode}</p>
                  <p className="mt-2">تلفن: {order.phone}</p>
                  <p className="text-muted mt-2">
                    روش ارسال: <span className="font-medium text-foreground">{getShippingMethodLabel(order.shippingMethod)}</span>
                  </p>
                  {order.shippingMethod === "pickup" && (
                    <p className="text-muted">
                      هزینه پیک: <span className="font-medium text-foreground">{formatPrice(order.shippingCost)}</span>
                    </p>
                  )}
                  {order.notes && <p className="text-muted mt-2">توضیحات: {order.notes}</p>}
                </div>

                <div className="rounded-3xl border border-border/50 bg-background/60 p-4 text-sm">
                  <p className="text-muted text-xs uppercase tracking-[0.2em] mb-2">محصولات</p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={`${order.id}-${index}`} className="flex flex-col gap-1 border-b border-border/20 pb-2 last:border-b-0 last:pb-0">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted text-xs">
                          {item.quantity} × {formatPrice(item.price)}
                          {(item.size || item.color) && ` · ${[item.size, item.color].filter(Boolean).join("، ")}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {(order.paymentTrackId || order.paymentReferenceNumber || order.paymentVerifiedAt) && (
                <div className="rounded-3xl border border-border/50 bg-background/60 p-4 text-sm space-y-1">
                  <p className="text-muted text-xs uppercase tracking-[0.2em] mb-2">کد رهگیری پرداخت</p>
                  {order.paymentTrackId && (
                    <p>
                      شناسه پیگیری: <span className="font-mono">{order.paymentTrackId}</span>
                    </p>
                  )}
                  {order.paymentReferenceNumber && (
                    <p>
                      شماره مرجع: <span className="font-mono">{order.paymentReferenceNumber}</span>
                    </p>
                  )}
                  {order.paymentVerifiedAt && (
                    <p>تاریخ تأیید: {formatDate(order.paymentVerifiedAt)}</p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
