"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatDate, formatPrice } from "@/utils/helpers";
import type { Address, Order } from "@/types";

export function DashboardOverview() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      const [ordersRes, addressesRes] = await Promise.all([
        fetch("/api/orders", { cache: "no-store" }),
        fetch("/api/user/addresses", { cache: "no-store" }),
      ]);
      const [ordersData, addressesData] = await Promise.all([
        ordersRes.json() as Promise<{ success: boolean; data: Order[] }>,
        addressesRes.json() as Promise<{ success: boolean; data: Address[] }>,
      ]);
      if (ordersData.success) setOrders(ordersData.data ?? []);
      if (addressesData.success) setAddresses(addressesData.data ?? []);
      setDataLoading(false);
    }

    void loadData();
  }, [user]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!user) return null;
  if (dataLoading) return <LoadingSpinner size="lg" />;

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/20 via-primary/5 to-background p-6 shadow-xl shadow-black/10">
        <p className="text-sm text-muted mb-1">خوش آمدید</p>
        <h1 className="text-2xl font-bold">{user.name || "کاربر عزیز"}</h1>
        <p className="mt-1.5 text-sm text-muted">
          شماره موبایل:{" "}
          <span className="font-medium text-foreground">{user.phone}</span>
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted">تعداد سفارش‌ها</p>
          <p className="mt-2 text-3xl font-bold">{orders.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">تعداد آدرس‌ها</p>
          <p className="mt-2 text-3xl font-bold">{addresses.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">مجموع خرید</p>
          <p className="mt-2 text-xl font-bold text-primary">
            {totalSpent > 0 ? formatPrice(totalSpent) : "—"}
          </p>
        </Card>
      </div>

      {/* Recent orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">سفارش‌های اخیر</h2>
          {orders.length > 0 && (
            <Link
              href="/dashboard/orders"
              className="text-sm text-primary hover:underline"
            >
              مشاهده همه
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            title="هنوز سفارشی ثبت نکرده‌اید"
            description="پس از خرید، سفارش‌های شما اینجا نمایش داده می‌شود."
            action={
              <Link
                href="/products"
                className="inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                مشاهده محصولات
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                <Card hover className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        سفارش #{order.id.slice(0, 8)}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge status={order.status} />
                      <span className="font-semibold text-primary">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">دسترسی سریع</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/dashboard/profile">
            <Card hover className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl">
                👤
              </div>
              <div>
                <p className="font-medium">ویرایش پروفایل</p>
                <p className="mt-0.5 text-sm text-muted">
                  نام، ایمیل و اطلاعات حساب
                </p>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/addresses">
            <Card hover className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl">
                📍
              </div>
              <div>
                <p className="font-medium">مدیریت آدرس‌ها</p>
                <p className="mt-0.5 text-sm text-muted">
                  افزودن و ویرایش آدرس‌های تحویل
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
