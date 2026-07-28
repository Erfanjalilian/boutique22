import { getHeroBanner } from "@/lib/data";
import { HeroBannerAdminClient } from "@/features/admin/HeroBannerAdminClient";

export default async function AdminHeroBannerPage() {
  const banner = await getHeroBanner();
  return <HeroBannerAdminClient initialBanner={banner} />;
}