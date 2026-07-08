import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { buildEventTitle, buildEventDescription } from "@/lib/format";
import { WinnerFormClient } from "@/components/WinnerFormClient";

export const dynamic = "force-dynamic";

export default async function WinnerFormPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServiceClient();
  const { data: event } = await supabase
    .from("comment_events")
    .select("*")
    .eq("form_slug", params.slug)
    .maybeSingle();

  if (!event) notFound();

  const title = buildEventTitle(event.campaign_name);
  const description = buildEventDescription(
    event.campaign_name,
    event.final_upload_date
  );

  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 py-10">
      <h1 className="mb-3 text-xl font-bold text-brand-900">{title}</h1>
      <p className="mb-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
        {description}
      </p>

      {event.notice && (
        <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="mb-1 font-semibold">주의(안내)사항</p>
          <p className="whitespace-pre-wrap">{event.notice}</p>
        </div>
      )}

      <div className="rounded-2xl border border-brand-100 bg-white p-6">
        <WinnerFormClient slug={event.form_slug} contactType={event.contact_type} />
      </div>
    </main>
  );
}
