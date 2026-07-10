import { z } from "zod";
import { createSession, setSessionCookie } from "@/lib/auth";
import { getUserByPhone } from "@/lib/data";
import { apiSuccess, apiError } from "@/utils/api";

const schema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "کلمه عبور الزامی است"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { username, password } = parsed.data;

    if (username !== "joojino" || password !== "1383") {
      return apiError("نام کاربری یا کلمه عبور اشتباه است");
    }

    const adminUser = await getUserByPhone("09123456789");
    if (!adminUser) {
      return apiError("حساب مدیر یافت نشد", 404);
    }

    const token = await createSession({
      userId: adminUser.id,
      role: adminUser.role,
      phone: adminUser.phone,
    });

    await setSessionCookie(token);

    return apiSuccess({
      user: {
        id: adminUser.id,
        phone: adminUser.phone,
        name: adminUser.name,
        firstName: adminUser.firstName || adminUser.name.split(" ")[0] || "",
        lastName: adminUser.lastName || adminUser.name.split(" ").slice(1).join(" ") || "",
        email: adminUser.email || "",
        address: adminUser.address,
        postalCode: adminUser.postalCode,
        addresses: adminUser.addresses || [],
        defaultAddressId: adminUser.defaultAddressId,
        role: adminUser.role,
      },
      redirectTo: "/admin",
    });
  } catch {
    return apiError("خطای سرور", 500);
  }
}
