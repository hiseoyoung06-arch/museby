"use client";

import { useFormState } from "react-dom";
import { adminLogin } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

const inputClass =
  "w-full border border-brand-200 px-3 py-2.5 outline-none focus:border-brand-500";
const labelClass = "mb-1 block text-sm font-medium text-brand-900";

export function LoginForm() {
  const [state, formAction] = useFormState(adminLogin, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className={labelClass}>
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="name@whitecube.co.kr"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className={inputClass}
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton pendingText="로그인 중...">로그인</SubmitButton>
    </form>
  );
}
