"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";
import { createBrand } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

const inputClass =
  "w-full border border-brand-200 px-3 py-2.5 outline-none focus:border-brand-500";
const labelClass = "mb-1 block text-sm font-medium text-brand-900";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomBrandCode() {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return `MUSEBY-${suffix}`;
}

export function CreateBrandForm() {
  const [state, formAction] = useFormState(createBrand, undefined);
  const codeInputRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className={labelClass}>
          브랜드명
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="예: 뷰티브랜드A"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="code" className={labelClass}>
          브랜드 코드
        </label>
        <div className="flex gap-2">
          <input
            id="code"
            name="code"
            ref={codeInputRef}
            placeholder="예: MUSEBY-ABC123"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => {
              if (codeInputRef.current) {
                codeInputRef.current.value = randomBrandCode();
              }
            }}
            className="shrink-0 whitespace-nowrap rounded-md border border-brand-200 px-3 text-sm text-brand-500"
          >
            자동생성
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          비워두면 자동으로 생성돼요.
        </p>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton pendingText="등록 중...">브랜드 코드 등록</SubmitButton>
    </form>
  );
}
