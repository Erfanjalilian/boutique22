"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import type { Product, Category } from "@/types";

const ITEMS_PER_PAGE = 12;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchTokens(query: string) {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function matchesProduct(product: Product, tokens: string[], categories: Category[]) {
  // Match only against the product name (title) as requested by the user.
  const name = (product.name || "").toLowerCase();
  return tokens.every((token) => name.includes(token));
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const tokens = buildSearchTokens(query);

  if (!tokens.length) {
    return <>{text}</>;
  }

  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "ig");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = tokens.some((token) => token === part.toLowerCase());
        return isMatch ? (
          <mark key={`${part}-${index}`} className="rounded bg-yellow-100 px-0.5 text-yellow-700">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </>
  );
}

export function ProductsClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const nextSearch = searchParams.get("search") || "";
    const nextCategory = searchParams.get("category") || "";
    const nextBrand = searchParams.get("brand") || "";
    const nextMinPrice = searchParams.get("minPrice") || "";
    const nextMaxPrice = searchParams.get("maxPrice") || "";

    setSearch(nextSearch);
    setCategory(nextCategory);
    setBrand(nextBrand);
    setMinPrice(nextMinPrice);
    setMaxPrice(nextMaxPrice);
    setPage(1);
  }, [searchParams]);

  const searchTokens = useMemo(() => buildSearchTokens(search), [search]);

  const brandOptions = useMemo(() => {
    return Array.from(
      new Set(initialProducts.map((product) => product.brand).filter(Boolean))
    ).sort() as string[];
  }, [initialProducts]);

  // suggestions removed: quick suggestion dropdown disabled

  const filtered = useMemo(() => {
    let result = [...initialProducts];

    if (searchTokens.length) {
      result = result.filter((product) => matchesProduct(product, searchTokens, categories));
    }

    if (category) {
      result = result.filter((product) => product.categoryId === category);
    }

    if (brand) {
      result = result.filter((product) => product.brand === brand);
    }

    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    result = result.filter((product) => product.price >= min && product.price <= max);

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "fa"));
        break;
      default:
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [brand, categories, category, initialProducts, maxPrice, minPrice, searchTokens, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, category, brand, minPrice, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const hasActiveFilters = Boolean(search.trim() || category || brand || minPrice || maxPrice || sort !== "newest");

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="relative">
        <Input
          label="جستجو"
          placeholder="نام محصول..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {/* Quick suggestions removed: search will filter displayed products only */}
      </div>

      <Select
        label="دسته‌بندی"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        options={[
          { value: "", label: "همه دسته‌ها" },
          ...categories.map((item) => ({ value: item.id, label: item.name })),
        ]}
      />

      {brandOptions.length > 0 && (
        <Select
          label="برند"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          options={[
            { value: "", label: "همه برندها" },
            ...brandOptions.map((item) => ({ value: item, label: item })),
          ]}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="حداقل قیمت"
          type="number"
          placeholder="۰"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
        />
        <Input
          label="حداکثر قیمت"
          type="number"
          placeholder="۹۹۹۹۹۹۹"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />
      </div>

      <Select
        label="مرتب‌سازی"
        value={sort}
        onChange={(event) => setSort(event.target.value)}
        options={[
          { value: "newest", label: "جدیدترین" },
          { value: "price-asc", label: "ارزان‌ترین" },
          { value: "price-desc", label: "گران‌ترین" },
          { value: "name", label: "نام" },
        ]}
      />

      {hasActiveFilters && (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setSearch("");
            setCategory("");
            setBrand("");
            setMinPrice("");
            setMaxPrice("");
            setSort("newest");
          }}
        >
          پاک‌کردن فیلترها
        </Button>
      )}

      <Button className="w-full lg:hidden" onClick={() => setIsDrawerOpen(false)}>
        اعمال فیلترها
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-black/10 bg-gradient-to-br from-white via-yellow-50/70 to-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-yellow-600">جستجوی هوشمند</p>
            <h1 className="mt-2 text-3xl font-bold text-black sm:text-4xl">محصول موردنظر را سریع پیدا کنید</h1>
            <p className="mt-3 text-sm leading-7 text-black/70 sm:text-base">
              با جستجو در نام محصول، نتیجه‌های مرتبط و دقیق را در چند لحظه ببینید.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/80 p-4 shadow-sm">
            <p className="text-sm font-medium text-black">محصولات موجود</p>
            <p className="mt-1 text-3xl font-bold text-yellow-600">{initialProducts.length}</p>
            <p className="text-sm text-black/60">در انبار و قابل سفارش</p>
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-black/10 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-yellow-600">
                <path fill="currentColor" d="M10.5 4a6.5 6.5 0 015.2 11.2l4.3 4.3-1.4 1.4-4.3-4.3A6.5 6.5 0 1110.5 4zm0 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
              </svg>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جستجوی محصولات..."
                className="w-full border-0 bg-transparent text-right text-sm outline-none placeholder:text-black/40"
              />
            </div>
            <Button variant="secondary" className="md:min-w-40" onClick={() => setIsDrawerOpen(true)}>
              فیلتر و مرتب‌سازی
            </Button>
          </div>

          {/* Quick suggestion chips removed */}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">نتایج جستجو</h2>
          <p className="mt-1 text-sm text-black/70">
            {filtered.length > 0
              ? `نمایش ${paginated.length} از ${filtered.length} محصول برای «${search || "همه محصولات"}»`
              : "هیچ نتیجه‌ای با این شرایط یافت نشد."}
          </p>
        </div>
        <Button variant="secondary" className="hidden lg:inline-flex" onClick={() => setIsDrawerOpen(true)}>
          فیلتر‌ها
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="hidden lg:block space-y-4">
          <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
            <FilterContent />
          </div>
        </aside>

        <div className="lg:col-span-3">
          {paginated.length === 0 ? (
            <EmptyState
              title="محصولی یافت نشد"
              description="عبارت جستجو یا فیلترهای انتخابی را تغییر دهید تا نتیجه‌های جدیدی ببینید."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    قبلی
                  </Button>
                  <span className="px-4 text-sm text-black/70">
                    صفحه {page} از {totalPages}
                  </span>
                  <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    بعدی
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background shadow-xl lg:hidden">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-black/10 p-4">
                <h2 className="text-xl font-bold text-black">فیلتر محصولات</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="rounded-lg p-2 hover:bg-black/5" aria-label="بستن">
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterContent />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}