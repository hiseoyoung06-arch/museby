"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { updateCommentEvent } from "@/app/actions/brand";
import { adminUpdateEvent } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";
import type { CommentEvent } from "@/lib/types";

const inputClass =
  "w-full border border-brand-200 px-3 py-2.5 outline-none focus:border-brand-500";
const labelClass = "mb-1 block text-sm font-medium text-brand-900";

export function EditEventForm({
  event,
  role,
}: {
  event: CommentEvent;
  role: "brand" | "admin";
}) {
  const [editing, setEditing] = useState(false);
  const boundUpdate =
    role === "brand"
      ? updateCommentEvent.bind(null, event.id)
      : adminUpdateEvent.bind(null, event.id);
  const [state, formAction] = useFormState(boundUpdate, undefined);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-sm text-brand-500 hover:underline"
      >
        이벤트 정보 수정
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await formAction(formData);
        setEditing(false);
      }}
      className="flex flex-col gap-4 rounded-xl border border-brand-100 bg-white p-5"
    >
      <div>
        <label htmlFor="campaign_name" className={labelClass}>
          진행 중인 뮤즈바이 캠페인명
        </label>
        <input
          id="campaign_name"
          name="campaign_name"
          defaultValue={event.campaign_name}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="prize" className={labelClass}>
          당첨자 상품
        </label>
        <input
          id="prize"
          name="prize"
          defaultValue={event.prize}
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="winner_count" className={labelClass}>
            당첨자 명수
          </label>
          <input
            id="winner_count"
            name="winner_count"
            type="number"
            min={1}
            defaultValue={event.winner_count}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="final_upload_date" className={labelClass}>
            최종 업로드 예정일
          </label>
          <input
            id="final_upload_date"
            name="final_upload_date"
            type="date"
            defaultValue={event.final_upload_date}
            required
            className={inputClass}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>당첨자 정보 수집 방식</legend>
        <div className="flex gap-4 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="contact_type"
              value="email"
              defaultChecked={event.contact_type === "email"}
              required
            />
            이메일 주소
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="contact_type"
              value="address"
              defaultChecked={event.contact_type === "address"}
            />
            배송지
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="notice" className={labelClass}>
          주의(안내)사항 <span className="text-gray-400">(선택)</span>
        </label>
        <textarea
          id="notice"
          name="notice"
          rows={3}
          defaultValue={event.notice ?? ""}
          className={inputClass}
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-2">
        <SubmitButton
          pendingText="저장 중..."
          className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          저장
        </SubmitButton>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-lg border border-brand-200 px-4 py-2.5 text-sm text-gray-600"
        >
          취소
        </button>
      </div>
    </form>
  );
}
