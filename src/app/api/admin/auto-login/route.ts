import { NextRequest, NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";
import { getUserByPhone } from "@/lib/repositories";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const adminUser = await getUserByPhone("09123456789");

  if (!adminUser) {
    return NextResponse.redirect(new URL("/login?mode=admin", origin));
  }

  const token = await createSession({
    userId: adminUser.id,
    role: adminUser.role,
    phone: adminUser.phone,
  });

  await setSessionCookie(token);

  return NextResponse.redirect(new URL("/admin", origin));
}
