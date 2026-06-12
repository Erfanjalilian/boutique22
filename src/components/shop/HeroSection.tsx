import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white min-h-[600px]">
      
      {/* FULL COVERAGE BACKGROUND IMAGE - Add your image link below 👇 */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://cdn.nody.ir/files/2021/07/14/nody2-%D8%B9%DA%A9%D8%B3-%D8%B7%D9%88%D8%B7%DB%8C-%D9%88-%D9%85%D8%B1%D8%BA-%D8%B9%D8%B4%D9%82-1626288570.jpg" // 👈 Replace with your actual image URL
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/20 via-black/30 to-black/60" />
      
      {/* Decorative blur circles */}
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 z-10">
        <div className="max-w-2xl animate-fade-in">
          <p className="text-yellow-400 font-medium mb-4 tracking-wide text-sm drop-shadow-lg">
            کالکشن جدید ۱۴۰۴
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-xl">
            سبک خود را
            <span className="text-yellow-400"> ارتقا دهید</span>
          </h1>
          <p className="text-lg text-white/90 mb-8 leading-relaxed drop-shadow-md">
            اصالت و شرافت دنیای مجازی و حقیقی ندارد ، اصیل و شریف باشیم .
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-600 font-bold shadow-lg">
                خرید کنید
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="secondary" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30">
                بیشتر بدانید
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}