import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getUsers, saveUsers } from "@/lib/data";
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return apiError("Unauthorized", 401);

  const { id } = await params;
  const body = await request.json();
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const users = await getUsers();
  const idx = users.findIndex((item) => item.id === session.userId);
  if (idx === -1) return apiError("User not found", 404);

  const addresses = users[idx].addresses || [];
  const targetIndex = addresses.findIndex((address) => address.id === id);
  if (targetIndex === -1) return apiError("Address not found", 404);

  const nextAddress = { ...addresses[targetIndex], ...parsed.data };
  if (parsed.data.isDefault) {
    addresses.forEach((address) => {
      address.isDefault = false;
    });
  }
  addresses[targetIndex] = nextAddress;

  users[idx] = {
    ...users[idx],
    addresses,
    defaultAddressId: parsed.data.isDefault ? nextAddress.id : users[idx].defaultAddressId,
  };

  await saveUsers(users);
  return apiSuccess(nextAddress);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return apiError("Unauthorized", 401);

  const { id } = await params;
  const users = await getUsers();
  const idx = users.findIndex((item) => item.id === session.userId);
  if (idx === -1) return apiError("User not found", 404);

  const addresses = (users[idx].addresses || []).filter((address) => address.id !== id);
  const defaultAddressId = users[idx].defaultAddressId === id ? undefined : users[idx].defaultAddressId;

  users[idx] = {
    ...users[idx],
    addresses,
    defaultAddressId,
  };

  await saveUsers(users);
  return apiSuccess({ success: true });
}
