import { CreateEventForm } from "@/components/brand/CreateEventForm";

export default function NewCommentEventPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-lg font-bold text-brand-900">
        새 댓글 이벤트 만들기
      </h1>
      <div className="rounded-xl border border-brand-100 bg-white p-6">
        <CreateEventForm />
      </div>
    </div>
  );
}
