"use client";

import { useFormState } from "react-dom";
import { createCommentEvent } from "@/app/actions/brand";
import { SubmitButton } from "@/components/SubmitButton";

const inputClass =
  "w-full border border-brand-200 px-3 py-2.5 outline-none focus:border-brand-500";
const labelClass = "mb-1 block text-sm font-medium text-brand-900";

export function CreateEventForm() {
  const [state, formAction] = useFormState(createCommentEvent, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="campaign_name" className={labelClass}>
          진행 중인 뮤즈바이 캠페인명
        </label>
        <input
          id="campaign_name"
          name="campaign_name"
          required
          placeholder="예: OO 크림 체험단"
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
          required
          placeholder="예: 스타벅스 기프티콘"
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
            required
            className={inputClass}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>당첨자 정보 수집 방식</legend>
        <div className="flex gap-4 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input type="radio" name="contact_type" value="email" required />
            이메일 주소
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="contact_type" value="address" />
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
          placeholder="당첨자에게 추가로 안내할 내용이 있다면 입력해 주세요."
          className={inputClass}
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton pendingText="생성 중...">댓글 이벤트 생성</SubmitButton>
    </form>
  );
}
