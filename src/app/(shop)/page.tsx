import { HeroSection } from "@/components/shop/HeroSection";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ArticleGrid } from "@/components/shop/ArticleGrid";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { ReviewsSection } from "@/components/shop/ReviewsSection";
import { PromoBanner } from "@/components/shop/PromoBanner";
import { getArticles, getProducts, getCategories, getBanners, getReviews, getHeroBanner } from "@/lib/data";

export default async function HomePage() {
  const [products, categories, banners, articles, reviews, heroBanner] = await Promise.all([
    getProducts(),
    getCategories(),
    getBanners(),
    getArticles(),
    getReviews(),
    getHeroBanner(),
  ]);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const latestArticles = articles
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <>
      <HeroSection banner={heroBanner} />
      
      <ProductGrid
        products={featured}
        title="محصولات ویژه"
        subtitle="گلچینی از بهترین‌های کالکشن جدید"
      />
      
      <ArticleGrid
        articles={latestArticles}
        title="جدیدترین مقالات"
        subtitle="مطالب تازه درباره مد و استایل"
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

      <ReviewsSection reviews={reviews} />
      
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
