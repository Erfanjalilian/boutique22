import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/utils/helpers";
import Link from "next/link";
import type { Order } from "@/types";

function getShippingMethodLabel(method?: Order["shippingMethod"]) {
  if (method === "pickup") return "پیک";
  if (method === "tipax") return "تیپاکس";
  return "—";
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="animate-fade-in max-w-2xl">
      <Link href="/admin/orders" className="text-sm text-primary hover:underline mb-4 inline-block">
        → بازگشت به سفارش‌ها
      </Link>
      <h1 className="text-2xl font-bold mb-6">جزئیات سفارش</h1>
      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <span className="font-mono text-sm">{order.id}</span>
          <Badge status={order.status} />
        </div>
        <p className="text-sm text-muted">{formatDate(order.createdAt)}</p>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-2 border-b border-border/30">
              <span>
                {item.name}
                {(item.size || item.color) &&
                  ` (${[item.size, item.color].filter(Boolean).join("، ")})`}
                {" × "}
                {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
        <div className="text-sm space-y-1">
          <p><strong>{order.fullName}</strong></p>
          <p className="text-muted">{order.address}</p>
          <p className="text-muted">{order.postalCode} · {order.phone}</p>
          <p className="text-muted">
            روش ارسال: <span className="font-medium text-foreground">{getShippingMethodLabel(order.shippingMethod)}</span>
          </p>
          {order.shippingMethod === "pickup" && (
            <p className="text-muted">
              هزینه پیک: <span className="font-medium text-foreground">{formatPrice(order.shippingCost)}</span>
            </p>
          )}
          {order.notes && <p className="text-muted">توضیحات: {order.notes}</p>}
          {order.paymentTrackId && (
            <p className="text-muted">
              شناسه پیگیری پرداخت: <span className="font-mono">{order.paymentTrackId}</span>
            </p>
          )}
          {order.paymentReferenceNumber && (
            <p className="text-muted">
              شماره مرجع پرداخت: <span className="font-mono">{order.paymentReferenceNumber}</span>
            </p>
          )}
          {order.paymentVerifiedAt && (
            <p className="text-muted">تاریخ تأیید پرداخت: {formatDate(order.paymentVerifiedAt)}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
