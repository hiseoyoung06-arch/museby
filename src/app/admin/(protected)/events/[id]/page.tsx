import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { buildEventTitle } from "@/lib/format";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { EditEventForm } from "@/components/EditEventForm";
import { AdminWinnerRow } from "@/components/admin/AdminWinnerRow";
import type { Winner } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminEventPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServiceClient();
  const { data: event } = await supabase
    .from("comment_events")
    .select("*, brands(name)")
    .eq("id", params.id)
    .maybeSingle();

  if (!event) notFound();

  const { data: winners } = await supabase
    .from("winners")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: true });

  const brandName =
    (event as unknown as { brands: { name: string } | null }).brands?.name ??
    "알 수 없는 브랜드";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium text-brand-500">{brandName}</p>
        <h1 className="mb-1 text-lg font-bold text-brand-900">
          {buildEventTitle(event.campaign_name)}
        </h1>
        <p className="text-sm text-gray-500">
          🎁 {event.prize} · 당첨 {event.winner_count}명 · 최종 업로드{" "}
          {event.final_upload_date}
        </p>
        <div className="mt-3">
          <EditEventForm event={event} role="admin" />
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-brand-900">폼 링크</h2>
        <CopyLinkButton path={`/f/${event.form_slug}`} />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-brand-900">
          결과 ({winners?.length ?? 0}명 제출)
        </h2>
        {(!winners || winners.length === 0) ? (
          <p className="rounded-xl border border-dashed border-brand-200 bg-white p-8 text-center text-sm text-gray-400">
            아직 제출된 응답이 없어요.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-brand-100 bg-white">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-brand-100 text-xs text-gray-400">
                  <th className="px-3 py-2 font-medium">채널명</th>
                  <th className="px-3 py-2 font-medium">성함</th>
                  <th className="px-3 py-2 font-medium">연락처</th>
                  <th className="px-3 py-2 font-medium">
                    {event.contact_type === "email" ? "이메일" : "배송지"}
                  </th>
                  <th className="px-3 py-2 text-center font-medium">전달</th>
                  <th className="px-3 py-2 text-center font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {(winners as Winner[]).map((winner) => (
                  <AdminWinnerRow key={winner.id} eventId={event.id} winner={winner} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
