import type { SiteSettings } from "@/types";

export const ShippingMethod = {
  PICKUP: "pickup",
  TIPAX: "tipax",
} as const;

export type ShippingMethodValue =
  (typeof ShippingMethod)[keyof typeof ShippingMethod];

export const DEFAULT_PICKUP_SHIPPING_COST = 30000;

function normalizeAddressValue(value?: string): string {
  return (value || "")
    .trim()
    .replace(/[\u200c\u200b]/g, "")
    .toLowerCase();
}

export function isQomAddress(province?: string, city?: string): boolean {
  const values = [province, city].map(normalizeAddressValue);

  return values.some((value) => value === "قم" || value === "qom" || value.includes("قم"));
}

export function getAvailableShippingMethods(
  province?: string,
  city?: string
): ShippingMethodValue[] {
  return isQomAddress(province, city)
    ? [ShippingMethod.PICKUP]
    : [ShippingMethod.TIPAX];
}

export function getShippingMethodLabel(method: ShippingMethodValue): string {
  return method === ShippingMethod.PICKUP ? "پیک" : "تیپاکس";
}

export function getShippingCost(
  method: ShippingMethodValue,
  settings?: Pick<SiteSettings, "pickupShippingCost">
): number {
  if (method === ShippingMethod.PICKUP) {
    return typeof settings?.pickupShippingCost === "number" && settings.pickupShippingCost >= 0
      ? settings.pickupShippingCost
      : DEFAULT_PICKUP_SHIPPING_COST;
  }

  return 0;
}
