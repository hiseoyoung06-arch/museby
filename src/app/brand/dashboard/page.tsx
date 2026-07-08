import Link from "next/link";
import { getBrandIdFromSession } from "@/lib/brand-session";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export default async function BrandDashboardPage() {
  const brandId = getBrandIdFromSession()!;
  const supabase = createServiceClient();
  const { data: events } = await supabase
    .from("comment_events")
    .select("*")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold text-brand-900">댓글 이벤트</h1>
        <Link
          href="/brand/events/new"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          + 새 댓글 이벤트
        </Link>
      </div>

      {(!events || events.length === 0) && (
        <p className="rounded-xl border border-dashed border-brand-200 bg-white p-8 text-center text-sm text-gray-400">
          아직 생성된 댓글 이벤트가 없어요.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {events?.map((event) => (
          <li key={event.id}>
            <Link
              href={`/brand/events/${event.id}`}
              className="block rounded-xl border border-brand-100 bg-white p-4 hover:border-brand-300"
            >
              <p className="font-semibold text-brand-900">
                {event.campaign_name} 댓글이벤트
              </p>
              <p className="mt-1 text-sm text-gray-500">
                🎁 {event.prize} · 당첨 {event.winner_count}명 · 최종 업로드{" "}
                {event.final_upload_date}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
