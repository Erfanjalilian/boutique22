import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/20 via-white to-white" />
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-2xl animate-fade-in">
          <p className="text-yellow-600 font-medium mb-4 tracking-wide text-sm">
            کالکشن جدید ۱۴۰۴
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-black">
            سبک خود را
            <span className="text-yellow-500"> ارتقا دهید</span>
          </h1>
          <p className="text-lg text-black/70 mb-8 leading-relaxed">
            اصالت و شرافت دنیای مجازی و حقیقی ندارد ، اصیل و شریف باشیم .
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg" className="bg-black text-white hover:bg-black/80">
                خرید کنید
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="secondary" className="bg-yellow-500 text-black hover:bg-yellow-600">
                بیشتر بدانید
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}