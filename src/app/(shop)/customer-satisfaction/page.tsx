import { CustomerSatisfactionClient } from "./CustomerSatisfactionClient";

export const metadata = {
  title: "رضایت مشتریان",
  description: "ویدئوهای رضایت مشتریان از محصولات و خدمات ما",
};

export default function CustomerSatisfactionPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            رضایت مشتریان
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            ویدئوهایی از مشتریان عزیز که تجربه خرید خود را از بوتیک ما به اشتراک گذاشته‌اند
          </p>
        </div>
        <CustomerSatisfactionClient />
      </div>
    </div>
  );
}