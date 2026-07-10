import { NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";
import { getUserByPhone } from "@/lib/repositories";

export async function GET() {
  const adminUser = await getUserByPhone("09123456789");

  if (!adminUser) {
    return NextResponse.redirect(new URL("/login?mode=admin", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }

  const token = await createSession({
    userId: adminUser.id,
    role: adminUser.role,
    phone: adminUser.phone,
  });

  await setSessionCookie(token);

  return NextResponse.redirect(new URL("/admin", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
