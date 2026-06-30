"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "/dashboard", label: "داشبورد", icon: "🏠", exact: true },
  { href: "/dashboard/orders", label: "سفارش‌ها", icon: "📦", exact: false },
  { href: "/dashboard/profile", label: "پروفایل", icon: "👤", exact: false },
  { href: "/dashboard/addresses", label: "آدرس‌ها", icon: "📍", exact: false },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
              active
                ? "bg-primary text-white font-medium shadow-sm"
                : "text-muted hover:text-foreground hover:bg-background",
            )}
          >
            <span className="text-lg leading-none">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.push("/login");
    router.refresh();
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand / user info */}
      <div className="mb-6 px-2">
        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-xl shadow-sm">
            🛍️
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">حساب کاربری</p>
            {user && (
              <p className="text-xs text-muted truncate">{user.phone}</p>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />

      {/* Logout at the bottom */}
      <div className="mt-auto pt-6 border-t border-border/50 px-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-all"
        >
          <span className="text-lg leading-none">🚪</span>
          خروج از حساب
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile hamburger toggle (fixed, top-start in RTL = top-right) ── */}
      <button
        className="fixed top-4 start-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border shadow-md md:hidden"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "بستن منو" : "باز کردن منو"}
      >
        <span className="text-lg">{open ? "✕" : "☰"}</span>
      </button>

      {/* ── Mobile overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile sidebar (slides in from start/right) ── */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-40 w-72 bg-card border-e border-border/50 p-4 shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="منوی ناوبری"
      >
        {sidebarContent}
      </aside>

      {/* ── Desktop sidebar (static) ── */}
      <aside
        className="hidden md:flex w-64 shrink-0 flex-col bg-card border-s border-border/50 min-h-screen p-4"
        aria-label="منوی ناوبری"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
