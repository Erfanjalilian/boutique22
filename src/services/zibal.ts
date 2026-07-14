const ZIBAL_REQUEST_URL = "https://gateway.zibal.ir/v1/request";
const ZIBAL_VERIFY_URL = "https://gateway.zibal.ir/v1/verify";

import { info, warn, error as logError } from "@/utils/logger";

export interface ZibalRequestPayload {
  merchant: string;
  amount: number;
  callbackUrl: string;
  description?: string;
  mobile?: string;
}

export interface ZibalRequestResponse {
  result: number;
  message: string;
  trackId?: string;
}

export interface ZibalVerifyResponse {
  result: number;
  message: string;
  amount?: number;
  orderId?: string;
  trackId?: string;
  referenceNumber?: string;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  info("Zibal POST", { url, body });
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch((err) => {
    logError("Network error when calling Zibal", err);
    throw err;
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const msg = `Payment gateway responded with ${response.status}: ${text || response.statusText}`;
    logError(msg);
    throw new Error(msg);
  }

  const json = await response.json().catch((err) => {
    logError("Failed parsing JSON from Zibal", err);
    throw new Error("Invalid payment gateway response");
  });

  info("Zibal response", { url, json });
  return json as T;
}

export async function requestZibalPayment(
  payload: ZibalRequestPayload
): Promise<ZibalRequestResponse> {
  try {
    return await postJson<ZibalRequestResponse>(ZIBAL_REQUEST_URL, payload);
  } catch (err) {
    logError("requestZibalPayment failed", err);
    throw err;
  }
}

export async function verifyZibalPayment(
  merchant: string,
  trackId: string
): Promise<ZibalVerifyResponse> {
  try {
    return await postJson<ZibalVerifyResponse>(ZIBAL_VERIFY_URL, {
      merchant,
      trackId,
    });
  } catch (err) {
    logError("verifyZibalPayment failed", err);
    throw err;
  }
}

export function getZibalGatewayUrl(trackId: string): string {
  return `https://gateway.zibal.ir/start/${encodeURIComponent(trackId)}`;
}
