import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "museby_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.BRAND_SESSION_SECRET;
  if (!secret) {
    throw new Error("BRAND_SESSION_SECRET is not configured.");
  }
  return secret;
}

function sign(email: string) {
  return createHmac("sha256", getSecret()).update(email).digest("hex");
}

export function setAdminSession(email: string) {
  const token = `${email}.${sign(email)}`;
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

/** Reads and verifies the admin session cookie, returning the admin email or null. */
export function getAdminEmailFromSession(): string | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex === -1) return null;

  const email = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  const expected = sign(email);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return email;
}
