/**
 * سرویس یکپارچه‌سازی SMS.IR
 *
 * در صورت نبود متغیر محیطی، از مقادیر پیکربندی پیش‌فرض استفاده می‌شود.
 * مستندات: https://sms.ir/
 */

const DEFAULT_SMS_IR_API_KEY = "kXetct8bHzTzBmNMucgcA9sWlxynQWQuJAOJjfpKf3x9NaKE";
const DEFAULT_SMS_IR_TEMPLATE_ID = "445959";

function getSmsIrConfig() {
  const apiKey = process.env.SMS_IR_API_KEY?.trim() || DEFAULT_SMS_IR_API_KEY;
  const templateId = process.env.SMS_IR_TEMPLATE_ID?.trim() || DEFAULT_SMS_IR_TEMPLATE_ID;
  const lineNumber = process.env.SMS_IR_LINE_NUMBER?.trim() || "";

  return { apiKey, templateId, lineNumber };
}

interface SmsIrResponse {
  status: number;
  message: string;
  trackingCode?: string;
  [key: string]: unknown;
}

const SMS_IR_VERIFY_URL = "https://api.sms.ir/v1/send/verify";
const SMS_IR_BULK_URL = "https://api.sms.ir/v1/send/bulk";

function formatSmsIrError(data: unknown, fallback: string) {
  if (typeof data === "object" && data !== null) {
    const body = data as Record<string, unknown>;
    if (typeof body.message === "string" && body.message.trim()) {
      return body.message;
    }
    if (typeof body.error === "string" && body.error.trim()) {
      return body.error;
    }
    if (Array.isArray(body.errors) && body.errors.length > 0) {
      const firstError = body.errors[0];
      if (typeof firstError === "string") return firstError;
      if (
        typeof firstError === "object" &&
        firstError !== null &&
        typeof (firstError as Record<string, unknown>).message === "string"
      ) {
        return (firstError as Record<string, unknown>).message as string;
      }
    }
  }
  return fallback;
}

function isSmsIrSuccessResponse(data: SmsIrResponse | string | null): data is SmsIrResponse {
  return typeof data === "object" && data !== null;
}

export async function sendOtp(
  phoneNumber: string,
  code: string,
): Promise<{ success: boolean; message: string }> {
  const { apiKey, templateId } = getSmsIrConfig();

  if (!apiKey || !templateId) {
    const missingParts = [];
    if (!apiKey) missingParts.push("SMS.ir API key");
    if (!templateId) missingParts.push("SMS.ir OTP template ID");

    const errorMessage = `SMS.ir configuration missing: ${missingParts.join(", ")}`;
    console.error("[SMS.IR] sendOtp configuration error", {
      phoneNumber,
      smsIrApiKeyConfigured: Boolean(apiKey),
      smsIrTemplateIdConfigured: Boolean(templateId),
    });
    return { success: false, message: errorMessage };
  }

  const payload = {
    mobile: phoneNumber,
    templateId,
    parameters: [{ name: "Code", value: code }],
  };

  try {
    console.info("[SMS.IR] sendOtp request", {
      url: SMS_IR_VERIFY_URL,
      mobile: phoneNumber,
      templateId,
    });

    const response = await fetch(SMS_IR_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    let data: SmsIrResponse | string | null = null;
    try {
      data = (await response.json()) as SmsIrResponse;
    } catch (parseError) {
      data = (await response.text().catch(() => null)) as string | null;
      console.warn("[SMS.IR] sendOtp response not valid JSON", {
        status: response.status,
        raw: data,
        parseError,
      });
    }

    console.info("[SMS.IR] sendOtp response", {
      status: response.status,
      ok: response.ok,
      body: data,
    });

    if (!response.ok || !isSmsIrSuccessResponse(data) || data.status !== 1) {
      return {
        success: false,
        message: formatSmsIrError(data, "ارسال کد تأیید ناموفق بود"),
      };
    }

    return {
      success: true,
      message: typeof data.message === "string" ? data.message : "کد تأیید با موفقیت ارسال شد",
    };
  } catch (error) {
    console.error("[SMS.IR] sendOtp request failed", {
      error,
      phoneNumber,
    });
    return { success: false, message: "سرویس پیامک در دسترس نیست" };
  }
}

export async function sendSms(
  phoneNumber: string,
  message: string,
): Promise<{ success: boolean; message: string }> {
  const { apiKey, lineNumber } = getSmsIrConfig();

  if (!apiKey || !lineNumber) {
    console.error("[SMS.IR] sendSms configuration error", {
      phoneNumber,
      smsIrApiKeyConfigured: Boolean(apiKey),
      smsIrLineNumberConfigured: Boolean(lineNumber),
    });
    return { success: false, message: "خطای پیکربندی SMS.ir برای ارسال پیامک رخ داده است" };
  }

  const payload = {
    lineNumber,
    messageText: message,
    mobiles: [phoneNumber],
  };

  try {
    console.info("[SMS.IR] sendSms request", {
      url: SMS_IR_BULK_URL,
      lineNumber,
      mobiles: [phoneNumber],
    });

    const response = await fetch(SMS_IR_BULK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    let data: SmsIrResponse | string | null = null;
    try {
      data = (await response.json()) as SmsIrResponse;
    } catch (parseError) {
      data = (await response.text().catch(() => null)) as string | null;
      console.warn("[SMS.IR] sendSms response not valid JSON", {
        status: response.status,
        raw: data,
        parseError,
      });
    }

    console.info("[SMS.IR] sendSms response", {
      status: response.status,
      ok: response.ok,
      body: data,
    });

    if (!response.ok || !isSmsIrSuccessResponse(data) || data.status !== 1) {
      return {
        success: false,
        message: formatSmsIrError(data, "ارسال پیامک ناموفق بود"),
      };
    }

    return {
      success: true,
      message: typeof data.message === "string" ? data.message : "پیامک با موفقیت ارسال شد",
    };
  } catch (error) {
    console.error("[SMS.IR] sendSms request failed", {
      error,
      phoneNumber,
    });
    return { success: false, message: "سرویس پیامک در دسترس نیست" };
  }
}
