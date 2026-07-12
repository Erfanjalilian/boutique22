import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default function Admin1383Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background p-4 pt-16 sm:p-6 md:p-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}
