import Link from "next/link";

interface FooterProps {
  websiteName?: string;
  footerText?: string;
  footerLinks?: { label: string; href: string }[];
}

export function Footer({
  footerLinks = [],
}: FooterProps) {
  return (
    <footer className="mt-auto border-t border-black/10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3 text-black">JOOJINO</h3>
            <p className="text-sm text-black/70 leading-relaxed">
              اصالت و شرافت دنیای مجازی و حقیقی ندارد ، اصیل و شریف باشیم .
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-black/60">
              لینک‌های سریع
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-black/70 hover:text-yellow-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-black/60">
              پشتیبانی مشتریان
            </h4>
            <ul className="space-y-2 text-sm text-black/70">
              <li>
                <Link href="/contact" className="hover:text-yellow-600 transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/dashboard/orders" className="hover:text-yellow-600 transition-colors">
                  پیگیری سفارش
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-black/10 text-center text-sm text-black/60">
          طراحی شده توسط عرفان جلیلیان
        </div>
      </div>
    </footer>
  );
}