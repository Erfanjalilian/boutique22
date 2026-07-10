import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return apiError("Unauthorized", 401);
  }

  const user = await getUserById(session.userId);
  if (!user) {
    return apiError("User not found", 404);
  }

  return apiSuccess({
    id: user.id,
    phone: user.phone,
    name: user.name,
    firstName: user.firstName || user.name.split(" ")[0] || "",
    lastName: user.lastName || user.name.split(" ").slice(1).join(" ") || "",
    email: user.email || "",
    address: user.address,
    postalCode: user.postalCode,
    addresses: user.addresses || [],
    defaultAddressId: user.defaultAddressId,
    role: user.role,
  });
}
