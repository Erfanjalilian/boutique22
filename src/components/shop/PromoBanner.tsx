import Link from "next/link";
import Image from "next/image";
import type { SiteBanner } from "@/types";

export function PromoBanner({ banner }: { banner?: SiteBanner }) {
  const resolvedBanner = banner ?? {
    id: "default",
    title: "حراج تابستانه — تا ۳۰٪ تخفیف",
    subtitle: "پیشنهاد محدود روی محصولات منتخب. کمد لباس خود را با قیمت‌های استثنایی به‌روز کنید.",
    image: "https://cdn.nody.ir/files/2024/09/20/nody-%D8%AF%D8%A7%D9%86%D8%AF%D9%88%D8%AF-%D8%B9%DA%A9%D8%B3-%D9%85%D9%86%D8%B8%D8%B1%D9%87-%D9%87%D8%A7%DB%8C-%D8%A8%D8%B1-%D8%B1%D8%A7%D8%B2-%D8%A2%D8%B3%D8%A7%D8%AF-%D8%AC%D9%86%DA%AF%D9%88-%D8%A8%D8%A7-%DA%A9%DB%8C%D9%84%D9%84%D8%AA---1726797920.jpg",
    buttonText: "مشاهده حراج",
    buttonHref: "/products?sort=price-asc",
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-yellow-400/30 to-black/20 border border-yellow-400/30 min-h-[320px]">
        
        {/* FULL COVERAGE BACKGROUND IMAGE - Add your image link below 👇 */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={resolvedBanner.image || "/Image/placeholder-product.svg"}
            alt={resolvedBanner.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('/Image/placeholder-product.svg')] bg-cover bg-center opacity-5" />
        
        {/* Content */}
        <div className="relative px-8 py-12 md:py-16 text-center z-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
            {resolvedBanner.title}
          </h2>
          <p className="text-white/90 mb-6 max-w-lg mx-auto">
            {resolvedBanner.subtitle}
          </p>
          <Link
            href={resolvedBanner.buttonHref || "/products"}
            className="inline-flex px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition-colors shadow-lg"
          >
            {resolvedBanner.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}