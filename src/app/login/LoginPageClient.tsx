"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import type { AuthUser } from "@/hooks/useAuth";

const PHONE_REGEX = /^09[0-9]{9}$/;
const OTP_TTL = 300; // seconds
const RESEND_COOLDOWN = 120; // seconds

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function formatTime(s: number) {
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const adminMode = searchParams.get("mode") === "admin";
  const [view, setView] = useState<"otp" | "verify" | "login" | "register" | "admin">(
    adminMode ? "admin" : "otp"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [otpCountdown, setOtpCountdown] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);

  const otpTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resendTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(adminMode ? "/admin" : "/dashboard");
    }
  }, [adminMode, authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    otpTimer.current = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(otpTimer.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(otpTimer.current!);
  }, [otpCountdown]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    resendTimer.current = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(resendTimer.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(resendTimer.current!);
  }, [resendCountdown]);

  function validatePhone(v: string): string {
    if (!v.trim()) return "شماره موبایل الزامی است";
    if (!PHONE_REGEX.test(v))
      return "شماره موبایل باید با ۰۹ شروع و ۱۱ رقم باشد";
    return "";
  }

  const sendOtp = useCallback(async (targetPhone: string) => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: targetPhone }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setOtpCountdown(OTP_TTL);
      setResendCountdown(RESEND_COOLDOWN);
      return true;
    }
    setError(data.error || "ارسال کد تأیید ناموفق بود");
    return false;
  }, []);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    const err = validatePhone(phone);
    if (err) {
      setError(err);
      return;
    }
    const ok = await sendOtp(phone);
    if (ok) {
      setView("verify");
      setCode("");
    }
  }

  async function handleResendOtp() {
    if (resendCountdown > 0 || loading) return;
    setCode("");
    await sendOtp(phone);
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      login(data.data.user as AuthUser);
      router.push(data.data.redirectTo);
      router.refresh();
    } else {
      setError(data.error || "ورود ناموفق بود");
    }
  }

  async function handleUsernamePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      login(data.data.user as AuthUser);
      router.push(data.data.redirectTo);
      router.refresh();
    } else {
      setError(data.error || "نام کاربری یا کلمه عبور اشتباه است");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        name,
        phone,
        address,
        postalCode,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      login(data.data.user as AuthUser);
      router.push(data.data.redirectTo);
      router.refresh();
    } else {
      setError(data.error || "ثبت نام ناموفق بود");
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) {
      setError("کد تأیید باید ۶ رقم باشد");
      return;
    }
    if (otpCountdown === 0) {
      setError("کد تأیید منقضی شده. لطفاً کد جدید درخواست دهید.");
      return;
    }

    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      login(data.data.user as AuthUser);
      router.push(data.data.redirectTo);
      router.refresh();
    } else {
      setError(data.error || "کد تأیید نامعتبر است");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="absolute inset-0 bg-gradient-to-bl from-secondary/10 via-background to-background pointer-events-none" />

      <Card className="relative w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border mb-4 shadow-sm">
            <span className="text-3xl">🛍️</span>
          </div>
          <h1 className="text-2xl font-bold">خوش آمدید</h1>
          <p className="text-muted text-sm mt-2">
            {adminMode
              ? "برای ورود به پنل مدیریت، اطلاعات حساب را وارد کنید"
              : view === "otp"
              ? "برای ورود، شماره موبایل خود را وارد کنید"
              : view === "verify"
              ? `کد ۶ رقمی ارسال‌شده برای ${phone} را وارد کنید`
              : view === "login"
              ? "نام کاربری و کلمه عبور خود را وارد کنید"
              : view === "register"
              ? "یک حساب کاربری جدید بسازید"
              : "برای ورود به پنل مدیریت، اطلاعات حساب را وارد کنید"}
          </p>
        </div>

        {!adminMode && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setView("otp");
                setError("");
              }}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                view === "otp"
                  ? "bg-primary text-white border-primary"
                  : "bg-card text-muted border-border"
              }`}
            >
              ورود با کد
            </button>
            <button
              type="button"
              onClick={() => {
                setView("login");
                setError("");
              }}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                view === "login"
                  ? "bg-primary text-white border-primary"
                  : "bg-card text-muted border-border"
              }`}
            >
              ورود با نام کاربری
            </button>
            <button
              type="button"
              onClick={() => {
                setView("register");
                setError("");
              }}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                view === "register"
                  ? "bg-primary text-white border-primary"
                  : "bg-card text-muted border-border"
              }`}
            >
              ثبت نام
            </button>
          </div>
        )}

        {adminMode ? (
          <form onSubmit={handleAdminLogin} className="space-y-5" noValidate>
            <Input
              label="نام کاربری"
              placeholder="joojino"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              autoFocus
              required
            />
            <Input
              label="کلمه عبور"
              placeholder="1383"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              ورود به پنل مدیریت
            </Button>
          </form>
        ) : view === "otp" ? (
          <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
            <Input
              label="شماره موبایل"
              placeholder="09123456789"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              type="tel"
              inputMode="numeric"
              maxLength={11}
              autoFocus
              required
            />

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              ارسال کد تأیید
            </Button>
          </form>
        ) : view === "verify" ? (
          <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
            <div className="flex justify-between items-center gap-3">
              <div className="text-sm text-muted">کد به {phone || "شماره شما"} ارسال شد.</div>
              <button
                type="button"
                onClick={() => {
                  setView("otp");
                  setError("");
                }}
                className="text-sm font-medium text-primary hover:underline"
              >
                تغییر شماره
              </button>
            </div>

            <Input
              label="کد تأیید (۶ رقم)"
              placeholder="123456"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
              inputMode="numeric"
              maxLength={6}
              autoFocus
              required
            />

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              ورود با کد
            </Button>

            <div className="text-center text-sm text-muted">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCountdown > 0 || loading}
                className="font-medium text-primary hover:underline disabled:opacity-50"
              >
                {resendCountdown > 0
                  ? `ارسال مجدد (${formatTime(resendCountdown)})`
                  : "ارسال مجدد کد"}
              </button>
            </div>
          </form>
        ) : view === "login" ? (
          <form onSubmit={handleUsernamePasswordLogin} className="space-y-5" noValidate>
            <Input
              label="نام کاربری"
              placeholder="joojino"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              autoFocus
              required
            />
            <Input
              label="کلمه عبور"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              ورود به حساب
            </Button>
          </form>
        ) : null}
      </Card>
    </div>
  );
}
