"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "crypto";
import {
  setAdminSession,
  clearAdminSession,
  hasAdminSession,
} from "@/lib/admin-session";
import { createServiceClient } from "@/lib/supabase/service";
import { generateBrandCode } from "@/lib/format";
import type { ContactType } from "@/lib/types";

export type ActionState = { error?: string } | undefined;

function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;

  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function adminLogin(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "").trim();

  if (!password) {
    return { error: "비밀번호를 입력해 주세요." };
  }
  if (!process.env.ADMIN_PASSWORD) {
    return {
      error:
        "관리자 비밀번호가 아직 서버에 설정되지 않았어요. Vercel 환경변수 ADMIN_PASSWORD를 확인해 주세요.",
    };
  }
  if (!passwordMatches(password)) {
    return { error: "비밀번호가 올바르지 않아요." };
  }

  setAdminSession();
  redirect("/admin/dashboard");
}

export async function adminLogout() {
  clearAdminSession();
  redirect("/admin/login");
}

function requireAdmin() {
  if (!hasAdminSession()) redirect("/admin/login");
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

export async function adminUpdateEvent(
  eventId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  requireAdmin();

  const campaignName = String(formData.get("campaign_name") ?? "").trim();
  const prize = String(formData.get("prize") ?? "").trim();
  const winnerCount = Number(formData.get("winner_count"));
  const finalUploadDate = String(formData.get("final_upload_date") ?? "");
  const contactType = String(formData.get("contact_type") ?? "") as ContactType;
  const notice = String(formData.get("notice") ?? "").trim();

  if (!campaignName || !prize || !finalUploadDate) {
    return { error: "필수 항목을 모두 입력해 주세요." };
  }
  if (!Number.isFinite(winnerCount) || winnerCount < 1) {
    return { error: "당첨자 명수를 올바르게 입력해 주세요." };
  }
  if (contactType !== "email" && contactType !== "address") {
    return { error: "정보 수집 방식을 선택해 주세요." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("comment_events")
    .update({
      campaign_name: campaignName,
      prize,
      winner_count: winnerCount,
      final_upload_date: finalUploadDate,
      contact_type: contactType,
      notice: notice || null,
    })
    .eq("id", eventId);

  if (error) return { error: "수정 중 오류가 발생했어요." };

  revalidatePath(`/admin/events/${eventId}`);
  return undefined;
}

export async function createBrand(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim() || generateBrandCode();

  if (!name) return { error: "브랜드명을 입력해 주세요." };

  const supabase = createServiceClient();
  const { error } = await supabase.from("brands").insert({ name, code });

  if (error) {
    if (error.code === "23505") return { error: "이미 사용 중인 코드예요." };
    return { error: "브랜드 등록 중 오류가 발생했어요." };
  }

  revalidatePath("/admin/brands");
  return undefined;
}

export async function deleteBrand(brandId: string) {
  requireAdmin();
  const supabase = createServiceClient();
  await supabase.from("brands").delete().eq("id", brandId);
  revalidatePath("/admin/brands");
}
