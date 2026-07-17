import { OrdersAdminClient } from "@/features/admin/OrdersAdminClient";
import { getOrders } from "@/lib/data";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return <OrdersAdminClient initialOrders={orders} />;
}
