"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Input } from "@/components/ui/Input";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { IRAN_PROVINCES } from "@/lib/iran-provinces";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/utils/helpers";
import {
  getAvailableShippingMethods,
  getShippingCost,
  getShippingMethodLabel,
  isQomAddress,
  ShippingMethod,
  type ShippingMethodValue,
} from "@/lib/shipping";

export default function CheckoutPageClient() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<{
    pickupShippingCost?: number;
    posteTajazziBaseCost?: number;
    posteTajazziRatePerKg?: number;
  }>({});
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodValue>(ShippingMethod.TIPAX);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    postalCode: "",
    province: "",
    city: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setSettings({
            pickupShippingCost: data.data.pickupShippingCost,
            posteTajazziBaseCost: data.data.posteTajazziBaseCost,
            posteTajazziRatePerKg: data.data.posteTajazziRatePerKg,
          });
        }
      })
      .catch(() => {});
  }, []);

  const isQom = isQomAddress(form.province, form.city);
  const availableMethods = getAvailableShippingMethods(form.province, form.city);
  const recommendedShippingMethod = isQom
    ? ShippingMethod.PICKUP
    : ShippingMethod.TIPAX;

  useEffect(() => {
    if (availableMethods.length > 0 && !availableMethods.includes(shippingMethod)) {
      setShippingMethod(recommendedShippingMethod);
    }
  }, [availableMethods, recommendedShippingMethod, shippingMethod]);

  const totalWeightGrams = items.reduce((sum, i) => sum + ((i.weight || 0) * i.quantity), 0);
  const totalWeightKg = totalWeightGrams / 1000;
  const shippingCost = getShippingCost(shippingMethod, settings, totalWeightKg);
  const finalTotal = totalPrice + shippingCost;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, ...form, shippingMethod }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      if (data.data.redirectUrl) {
        window.location.href = data.data.redirectUrl;
        return;
      }

      clearCart();
      router.push(`/order-success?id=${data.data.orderId || data.data.id}`);
    } else {
      if (res.status === 401) {
        router.push("/login");
      } else {
        setError(data.error || "ثبت سفارش با خطا مواجه شد");
      }
    }
  }

  if (items.length === 0) return null;

  function getShippingCostDisplay(method: ShippingMethodValue): string {
    if (method === ShippingMethod.TIPAX) return "پس‌کرایه";
    const cost = getShippingCost(method, settings, totalWeightKg);
    const label = getShippingMethodLabel(method);
    return `${formatPrice(cost)} (${label})`;
  }

  function getShippingDescription(method: ShippingMethodValue): string {
    if (method === ShippingMethod.PICKUP) {
      if (recommendedShippingMethod === method) {
        return "این روش برای آدرس شما در شهر قم به‌صورت پیش‌فرض فعال شده است.";
      }
      return "پیک برای ارسال در شهر قم در دسترس است.";
    }

    if (method === ShippingMethod.TIPAX) {
      if (recommendedShippingMethod === method) {
        return "این روش برای آدرس شما به‌صورت پیش‌فرض فعال شده است.";
      }
      return "تیپاکس برای سفارش‌های خارج از شهر قم در دسترس است.";
    }

    if (method === ShippingMethod.POSTE_TAJAZZY) {
      return "پست پیشتاز برای تمام مناطق در دسترس است.";
    }

    return "";
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">تسویه حساب</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">اطلاعات ارسال</h2>
          <Input
            label="نام و نام خانوادگی"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <Input
            label="شماره موبایل"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Autocomplete
            label="استان"
            required
            value={form.province}
            onChange={(value) => setForm({ ...form, province: value })}
            options={IRAN_PROVINCES}
            placeholder="استان خود را انتخاب کنید یا تایپ کنید..."
          />
          <Input
            label="شهر"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <Input
            label="آدرس"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <Input
            label="کد پستی"
            required
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          />
          <Textarea
            label="توضیحات (اختیاری)"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">روش ارسال</h2>
          <div className="space-y-3">
            {availableMethods.map((method) => {
              const isRecommended = recommendedShippingMethod === method;
              return (
                <label
                  key={method}
                  className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                    isRecommended
                      ? "border-primary"
                      : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === method}
                    onChange={() => setShippingMethod(method)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">
                        {getShippingMethodLabel(method)}
                      </span>
                      <span className="text-sm text-primary">
                        {getShippingCostDisplay(method)}
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-1">
                      {getShippingDescription(method)}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted">
              <span>جمع جزء</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-start text-muted">
              <div>
                <span>هزینه ارسال</span>
                {shippingMethod === ShippingMethod.TIPAX && (
                  <p className="text-xs mt-1 text-muted">
                    هزینه ارسال توسط تیپاکس هنگام تحویل کالا از گیرنده دریافت می‌شود.
                  </p>
                )}
              </div>
              <span>
                {shippingMethod === ShippingMethod.TIPAX
                  ? "پس‌کرایه"
                  : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-primary">{formatPrice(finalTotal)}</span>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm mb-4 mt-4">{error}</p>}
          <Button type="submit" className="w-full mt-6" size="lg" loading={loading}>
            ثبت سفارش
          </Button>
        </Card>
      </form>
    </div>
  );
}