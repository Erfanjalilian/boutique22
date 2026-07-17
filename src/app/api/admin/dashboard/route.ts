import { getDashboardStats } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

export async function GET() {
  const stats = await getDashboardStats();
  return apiSuccess(stats);
}
