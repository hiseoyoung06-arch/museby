"use client";

import { useState, useTransition } from "react";
import { toggleWinnerDelivered } from "@/app/actions/brand";
import type { Winner } from "@/lib/types";

export function WinnerRow({
  eventId,
  winner,
}: {
  eventId: string;
  winner: Winner;
}) {
  const [delivered, setDelivered] = useState(winner.delivered);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !delivered;
    setDelivered(next);
    startTransition(() => {
      toggleWinnerDelivered(eventId, winner.id, next);
    });
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
      <td className="px-3 py-3 text-center text-sm">
        {winner.consent ? "동의" : "미동의"}
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
    </tr>
  );
}
