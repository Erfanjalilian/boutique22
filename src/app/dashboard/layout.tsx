import { UserSidebar } from "@/components/dashboard/UserSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />

      {/* Main content area — extra top padding on mobile to clear the hamburger button */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
