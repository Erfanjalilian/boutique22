import { getSettings } from "@/lib/data";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const settings = await getSettings();
  return apiSuccess(settings);
}
