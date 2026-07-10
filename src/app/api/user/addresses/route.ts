import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getUsers, saveUsers } from "@/lib/data";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  province: z.string().min(2),
  city: z.string().min(2),
  streetAddress: z.string().min(5),
  postalCode: z.string().min(4),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return apiError("Unauthorized", 401);

  const users = await getUsers();
  const user = users.find((item) => item.id === session.userId);
  if (!user) return apiError("User not found", 404);

  return apiSuccess(user.addresses || []);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return apiError("Unauthorized", 401);

  const body = await request.json();
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const users = await getUsers();
  const idx = users.findIndex((item) => item.id === session.userId);
  if (idx === -1) return apiError("User not found", 404);

  const addresses = users[idx].addresses || [];
  const nextAddress = { id: generateId(), ...parsed.data };

  if (parsed.data.isDefault) {
    addresses.forEach((address) => {
      address.isDefault = false;
    });
  }

  addresses.push(nextAddress);
  users[idx] = {
    ...users[idx],
    addresses,
    defaultAddressId: parsed.data.isDefault ? nextAddress.id : users[idx].defaultAddressId,
  };

  await saveUsers(users);
  return apiSuccess(nextAddress, 201);
}
