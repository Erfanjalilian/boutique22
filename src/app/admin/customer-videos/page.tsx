import { getCustomerVideos } from "@/lib/data";
import { CustomerVideosAdminClient } from "@/features/admin/CustomerVideosAdminClient";

export default async function AdminCustomerVideosPage() {
  const videos = await getCustomerVideos();

  return <CustomerVideosAdminClient initialVideos={videos} />;
}