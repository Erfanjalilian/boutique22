import { getOrders } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

export async function GET() {
  const orders = await getOrders();
  return apiSuccess(orders);
}
