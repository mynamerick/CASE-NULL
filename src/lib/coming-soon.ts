/** Preview gate — enabled with COMING_SOON=true and a COMING_SOON_PASSWORD. */

export const COMING_SOON_COOKIE = "cn_preview_access";

const PREVIEW_SALT = "cn-preview-access-v1";

function parseTruthyFlag(value: string | undefined): boolean {
  const flag = value?.trim().toLowerCase();
  return flag === "true" || flag === "1" || flag === "yes";
}

export function isComingSoonEnabled(): boolean {
  return parseTruthyFlag(process.env.COMING_SOON);
}

export function getComingSoonPassword(): string | null {
  const password = process.env.COMING_SOON_PASSWORD?.trim();
  return password ? password : null;
}

export function isComingSoonConfigured(): boolean {
  return isComingSoonEnabled() && Boolean(getComingSoonPassword());
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const base64 =
    typeof btoa === "function"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createPreviewToken(password: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(PREVIEW_SALT));
  return bytesToBase64Url(new Uint8Array(sig));
}

export async function getExpectedPreviewToken(): Promise<string | null> {
  const password = getComingSoonPassword();
  if (!password) return null;
  return createPreviewToken(password);
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function hasValidPreviewCookie(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await getExpectedPreviewToken();
  if (!expected) return false;
  return timingSafeEqual(cookieValue, expected);
}
