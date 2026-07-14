import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  getOrders,
  saveOrders,
  getOrdersByUserId,
  getUserById,
  getSettings,
} from "@/lib/data";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";
import {
  getZibalGatewayUrl,
  requestZibalPayment,
  ZibalRequestPayload,
} from "@/services/zibal";

const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  size: z.string().optional(),
  color: z.string().optional(),
  quantity: z.number().min(1),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  fullName: z.string().min(2),
  phone: z.string().min(10),
  address: z.string().min(5),
  postalCode: z.string().min(4),
  notes: z.string().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return apiError("Unauthorized", 401);

  if (session.role === "admin") {
    const orders = await getOrders();
    return apiSuccess(orders);
  }

  const orders = await getOrdersByUserId(session.userId);
  return apiSuccess(orders);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { items, fullName, phone, address, postalCode, notes } =
      parsed.data;

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const settings = await getSettings();
    const merchant =
      process.env.ZIBAL_MERCHANT?.trim() || settings.zibalMerchant?.trim();
    if (!merchant) {
      return apiError(
        "تنظیمات پرداخت زیبال یافت نشد. لطفاً شناسه پذیرنده را در تنظیمات سایت وارد کنید.",
        400
      );
    }

    const orderId = generateId();
    const origin = new URL(request.url).origin;
    const callbackUrl = `${origin}/api/payments/callback?orderId=${encodeURIComponent(
      orderId
    )}`;

    const order = {
      id: orderId,
      userId: session.userId,
      items,
      total,
      status: "Pending" as const,
      fullName,
      phone,
      address,
      postalCode,
      notes: notes || "",
      paymentTrackId: undefined as string | undefined,
      paymentReferenceNumber: undefined as string | undefined,
      paymentVerifiedAt: undefined as string | undefined,
      createdAt: new Date().toISOString(),
    };

    const paymentPayload: ZibalRequestPayload = {
      merchant,
      amount: total,
      callbackUrl,
      description: `پرداخت سفارش #${order.id}`,
      mobile: phone,
    };

    const paymentResult = await requestZibalPayment(paymentPayload);
    if (paymentResult.result !== 100 || !paymentResult.trackId) {
      return apiError(
        paymentResult.message || "Payment gateway request failed",
        502
      );
    }

    order.paymentTrackId = paymentResult.trackId;

    const orders = await getOrders();
    orders.push(order);
    await saveOrders(orders);

    const user = await getUserById(session.userId);
    if (user && !user.name) {
      const { getUsers, saveUsers } = await import("@/lib/data");
      const users = await getUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], name: fullName, address, postalCode, phone };
        await saveUsers(users);
      }
    }

    return apiSuccess(
      {
        orderId: order.id,
        redirectUrl: getZibalGatewayUrl(paymentResult.trackId),
      },
      201
    );
  } catch (error) {
    return apiError("Internal server error", 500);
  }
}
