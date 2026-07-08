import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "museby_brand_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  const secret = process.env.BRAND_SESSION_SECRET;
  if (!secret) {
    throw new Error("BRAND_SESSION_SECRET is not configured.");
  }
  return secret;
}

function sign(brandId: string) {
  return createHmac("sha256", getSecret()).update(brandId).digest("hex");
}

export function setBrandSession(brandId: string) {
  const token = `${brandId}.${sign(brandId)}`;
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearBrandSession() {
  cookies().delete(COOKIE_NAME);
}

/** Reads and verifies the brand session cookie, returning the brand id or null. */
export function getBrandIdFromSession(): string | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex === -1) return null;

  const brandId = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  const expected = sign(brandId);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return brandId;
}
