"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

export function Header({
  websiteName = "JOOJINO",
  logo = "/Image/domingo_1781261523518.webp",
}: {
  websiteName?: string;
  logo?: string;
}) {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const links = [
    { href: "/", label: "خانه" },
    { href: "/products", label: "فروشگاه" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              {/* Logo with proper display - no gray background */}
              <div className="relative w-40 h-40">
                <Image
                  src={"/Image/domingo_1781261523518.webp"}
                  alt={websiteName}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-black/70 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Search Button & Modal */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-xl hover:bg-black/5 transition-colors"
                aria-label="جستجو"
              >
                <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Favorites */}
              <Link
                href="/favorites"
                className="relative p-2 rounded-xl hover:bg-black/5 transition-colors"
              >
                <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-xl hover:bg-black/5 transition-colors"
              >
                <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -start-1 bg-yellow-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm px-4 py-2 rounded-xl bg-black text-white hover:bg-black/80 transition-colors"
              >
                ورود
              </Link>

              <button
                className="md:hidden p-2 text-black"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="منو"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Search Modal */}
          {searchOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-black/10 shadow-lg p-4 animate-fade-in">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجوی محصولات..."
                    className="flex-1 px-4 py-2 border border-black/20 rounded-xl focus:outline-none focus:border-black/50 text-right"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-xl hover:bg-black/80 transition-colors"
                  >
                    جستجو
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="px-4 py-2 border border-black/20 rounded-xl hover:bg-black/5 transition-colors"
                  >
                    بستن
                  </button>
                </div>
              </form>
            </div>
          )}

          {menuOpen && (
            <nav className="md:hidden py-4 border-t border-black/10 animate-fade-in">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-black/70 hover:text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="block py-2 text-black font-medium"
                onClick={() => setMenuOpen(false)}
              >
                ورود
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-black/10 shadow-lg">
        <div className="flex items-center justify-around py-2 px-4">
          {/* Home */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-black/60 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">خانه</span>
          </Link>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center gap-1 text-black/60 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs">جستجو</span>
          </button>

          {/* Shop */}
          <Link
            href="/products"
            className="flex flex-col items-center gap-1 text-black/60 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs">فروشگاه</span>
          </Link>

          {/* Favorites */}
          <Link
            href="/favorites"
            className="flex flex-col items-center gap-1 text-black/60 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">علاقه‌مندی</span>
          </Link>

          {/* Cart with Badge */}
          <Link
            href="/cart"
            className="relative flex flex-col items-center gap-1 text-black/60 hover:text-black transition-colors"
          >
            <div className="relative">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6.5M17 13l1.5 6.5M9 21h6M12 17v4" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-xs">سبد خرید</span>
          </Link>

          {/* User Account */}
          <Link
            href="/login"
            className="flex flex-col items-center gap-1 text-black/60 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">حساب</span>
          </Link>
        </div>
      </nav>

      {/* Add padding bottom on mobile to prevent content from being hidden behind bottom nav */}
      <style jsx global>{`
        @media (max-width: 768px) {
          body {
            padding-bottom: 70px;
          }
        }
      `}</style>
    </>
  );
}