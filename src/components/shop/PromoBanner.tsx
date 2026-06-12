import Link from "next/link";
import Image from "next/image";

export function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-yellow-400/30 to-black/20 border border-yellow-400/30 min-h-[320px]">
        
        {/* FULL COVERAGE BACKGROUND IMAGE - Add your image link below 👇 */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://cdn.nody.ir/files/2024/09/20/nody-%D8%AF%D8%A7%D9%86%D9%84%D9%88%D8%AF-%D8%B9%DA%A9%D8%B3-%D9%85%D9%86%D8%B8%D8%B1%D9%87-%D9%85%D8%A7%D9%87-%D8%A8%D8%B1-%D9%81%D8%B1%D8%A7%D8%B2-%D8%A2%D8%B3%D9%85%D8%A7%D9%86-%D8%AC%D9%86%DA%AF%D9%84-%D8%A8%D8%A7-%DA%A9%DB%8C%D9%81%DB%8C%D8%AA---1726797920.jpg" // 👈 Replace this with your actual image URL
            alt="Promo banner background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('/Image/placeholder-product.svg')] bg-cover bg-center opacity-5" />
        
        {/* Content */}
        <div className="relative px-8 py-12 md:py-16 text-center z-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
            حراج تابستانه — تا ۳۰٪ تخفیف
          </h2>
          <p className="text-white/90 mb-6 max-w-lg mx-auto">
            پیشنهاد محدود روی محصولات منتخب. کمد لباس خود را با قیمت‌های استثنایی به‌روز کنید.
          </p>
          <Link
            href="/products?sort=price-asc"
            className="inline-flex px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition-colors shadow-lg"
          >
            مشاهده حراج
          </Link>
        </div>
      </div>
    </section>
  );
}