import { getOrders } from "@/lib/data";
import { OrdersAdminClient } from "@/features/admin/OrdersAdminClient";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return <OrdersAdminClient orders={orders} />;
}
