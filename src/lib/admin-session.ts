import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "museby_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const SESSION_SUBJECT = "museby-admin";

function getSecret() {
  const secret = process.env.BRAND_SESSION_SECRET;
  if (!secret) {
    throw new Error("BRAND_SESSION_SECRET is not configured.");
  }
  return secret;
}

function sign(subject: string) {
  return createHmac("sha256", getSecret()).update(subject).digest("hex");
}

export function setAdminSession() {
  const token = `${SESSION_SUBJECT}.${sign(SESSION_SUBJECT)}`;
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

/** Reads and verifies the admin session cookie. */
export function hasAdminSession(): boolean {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;

  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex === -1) return false;

  const subject = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  if (subject !== SESSION_SUBJECT) return false;

  const expected = sign(subject);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
