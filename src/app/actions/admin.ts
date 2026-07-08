"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "crypto";
import {
  setAdminSession,
  clearAdminSession,
  getAdminEmailFromSession,
} from "@/lib/admin-session";
import { createServiceClient } from "@/lib/supabase/service";

export type ActionState = { error?: string } | undefined;

const ADMIN_EMAIL_DOMAIN = (process.env.ADMIN_EMAIL_DOMAIN ?? "whitecube.co.kr").toLowerCase();

function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function adminLogin(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해 주세요." };
  }
  if (!email.endsWith(`@${ADMIN_EMAIL_DOMAIN}`) || !passwordMatches(password)) {
    return { error: "이메일 또는 비밀번호가 올바르지 않아요." };
  }

  setAdminSession(email);
  redirect("/admin/dashboard");
}

export async function adminLogout() {
  clearAdminSession();
  redirect("/admin/login");
}

function requireAdmin(): string {
  const email = getAdminEmailFromSession();
  if (!email) redirect("/admin/login");
  return email;
}

export async function adminToggleDelivered(
  eventId: string,
  winnerId: string,
  delivered: boolean
) {
  requireAdmin();
  const supabase = createServiceClient();
  await supabase
    .from("winners")
    .update({ delivered })
    .eq("id", winnerId)
    .eq("event_id", eventId);

  revalidatePath(`/admin/events/${eventId}`);
}

export async function adminUpdateWinner(
  eventId: string,
  winnerId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  requireAdmin();

  const channelName = String(formData.get("channel_name") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const postalCode = String(formData.get("postal_code") ?? "").trim();

  if (!channelName || !name || !phone) {
    return { error: "필수 항목을 모두 입력해 주세요." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("winners")
    .update({
      channel_name: channelName,
      name,
      phone,
      email: email || null,
      address: address || null,
      postal_code: postalCode || null,
    })
    .eq("id", winnerId)
    .eq("event_id", eventId);

  if (error) return { error: "수정 중 오류가 발생했어요." };

  revalidatePath(`/admin/events/${eventId}`);
  return undefined;
}
