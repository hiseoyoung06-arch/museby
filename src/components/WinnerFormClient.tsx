"use client";

import { useFormState } from "react-dom";
import { submitWinnerForm } from "@/app/actions/public";
import { SubmitButton } from "@/components/SubmitButton";
import { PERSONAL_INFO_CONSENT_TEXT } from "@/lib/format";
import type { ContactType } from "@/lib/types";

const inputClass =
  "w-full border border-brand-200 px-3 py-2.5 outline-none focus:border-brand-500";
const labelClass = "mb-1 block text-sm font-medium text-brand-900";

export function WinnerFormClient({
  slug,
  contactType,
}: {
  slug: string;
  contactType: ContactType;
}) {
  const submitWithSlug = submitWinnerForm.bind(null, slug);
  const [state, formAction] = useFormState(submitWithSlug, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="channel_name" className={labelClass}>
          1. 인플루언서 채널명
        </label>
        <input id="channel_name" name="channel_name" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          2. 성함
        </label>
        <input id="name" name="name" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          3. 연락처
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="010-0000-0000"
          className={inputClass}
        />
      </div>

      {contactType === "email" ? (
        <div>
          <label htmlFor="email" className={labelClass}>
            4. 이메일주소
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="address" className={labelClass}>
              4. 배송지
            </label>
            <input id="address" name="address" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="postal_code" className={labelClass}>
              5. 우편번호
            </label>
            <input id="postal_code" name="postal_code" required className={inputClass} />
          </div>
        </>
      )}

      <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
        <p className="mb-2 whitespace-pre-wrap text-xs leading-relaxed text-gray-600">
          {PERSONAL_INFO_CONSENT_TEXT}
        </p>
        <label className="flex items-center gap-2 text-sm font-medium text-brand-900">
          <input type="checkbox" name="consent" required className="h-4 w-4 accent-brand-500" />
          개인정보 수집 및 이용에 동의합니다.
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton pendingText="제출 중...">제출하기</SubmitButton>
    </form>
  );
}
