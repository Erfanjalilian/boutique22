import { z } from "zod";
import { getOrders, saveOrders } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

const statusSchema = z.object({
  status: z.enum([
    "Pending",
    "Processing",
    "Paid",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Failed",
  ]),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;
  const body = await request.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return apiError("Order not found", 404);

  orders[idx].status = parsed.data.status;
  await saveOrders(orders);
  return apiSuccess(orders[idx]);
}
