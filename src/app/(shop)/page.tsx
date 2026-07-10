import { HeroSection } from "@/components/shop/HeroSection";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { PromoBanner } from "@/components/shop/PromoBanner";
import { getProducts, getCategories, getBanners } from "@/lib/repositories";

export default async function HomePage() {
  const [products, categories, banners] = await Promise.all([
    getProducts(),
    getCategories(),
    getBanners(),
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
      
      {banners.length > 0 ? (
        <div className="space-y-6 py-12">
          {banners.map((banner) => (
            <PromoBanner key={banner.id} banner={banner} />
          ))}
        </div>
      ) : (
        <PromoBanner />
      )}
      
      <ProductGrid
        products={newArrivals}
        title="جدیدترین‌ها"
        subtitle="استایل‌های تازه واردشده"
      />
      
      <ProductGrid
        products={bestSellers}
        title="پرفروش‌ترین‌ها"
        subtitle="محبوب‌ترین انتخاب‌های مشتریان"
      />
    </>
  );
}