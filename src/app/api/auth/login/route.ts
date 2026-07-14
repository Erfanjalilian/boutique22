import { z } from "zod";
import { createSession, setSessionCookie } from "@/lib/auth";
import { getUserByUsername } from "@/lib/data";
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
    const user = await getUserByUsername(username);

    if (!user || !user.password || user.password !== password) {
      return apiError("نام کاربری یا کلمه عبور اشتباه است");
    }

    const token = await createSession({
      userId: user.id,
      role: user.role,
      phone: user.phone,
    });

    await setSessionCookie(token);

    return apiSuccess({
      user: {
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
      },
      redirectTo: user.role === "admin" ? "/admin" : "/dashboard",
    });
  } catch {
    return apiError("خطای سرور", 500);
  }
}
