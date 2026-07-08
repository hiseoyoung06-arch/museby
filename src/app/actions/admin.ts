"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";

export type ActionState = { error?: string } | undefined;

export async function adminToggleDelivered(
  eventId: string,
  winnerId: string,
  delivered: boolean
) {
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
