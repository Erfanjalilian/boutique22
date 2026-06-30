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
  const [step, setStep] = useState<"phone" | "otp" | "admin">(
    adminMode ? "admin" : "phone"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      setStep("otp");
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
              : step === "phone"
                ? "برای ورود، شماره موبایل خود را وارد کنید"
                : `کد ارسال‌شده به ${phone} را وارد کنید`}
          </p>
        </div>

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
        ) : step === "phone" ? (
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
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
            <div className="flex justify-center">
              <div
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium border ${
                  otpCountdown > 0
                    ? "bg-secondary/10 text-secondary-hover border-secondary/30"
                    : "bg-red-500/10 text-red-500 border-red-500/30"
                }`}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {otpCountdown > 0
                  ? `انقضای کد: ${formatTime(otpCountdown)}`
                  : "کد تأیید منقضی شد"}
              </div>
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
              تأیید ورود
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
        )}
      </Card>
    </div>
  );
}
