import { z } from "zod";
import { generateId } from "@/utils/helpers";
import { createSession, setSessionCookie } from "@/lib/auth";
import { getUsers, saveUsers, getUserByUsername, getUserByPhone } from "@/lib/data";
import type { User } from "@/types";
import { apiSuccess, apiError } from "@/utils/api";

const schema = z.object({
  username: z.string().min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد"),
  password: z.string().min(6, "کلمه عبور باید حداقل ۶ کاراکتر باشد"),
  name: z.string().min(2, "نام و نام خانوادگی الزامی است"),
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل نامعتبر است"),
  address: z.string().min(5, "آدرس الزامی است"),
  postalCode: z.string().min(4, "کد پستی الزامی است"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { username, password, name, phone, address, postalCode } = parsed.data;

    if (await getUserByUsername(username)) {
      return apiError("نام کاربری قبلا استفاده شده است");
    }

    if (await getUserByPhone(phone)) {
      return apiError("شماره موبایل قبلا ثبت شده است");
    }

    const user: User = {
      id: generateId(),
      username,
      password,
      phone,
      name,
      address,
      postalCode,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    const users = await getUsers();
    users.push(user);
    await saveUsers(users);

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
        firstName: user.name.split(" ")[0] || "",
        lastName: user.name.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        address: user.address,
        postalCode: user.postalCode,
        addresses: user.addresses || [],
        defaultAddressId: user.defaultAddressId,
        role: user.role,
      },
      redirectTo: "/dashboard",
    });
  } catch {
    return apiError("خطای سرور", 500);
  }
}
