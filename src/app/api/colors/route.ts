import { getColors } from "@/lib/data";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const colors = await getColors();
  return apiSuccess(colors);
}
