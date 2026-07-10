import { getAbout } from "@/lib/data";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const about = await getAbout();
  return apiSuccess(about);
}
