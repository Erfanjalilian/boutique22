"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { AuthUser } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Auth guard wrapper — renders the form only once user is available,
// so ProfileForm can safely initialise its state directly from the user prop.
export function ProfileSection() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!loading && !isAuthenticated) {
    router.replace("/login");
    return null;
  }

  if (loading) return <LoadingSpinner size="lg" />;
  if (!user) return null;

  return <ProfileForm key={user.phone} user={user} />;
}

// ─────────────────────────────────────────────────────────────────────────────

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

interface FormErrors {
  firstName?: string;
  email?: string;
}

function ProfileForm({ user }: { user: AuthUser }) {
  const { refreshUser } = useAuth();

  // Initialise directly from the user prop — no useEffect needed.
  const [form, setForm] = useState<ProfileFormValues>({
    firstName: user.firstName || user.name.split(" ")[0] || "",
    lastName: user.lastName || user.name.split(" ").slice(1).join(" ") || "",
    email: user.email || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.firstName.trim()) {
      next.firstName = "نام الزامی است.";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "ایمیل وارد شده معتبر نیست.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setMessage(null);

    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      }),
    });

    const data = (await response.json()) as {
      success: boolean;
      error?: string;
    };
    setSubmitting(false);

    if (data.success) {
      setMessage({
        type: "success",
        text: "اطلاعات حساب با موفقیت ذخیره شد.",
      });
      await refreshUser();
    } else {
      setMessage({
        type: "error",
        text: data.error || "ذخیره اطلاعات با خطا مواجه شد.",
      });
    }
  }

  return (
    <div className="max-w-xl animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold">اطلاعات حساب</h1>

      {message && (
        <div
          className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="نام"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              error={errors.firstName}
              placeholder="نام خود را وارد کنید"
              required
            />
            <Input
              label="نام خانوادگی"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="نام خانوادگی"
            />
          </div>

          <Input
            label="ایمیل"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            placeholder="email@example.com"
          />

          <div className="space-y-1.5">
            <Input label="شماره موبایل" value={user.phone} disabled readOnly />
            <p className="text-xs text-muted">شماره موبایل قابل تغییر نیست</p>
          </div>

          <Button
            type="submit"
            loading={submitting}
            className="w-full sm:w-auto"
          >
            ذخیره تغییرات
          </Button>
        </form>
      </Card>
    </div>
  );
}
