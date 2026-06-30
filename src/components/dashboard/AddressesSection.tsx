"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Address } from "@/types";

interface AddressForm {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  isDefault: boolean;
}

const emptyForm: AddressForm = {
  fullName: "",
  phone: "",
  province: "",
  city: "",
  streetAddress: "",
  postalCode: "",
  isDefault: false,
};

type ApiAddressResponse = { success: boolean; data: Address[]; error?: string };
type ApiMutationResponse = { success: boolean; error?: string };

async function fetchAddresses(): Promise<Address[]> {
  const response = await fetch("/api/user/addresses", { cache: "no-store" });
  const data = (await response.json()) as ApiAddressResponse;
  return data.success ? (data.data ?? []) : [];
}

export function AddressesSection() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Initial load on mount — defined inline so the effect body never directly
  // calls an external setState-bearing function (avoids react-hooks/set-state-in-effect).
  useEffect(() => {
    if (!user) return;
    async function loadOnMount() {
      const data = await fetchAddresses();
      setAddresses(data);
      setDataLoading(false);
    }
    void loadOnMount();
  }, [user]);

  // Post-mutation refresh — wrapped in useCallback so it can be awaited after
  // add / edit / delete operations from event handlers.
  const loadAddresses = useCallback(async () => {
    setDataLoading(true);
    const data = await fetchAddresses();
    setAddresses(data);
    setDataLoading(false);
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage(null);
  }

  function openEditForm(address: Address) {
    setEditingId(address.id);
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      province: address.province,
      city: address.city,
      streetAddress: address.streetAddress,
      postalCode: address.postalCode,
      isDefault: Boolean(address.isDefault),
    });
    setShowForm(true);
    setMessage(null);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const endpoint = editingId
      ? `/api/user/addresses/${editingId}`
      : "/api/user/addresses";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await response.json()) as ApiMutationResponse;
    setSubmitting(false);

    if (data.success) {
      setMessage({
        type: "success",
        text: editingId
          ? "آدرس با موفقیت ویرایش شد."
          : "آدرس با موفقیت اضافه شد.",
      });
      cancelForm();
      await loadAddresses();
    } else {
      setMessage({
        type: "error",
        text: data.error || "ثبت آدرس با خطا مواجه شد.",
      });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این آدرس اطمینان دارید؟")) return;
    setMessage(null);

    const response = await fetch(`/api/user/addresses/${id}`, {
      method: "DELETE",
    });
    const data = (await response.json()) as ApiMutationResponse;

    if (data.success) {
      setMessage({ type: "success", text: "آدرس با موفقیت حذف شد." });
      await loadAddresses();
    } else {
      setMessage({
        type: "error",
        text: data.error || "حذف آدرس با خطا مواجه شد.",
      });
    }
  }

  if (loading) return <LoadingSpinner size="lg" />;
  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">آدرس‌های من</h1>
        {!showForm && <Button onClick={openAddForm}>+ افزودن آدرس</Button>}
      </div>

      {/* Inline message */}
      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add / edit form */}
      {showForm && (
        <Card className="p-6 animate-slide-in">
          <h2 className="mb-5 text-lg font-semibold">
            {editingId ? "ویرایش آدرس" : "افزودن آدرس جدید"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="نام و نام خانوادگی"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
              <Input
                label="شماره تماس"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="استان"
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                required
              />
              <Input
                label="شهر"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
            </div>
            <Input
              label="آدرس دقیق"
              value={form.streetAddress}
              onChange={(e) =>
                setForm({ ...form, streetAddress: e.target.value })
              }
              required
            />
            <Input
              label="کد پستی"
              value={form.postalCode}
              onChange={(e) =>
                setForm({
                  ...form,
                  postalCode: e.target.value.replace(/\D/g, ""),
                })
              }
              maxLength={10}
              required
            />
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({ ...form, isDefault: e.target.checked })
                }
                className="rounded"
              />
              تنظیم به عنوان آدرس پیش‌فرض
            </label>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button type="submit" loading={submitting}>
                {editingId ? "ذخیره تغییرات" : "افزودن آدرس"}
              </Button>
              <Button type="button" variant="ghost" onClick={cancelForm}>
                انصراف
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Addresses list */}
      {dataLoading ? (
        <LoadingSpinner />
      ) : addresses.length === 0 && !showForm ? (
        <EmptyState
          title="هنوز آدرسی ثبت نشده"
          description="برای سفارش‌های بعدی، آدرس تحویل خود را اضافه کنید."
          action={<Button onClick={openAddForm}>افزودن اولین آدرس</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className="p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <p className="font-semibold">{address.fullName}</p>
                {address.isDefault && <Badge>پیش‌فرض</Badge>}
              </div>
              <p className="text-sm text-muted">{address.phone}</p>
              <p className="mt-1 text-sm text-muted">
                {address.province}، {address.city}
              </p>
              <p className="mt-1 text-sm text-muted">{address.streetAddress}</p>
              <p className="mt-1 text-sm text-muted">
                کد پستی: {address.postalCode}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openEditForm(address)}
                >
                  ویرایش
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => void handleDelete(address.id)}
                >
                  حذف
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
