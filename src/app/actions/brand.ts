"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import {
  setBrandSession,
  clearBrandSession,
  getBrandIdFromSession,
} from "@/lib/brand-session";
import { generateFormSlug } from "@/lib/format";
import type { ContactType } from "@/lib/types";

export type ActionState = { error?: string } | undefined;

export async function verifyBrandCode(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const code = String(formData.get("code") ?? "").trim();
  if (!code) return { error: "코드를 입력해 주세요." };

  const supabase = createServiceClient();
  const { data: brand, error } = await supabase
    .from("brands")
    .select("id")
    .eq("code", code)
    .maybeSingle();

  if (error) return { error: "코드 확인 중 오류가 발생했어요. 다시 시도해 주세요." };
  if (!brand) return { error: "일치하는 브랜드 코드가 없어요. 코드를 다시 확인해 주세요." };

  setBrandSession(brand.id);
  redirect("/brand/dashboard");
}

export async function brandLogout() {
  clearBrandSession();
  redirect("/");
}

function requireBrandId(): string {
  const brandId = getBrandIdFromSession();
  if (!brandId) redirect("/");
  return brandId;
}

export async function createCommentEvent(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const brandId = requireBrandId();

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
  const { data: event, error } = await supabase
    .from("comment_events")
    .insert({
      brand_id: brandId,
      campaign_name: campaignName,
      prize,
      winner_count: winnerCount,
      final_upload_date: finalUploadDate,
      contact_type: contactType,
      notice: notice || null,
      form_slug: generateFormSlug(),
    })
    .select("id")
    .single();

  if (error || !event) {
    return { error: "댓글 이벤트 생성 중 오류가 발생했어요." };
  }

  revalidatePath("/brand/dashboard");
  redirect(`/brand/events/${event.id}`);
}

export async function toggleWinnerDelivered(
  eventId: string,
  winnerId: string,
  delivered: boolean
) {
  const brandId = requireBrandId();
  const supabase = createServiceClient();

  const { data: event } = await supabase
    .from("comment_events")
    .select("id")
    .eq("id", eventId)
    .eq("brand_id", brandId)
    .maybeSingle();
  if (!event) redirect("/brand/dashboard");

  await supabase
    .from("winners")
    .update({ delivered })
    .eq("id", winnerId)
    .eq("event_id", eventId);

  revalidatePath(`/brand/events/${eventId}`);
}
