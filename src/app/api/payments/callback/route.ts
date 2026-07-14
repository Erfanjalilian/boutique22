import { NextResponse } from "next/server";
import { verifyZibalPayment } from "@/services/zibal";
import { getOrders, saveOrders, getSettings } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId")?.trim();
    const trackId = url.searchParams.get("trackId")?.trim();

    if (!trackId) {
      return apiError("Invalid callback payload", 400);
    }

    const orders = await getOrders();
    const orderIndex = orderId
      ? orders.findIndex((order) => order.id === orderId)
      : orders.findIndex((order) => order.paymentTrackId === trackId);

    if (orderIndex === -1) {
      return apiError("Order not found", 404);
    }

    const order = orders[orderIndex];
    if (order.status === "Paid") {
      return NextResponse.redirect(new URL(`/order-success?id=${order.id}`, url.origin));
    }

    const settings = await getSettings();
    const merchant =
      process.env.ZIBAL_MERCHANT?.trim() || settings.zibalMerchant?.trim();
    if (!merchant) {
      return apiError(
        "تنظیمات پرداخت زیبال یافت نشد. لطفاً شناسه پذیرنده را در تنظیمات سایت وارد کنید.",
        400
      );
    }

    const zibalResponse = await verifyZibalPayment(merchant, trackId);
    if (zibalResponse.result !== 100) {
      orders[orderIndex] = {
        ...order,
        status: "Failed",
        paymentTrackId: trackId,
        paymentReferenceNumber: zibalResponse.referenceNumber || undefined,
      };
      await saveOrders(orders);
      const failureUrl = new URL(`/order-success?id=${order.id}`, url.origin);
      failureUrl.searchParams.set("status", "failed");
      return NextResponse.redirect(failureUrl);
    }

    if (zibalResponse.trackId && zibalResponse.trackId !== trackId) {
      return apiError("Mismatched payment trackId", 400);
    }

    if (typeof zibalResponse.amount === "number" && zibalResponse.amount !== order.total) {
      orders[orderIndex] = {
        ...order,
        status: "Failed",
        paymentTrackId: trackId,
        paymentReferenceNumber: zibalResponse.referenceNumber || undefined,
      };
      await saveOrders(orders);
      return apiError("Payment amount mismatch", 400);
    }

    orders[orderIndex] = {
      ...order,
      status: "Paid",
      paymentTrackId: trackId,
      paymentReferenceNumber: zibalResponse.referenceNumber || undefined,
      paymentVerifiedAt: new Date().toISOString(),
    };
    await saveOrders(orders);

    const successUrl = new URL(`/order-success?id=${order.id}`, url.origin);
    successUrl.searchParams.set("status", "paid");
    return NextResponse.redirect(successUrl);
  } catch (error) {
    return apiError("Payment verification failed", 500);
  }
}
