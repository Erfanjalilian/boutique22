import { getSizes } from "@/lib/data";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const sizes = await getSizes();
  return apiSuccess(sizes);
}
