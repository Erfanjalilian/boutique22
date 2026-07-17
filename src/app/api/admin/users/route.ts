import { getUsers } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

export async function GET() {
  const users = await getUsers();
  return apiSuccess(users);
}
