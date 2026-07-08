"use client";

import { useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { adminToggleDelivered, adminUpdateWinner } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";
import type { Winner } from "@/lib/types";

const inputClass =
  "w-full border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500";

export function AdminWinnerRow({
  eventId,
  winner,
}: {
  eventId: string;
  winner: Winner;
}) {
  const [editing, setEditing] = useState(false);
  const [delivered, setDelivered] = useState(winner.delivered);
  const [isPending, startTransition] = useTransition();
  const updateAction = adminUpdateWinner.bind(null, eventId, winner.id);
  const [state, formAction] = useFormState(updateAction, undefined);

  function handleToggle() {
    const next = !delivered;
    setDelivered(next);
    startTransition(() => {
      adminToggleDelivered(eventId, winner.id, next);
    });
  }

  if (editing) {
    return (
      <tr className="border-b border-brand-50 last:border-0 bg-brand-50/40">
        <td colSpan={6} className="px-3 py-3">
          <form
            action={async (formData) => {
              await formAction(formData);
              setEditing(false);
            }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            <input
              name="channel_name"
              defaultValue={winner.channel_name}
              placeholder="채널명"
              required
              className={inputClass}
            />
            <input
              name="name"
              defaultValue={winner.name}
              placeholder="성함"
              required
              className={inputClass}
            />
            <input
              name="phone"
              defaultValue={winner.phone}
              placeholder="연락처"
              required
              className={inputClass}
            />
            <input
              name="email"
              defaultValue={winner.email ?? ""}
              placeholder="이메일"
              className={inputClass}
            />
            <input
              name="address"
              defaultValue={winner.address ?? ""}
              placeholder="배송지"
              className={inputClass}
            />
            <input
              name="postal_code"
              defaultValue={winner.postal_code ?? ""}
              placeholder="우편번호"
              className={inputClass}
            />
            {state?.error && (
              <p className="col-span-full text-sm text-red-600">{state.error}</p>
            )}
            <div className="col-span-full flex gap-2">
              <SubmitButton
                pendingText="저장 중..."
                className="rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                저장
              </SubmitButton>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-md border border-brand-200 px-3 py-1.5 text-sm text-gray-600"
              >
                취소
              </button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-brand-50 last:border-0">
      <td className="px-3 py-3 text-sm">{winner.channel_name}</td>
      <td className="px-3 py-3 text-sm">{winner.name}</td>
      <td className="px-3 py-3 text-sm">{winner.phone}</td>
      <td className="px-3 py-3 text-sm text-gray-600">
        {winner.email ?? (
          <>
            {winner.address}
            {winner.postal_code ? ` (${winner.postal_code})` : ""}
          </>
        )}
      </td>
      <td className="px-3 py-3 text-center">
        <input
          type="checkbox"
          checked={delivered}
          disabled={isPending}
          onChange={handleToggle}
          className="h-4 w-4 accent-brand-500"
        />
      </td>
      <td className="px-3 py-3 text-center">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-sm text-brand-500 hover:underline"
        >
          수정
        </button>
      </td>
    </tr>
  );
}
