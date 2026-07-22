import { getCustomerVideos } from "@/lib/data";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const videos = await getCustomerVideos();
  return apiSuccess(videos);
}