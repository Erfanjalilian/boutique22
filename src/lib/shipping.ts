import type { SiteSettings } from "@/types";

export const ShippingMethod = {
  PICKUP: "pickup",
  TIPAX: "tipax",
  POSTE_TAJAZZY: "poste_tajazzi",
} as const;

export type ShippingMethodValue =
  (typeof ShippingMethod)[keyof typeof ShippingMethod];

export const DEFAULT_PICKUP_SHIPPING_COST = 30000;
export const DEFAULT_POSTE_TAJAZZY_BASE_COST = 100000;
export const DEFAULT_POSTE_TAJAZZY_RATE_PER_KG = 50000;

function normalizeAddressValue(value?: string): string {
  return (value || "")
    .trim()
    .replace(/[\u200c\u200b]/g, "")
    .toLowerCase();
}

export function isQomAddress(province?: string, city?: string): boolean {
  const values = [province, city].map(normalizeAddressValue);

  return values.some(
    (value) => value === "قم" || value === "qom" || value.includes("قم")
  );
}

export function getAvailableShippingMethods(
  province?: string,
  city?: string
): ShippingMethodValue[] {
  const isQom = isQomAddress(province, city);

  if (isQom) {
    return [ShippingMethod.PICKUP, ShippingMethod.POSTE_TAJAZZY];
  }

  return [ShippingMethod.TIPAX, ShippingMethod.POSTE_TAJAZZY];
}

export function getShippingMethodLabel(
  method: ShippingMethodValue
): string {
  switch (method) {
    case ShippingMethod.PICKUP:
      return "پیک";
    case ShippingMethod.TIPAX:
      return "تیپاکس";
    case ShippingMethod.POSTE_TAJAZZY:
      return "پست پیشتاز";
    default:
      return "";
  }
}

export function getShippingCost(
  method: ShippingMethodValue,
  settings?: Pick<
    SiteSettings,
    | "pickupShippingCost"
    | "posteTajazziBaseCost"
    | "posteTajazziRatePerKg"
  >,
  totalWeightKg?: number
): number {
  // پیک
  if (method === ShippingMethod.PICKUP) {
    return typeof settings?.pickupShippingCost === "number" &&
      settings.pickupShippingCost >= 0
      ? settings.pickupShippingCost
      : DEFAULT_PICKUP_SHIPPING_COST;
  }

  // پست پیشتاز
  if (method === ShippingMethod.POSTE_TAJAZZY) {
    const baseCost =
      typeof settings?.posteTajazziBaseCost === "number" &&
      settings.posteTajazziBaseCost >= 0
        ? settings.posteTajazziBaseCost
        : DEFAULT_POSTE_TAJAZZY_BASE_COST;

    if (totalWeightKg && totalWeightKg > 0) {
      const ratePerKg =
        typeof settings?.posteTajazziRatePerKg === "number" &&
        settings.posteTajazziRatePerKg >= 0
          ? settings.posteTajazziRatePerKg
          : DEFAULT_POSTE_TAJAZZY_RATE_PER_KG;

      // تا ۱ کیلو فقط هزینه پایه
      const extraWeightUnits = Math.max(
        0,
        Math.ceil(totalWeightKg) - 1
      );

      return baseCost + extraWeightUnits * ratePerKg;
    }

    return baseCost;
  }

  // تیپاکس (پس‌کرایه)
  return 0;
}