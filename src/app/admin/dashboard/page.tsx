import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createServiceClient();
  const { data: events } = await supabase
    .from("comment_events")
    .select("*, brands(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-lg font-bold text-brand-900">
        전체 댓글 이벤트
      </h1>

      {(!events || events.length === 0) && (
        <p className="rounded-xl border border-dashed border-brand-200 bg-white p-8 text-center text-sm text-gray-400">
          아직 생성된 댓글 이벤트가 없어요.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {events?.map((event) => (
          <li key={event.id}>
            <Link
              href={`/admin/events/${event.id}`}
              className="block rounded-xl border border-brand-100 bg-white p-4 hover:border-brand-300"
            >
              <p className="text-xs font-medium text-brand-500">
                {(event as { brands: { name: string } | null }).brands?.name ??
                  "알 수 없는 브랜드"}
              </p>
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
