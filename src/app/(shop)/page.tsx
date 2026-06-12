import { HeroSection } from "@/components/shop/HeroSection";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { PromoBanner } from "@/components/shop/PromoBanner";
import { getProducts, getCategories } from "@/lib/repositories";
import Image from "next/image";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <>
      <HeroSection />
      
      <ProductGrid
        products={featured}
        title="محصولات ویژه"
        subtitle="گلچینی از بهترین‌های کالکشن جدید"
      />
      
      <CategoryGrid categories={categories} />
      
      {/* New Products Banner Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-black to-yellow-500/80 border border-yellow-400/30 min-h-[320px]">
          
          {/* FULL COVERAGE BACKGROUND IMAGE */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd-kqlhhSdF3jCz7-UTiIobq7v_FV0-dAMGQ&s"
              alt="New products background"
              fill
              className="object-cover"
              priority
              unoptimized // Add this if the image is from an external source without optimization
            />
          </div>
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Content */}
          <div className="relative px-8 py-12 md:py-16 text-center z-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
              محصولات جدید — تازه‌ترین arrivals
            </h2>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              اولین نفری باشید که استایل‌های جدید را می‌پوشید. کالکشن تازه با بهترین کیفیت.
            </p>
            <div className="inline-flex px-6 py-3 bg-white text-black hover:bg-black/10 hover:text-white rounded-xl font-medium transition-colors cursor-pointer">
              مشاهده محصولات جدید
            </div>
          </div>
        </div>
      </section>
      
      <ProductGrid
        products={newArrivals}
        title="جدیدترین‌ها"
        subtitle="استایل‌های تازه واردشده"
      />
      
      <PromoBanner />
      
      {/* Best Sellers Banner Placeholder - Also add image here */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-yellow-500 to-black/80 border border-yellow-400/30 min-h-[320px]">
          
          {/* Add background image for best sellers banner too */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="https://i1.delgarm.com/i/828/0001/23/budgerigar/6073d659e3cf2.jpg" // 👈 Add your image URL here
              alt="Best sellers background"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Content */}
          <div className="relative px-8 py-12 md:py-16 text-center z-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
              پرفروش‌ترین‌ها — محبوب مشتریان
            </h2>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              محصولاتی که دیگران عاشقشون شدن. بهترین انتخاب‌ها با تخفیف ویژه.
            </p>
            <div className="inline-flex px-6 py-3 bg-yellow-500 text-black hover:bg-yellow-600 rounded-xl font-medium transition-colors cursor-pointer">
              مشاهده پرفروش‌ها
            </div>
          </div>
        </div>
      </section>
      
      <ProductGrid
        products={bestSellers}
        title="پرفروش‌ترین‌ها"
        subtitle="محبوب‌ترین انتخاب‌های مشتریان"
      />
    </>
  );
}