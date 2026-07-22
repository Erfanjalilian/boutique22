"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/helpers";

const links = [
  { href: "/admin", label: "داشبورد", icon: "📊" },
  { href: "/admin/products", label: "محصولات", icon: "👕" },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: "🗂️" },
  { href: "/admin/articles", label: "مقالات", icon: "📰" },
  { href: "/admin/orders", label: "سفارش‌ها", icon: "📦" },
  { href: "/admin/users", label: "کاربران", icon: "👥" },
  { href: "/admin/banners", label: "بنرها", icon: "🖼️" },
  { href: "/admin/contact", label: "تماس", icon: "📞" },
  { href: "/admin/about", label: "درباره ما", icon: "📝" },
  { href: "/admin/reviews", label: "رضایت مشتریان", icon: "⭐" },
  { href: "/admin/settings", label: "تنظیمات", icon: "⚙️" },
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
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
              active
                ? "bg-primary/20 text-primary font-medium"
                : "text-muted hover:bg-background hover:text-foreground"
            )}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="mb-8 px-2">
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className="text-xl font-bold text-primary"
        >
          پنل مدیریت
        </Link>
        <p className="mt-1 text-xs text-muted">مدیریت بوتیک</p>
      </div>

      <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />

      <div className="mt-8 border-t border-border/50 px-2 pt-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-sm text-muted transition-colors hover:text-primary"
        >
          بازگشت به فروشگاه ←
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="fixed start-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-md md:hidden"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "بستن منو" : "باز کردن منو"}
      >
        <span className="text-lg">{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-40 w-[85vw] max-w-72 border-e border-border/50 bg-card p-4 shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="منوی مدیریت"
      >
        {sidebarContent}
      </aside>

      <aside
        className="hidden min-h-screen w-64 shrink-0 flex-col border-s border-border/50 bg-card p-4 md:flex"
        aria-label="منوی مدیریت"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
