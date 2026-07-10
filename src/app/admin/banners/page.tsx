import { getBanners } from "@/lib/repositories";
import { BannersAdminClient } from "@/features/admin/BannersAdminClient";

export default async function AdminBannersPage() {
  const banners = await getBanners();
  return <BannersAdminClient initialBanners={banners} />;
}
