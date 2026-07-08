"use client";

import { useFormState } from "react-dom";
import { verifyBrandCode } from "@/app/actions/brand";
import { SubmitButton } from "@/components/SubmitButton";

export function CodeEntryForm() {
  const [state, formAction] = useFormState(verifyBrandCode, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label htmlFor="code" className="text-sm font-medium text-brand-900">
        브랜드 코드
      </label>
      <input
        id="code"
        name="code"
        placeholder="뮤즈바이에서 받은 브랜드 코드를 입력해 주세요"
        required
        autoFocus
        className="border border-brand-200 px-3 py-2.5 outline-none focus:border-brand-500"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton pendingText="확인 중...">입장하기</SubmitButton>
    </form>
  );
}
