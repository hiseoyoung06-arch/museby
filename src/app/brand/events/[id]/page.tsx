import { notFound, redirect } from "next/navigation";
import { getBrandIdFromSession } from "@/lib/brand-session";
import { createServiceClient } from "@/lib/supabase/service";
import { buildEventTitle, buildEventDescription } from "@/lib/format";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { EditEventForm } from "@/components/EditEventForm";
import { WinnerRow } from "@/components/brand/WinnerRow";
import type { Winner } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BrandEventPage({
  params,
}: {
  params: { id: string };
}) {
  const brandId = getBrandIdFromSession();
  if (!brandId) redirect("/");

  const supabase = createServiceClient();
  const { data: event } = await supabase
    .from("comment_events")
    .select("*")
    .eq("id", params.id)
    .eq("brand_id", brandId)
    .maybeSingle();

  if (!event) notFound();

  const { data: winners } = await supabase
    .from("winners")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: true });

  const title = buildEventTitle(event.campaign_name);
  const description = buildEventDescription(
    event.campaign_name,
    event.final_upload_date
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-1 text-lg font-bold text-brand-900">{title}</h1>
        <p className="text-sm text-gray-500">
          🎁 {event.prize} · 당첨 {event.winner_count}명 · 최종 업로드{" "}
          {event.final_upload_date}
        </p>
        <div className="mt-3">
          <EditEventForm event={event} role="brand" />
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-brand-900">
          당첨자에게 전달할 폼 링크
        </h2>
        <CopyLinkButton path={`/f/${event.form_slug}`} />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-brand-900">
          폼 미리보기 문구
        </h2>
        <div className="whitespace-pre-wrap rounded-xl border border-brand-100 bg-white p-4 text-sm text-gray-700">
          {description}
        </div>
        {event.notice && (
          <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="mb-1 font-semibold">주의(안내)사항</p>
            <p className="whitespace-pre-wrap">{event.notice}</p>
          </div>
        )}
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
                  <th className="px-3 py-2 text-center font-medium">동의</th>
                  <th className="px-3 py-2 text-center font-medium">전달</th>
                </tr>
              </thead>
              <tbody>
                {(winners as Winner[]).map((winner) => (
                  <WinnerRow key={winner.id} eventId={event.id} winner={winner} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
