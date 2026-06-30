"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import type { Address, Order } from "@/types";
import { formatDate, formatPrice } from "@/utils/helpers";

interface ProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AddressFormState {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  isDefault: boolean;
}

const emptyAddress = {
  fullName: "",
  phone: "",
  province: "",
  city: "",
  streetAddress: "",
  postalCode: "",
  isDefault: false,
};

export function AccountDashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [addressForm, setAddressForm] = useState<AddressFormState>(emptyAddress);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      firstName: user.firstName || user.name.split(" ")[0] || "",
      lastName: user.lastName || user.name.split(" ").slice(1).join(" ") || "",
      email: user.email || "",
      phone: user.phone || "",
    });

    void loadAddresses();
    void loadOrders();
  }, [user]);

  async function loadAddresses() {
    const response = await fetch("/api/user/addresses", { cache: "no-store" });
    const data = await response.json();
    if (data.success) {
      setAddresses(data.data || []);
    }
  }

  async function loadOrders() {
    const response = await fetch("/api/orders", { cache: "no-store" });
    const data = await response.json();
    if (data.success) {
      setOrders(data.data || []);
    }
  }

  async function handleProfileSave(event: React.FormEvent) {
    event.preventDefault();
    setProfileLoading(true);
    setMessage(null);

    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
      }),
    });
    const data = await response.json();
    setProfileLoading(false);

    if (data.success) {
      setMessage({ type: "success", text: "اطلاعات حساب با موفقیت ذخیره شد." });
    } else {
      setMessage({ type: "error", text: data.error || "ذخیره اطلاعات با خطا مواجه شد." });
    }
  }

  async function handleAddressSubmit(event: React.FormEvent) {
    event.preventDefault();
    setAddressLoading(true);
    setMessage(null);

    const endpoint = editingAddressId ? `/api/user/addresses/${editingAddressId}` : "/api/user/addresses";
    const method = editingAddressId ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressForm),
    });
    const data = await response.json();
    setAddressLoading(false);

    if (data.success) {
      setMessage({ type: "success", text: editingAddressId ? "آدرس با موفقیت ویرایش شد." : "آدرس با موفقیت اضافه شد." });
      setAddressForm(emptyAddress);
      setEditingAddressId(null);
      await loadAddresses();
    } else {
      setMessage({ type: "error", text: data.error || "ثبت آدرس با خطا مواجه شد." });
    }
  }

  async function handleDeleteAddress(id: string) {
    const response = await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (data.success) {
      await loadAddresses();
      setMessage({ type: "success", text: "آدرس حذف شد." });
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  const summary = useMemo(() => ({
    ordersCount: orders.length,
    defaultAddress: addresses.find((item) => item.isDefault) ?? addresses[0],
  }), [addresses, orders.length]);

  if (loading) {
    return <div className="py-20 text-center text-muted">در حال بارگذاری حساب کاربری…</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-xl shadow-black/10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted">خوش آمدید</p>
          <h1 className="text-2xl font-bold">{user.name || "کاربر عزیز"}</h1>
          <p className="mt-2 text-sm text-muted">شماره موبایل: {user.phone}</p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>خروج از حساب</Button>
      </div>

      {message && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted">تعداد سفارش‌ها</p>
          <p className="mt-2 text-3xl font-bold">{summary.ordersCount}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">آدرس پیش‌فرض</p>
          <p className="mt-2 text-sm font-medium">{summary.defaultAddress ? `${summary.defaultAddress.province}، ${summary.defaultAddress.city}` : "هنوز آدرس ثبت نشده"}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">وضعیت حساب</p>
          <p className="mt-2 text-sm font-medium text-emerald-400">فعال</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">سفارش‌های من</h2>
              <p className="text-sm text-muted">آخرین سفارش‌های ثبت‌شده در حساب شما</p>
            </div>
          </div>
          {orders.length === 0 ? (
            <EmptyState title="هنوز سفارشی ثبت نکرده‌اید" description="پس از خرید، سفارش‌های شما اینجا نمایش داده می‌شود." />
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex flex-wrap items-center justify-between rounded-2xl border border-border/50 bg-background/60 px-4 py-3">
                  <div>
                    <p className="font-medium">سفارش #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{order.status}</span>
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">اطلاعات حساب</h2>
          <form className="mt-4 space-y-4" onSubmit={handleProfileSave}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="نام" value={profileForm.firstName} onChange={(event) => setProfileForm({ ...profileForm, firstName: event.target.value })} required />
              <Input label="نام خانوادگی" value={profileForm.lastName} onChange={(event) => setProfileForm({ ...profileForm, lastName: event.target.value })} required />
            </div>
            <Input label="ایمیل" type="email" value={profileForm.email} onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })} />
            <Input label="شماره موبایل" value={profileForm.phone} disabled />
            <Button type="submit" loading={profileLoading}>ذخیره تغییرات</Button>
          </form>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">آدرس‌های من</h2>
              <p className="text-sm text-muted">مدیریت آدرس‌های تحویل</p>
            </div>
          </div>
          {addresses.length === 0 ? (
            <EmptyState title="هنوز آدرسی ثبت نشده" description="برای سفارش‌های بعدی، آدرس تحویل خود را اضافه کنید." />
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div key={address.id} className="rounded-2xl border border-border/50 bg-background/60 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{address.fullName}</p>
                      <p className="text-sm text-muted">{address.phone}</p>
                    </div>
                    {address.isDefault && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">پیش‌فرض</span>}
                  </div>
                  <p className="mt-2 text-sm text-muted">{address.province}، {address.city}، {address.streetAddress}</p>
                  <p className="mt-1 text-sm text-muted">کد پستی: {address.postalCode}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => { setEditingAddressId(address.id); setAddressForm({ ...address, isDefault: Boolean(address.isDefault) }); }}>ویرایش</Button>
                    <Button size="sm" variant="ghost" onClick={() => void handleDeleteAddress(address.id)}>حذف</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">{editingAddressId ? "ویرایش آدرس" : "افزودن آدرس جدید"}</h2>
          <form className="mt-4 space-y-4" onSubmit={handleAddressSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="نام و نام خانوادگی" value={addressForm.fullName} onChange={(event) => setAddressForm({ ...addressForm, fullName: event.target.value })} required />
              <Input label="شماره تماس" value={addressForm.phone} onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value })} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="استان" value={addressForm.province} onChange={(event) => setAddressForm({ ...addressForm, province: event.target.value })} required />
              <Input label="شهر" value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} required />
            </div>
            <Input label="آدرس دقیق" value={addressForm.streetAddress} onChange={(event) => setAddressForm({ ...addressForm, streetAddress: event.target.value })} required />
            <Input label="کد پستی" value={addressForm.postalCode} onChange={(event) => setAddressForm({ ...addressForm, postalCode: event.target.value })} required />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" checked={addressForm.isDefault} onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })} />
              تنظیم به عنوان آدرس پیش‌فرض
            </label>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" loading={addressLoading}>{editingAddressId ? "ذخیره تغییرات" : "افزودن آدرس"}</Button>
              {editingAddressId && <Button type="button" variant="ghost" onClick={() => { setEditingAddressId(null); setAddressForm(emptyAddress); }}>انصراف</Button>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
