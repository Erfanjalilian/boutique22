const ZIBAL_REQUEST_URL = "https://gateway.zibal.ir/v1/request";
const ZIBAL_VERIFY_URL = "https://gateway.zibal.ir/v1/verify";

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
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Payment gateway responded with ${response.status}: ${text || response.statusText}`
    );
  }

  const json = await response.json().catch(() => {
    throw new Error("Invalid payment gateway response");
  });

  return json as T;
}

export async function requestZibalPayment(
  payload: ZibalRequestPayload
): Promise<ZibalRequestResponse> {
  return postJson<ZibalRequestResponse>(ZIBAL_REQUEST_URL, payload);
}

export async function verifyZibalPayment(
  merchant: string,
  trackId: string
): Promise<ZibalVerifyResponse> {
  return postJson<ZibalVerifyResponse>(ZIBAL_VERIFY_URL, {
    merchant,
    trackId,
  });
}

export function getZibalGatewayUrl(trackId: string): string {
  return `https://gateway.zibal.ir/start/${encodeURIComponent(trackId)}`;
}
