import { z } from "zod";
import { sendOtp } from "@/services/sms";
import { getOtps, saveOtps } from "@/lib/repositories";
import { generateOtp } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const schema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل نامعتبر است"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { phone } = parsed.data;
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const result = await sendOtp(phone, code);

    if (!result.success) {
      console.error("[OTP] sendOtp failed", { phone, reason: result.message });
      return apiError(result.message, 500);
    }

    const otps = await getOtps();
    const filtered = otps.filter((o) => o.phone !== phone);
    filtered.push({ phone, code, expiresAt });
    await saveOtps(filtered);

    return apiSuccess({ message: result.message });
  } catch (error) {
    console.error("[OTP] send-otp route error", { error });
    return apiError("خطای سرور", 500);
  }
}
