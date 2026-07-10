import type { Metadata } from "next";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import { CartProvider } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { getSettings } from "@/lib/data";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
    icons: { icon: settings.favicon || "/Image/logo.svg" },
    other: {
      enamad: "18529217",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
          {/* Toast notifications rendered outside the router tree */}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
