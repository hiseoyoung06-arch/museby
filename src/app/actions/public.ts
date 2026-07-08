"use server";

import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";

export type ActionState = { error?: string } | undefined;

export async function submitWinnerForm(
  slug: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = createServiceClient();
  const { data: event } = await supabase
    .from("comment_events")
    .select("id, contact_type")
    .eq("form_slug", slug)
    .maybeSingle();

  if (!event) return { error: "존재하지 않는 이벤트예요." };

  const channelName = String(formData.get("channel_name") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const consent = formData.get("consent") === "on";

  if (!channelName || !name || !phone) {
    return { error: "필수 항목을 모두 입력해 주세요." };
  }
  if (!consent) {
    return { error: "개인정보 수집 및 이용에 동의해 주세요." };
  }

  let email: string | null = null;
  let address: string | null = null;
  let postalCode: string | null = null;

  if (event.contact_type === "email") {
    email = String(formData.get("email") ?? "").trim();
    if (!email) return { error: "이메일 주소를 입력해 주세요." };
  } else {
    address = String(formData.get("address") ?? "").trim();
    postalCode = String(formData.get("postal_code") ?? "").trim();
    if (!address || !postalCode) {
      return { error: "배송지와 우편번호를 입력해 주세요." };
    }
  }

  const { error } = await supabase.from("winners").insert({
    event_id: event.id,
    channel_name: channelName,
    name,
    phone,
    email,
    address,
    postal_code: postalCode,
    consent,
  });

  if (error) return { error: "제출 중 오류가 발생했어요. 다시 시도해 주세요." };

  redirect(`/f/${slug}/thanks`);
}
