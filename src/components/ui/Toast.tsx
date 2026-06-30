"use client";

import { useToast, type ToastType } from "@/hooks/useToast";
import { cn } from "@/utils/helpers";

const icons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const styles: Record<ToastType, string> = {
  success: "bg-emerald-500 text-white border-emerald-600",
  error: "bg-red-500 text-white border-red-600",
  info: "bg-primary text-white border-primary-hover",
  warning: "bg-secondary text-black border-secondary-hover",
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 end-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
      aria-live="polite"
      aria-label="اعلان‌ها"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl shadow-black/20 animate-slide-in",
            styles[t.type]
          )}
        >
          <span className="shrink-0 mt-0.5 text-base font-bold">
            {icons[t.type]}
          </span>
          <p className="flex-1 text-sm font-medium leading-relaxed">
            {t.message}
          </p>
          <button
            onClick={() => dismiss(t.id)}
            className="shrink-0 rounded-full opacity-70 hover:opacity-100 transition-opacity text-lg leading-none"
            aria-label="بستن"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
