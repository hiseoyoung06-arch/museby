"use client";

import { useTransition } from "react";
import { deleteBrand } from "@/app/actions/admin";

export function DeleteBrandButton({
  brandId,
  brandName,
}: {
  brandId: string;
  brandName: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `"${brandName}" 브랜드를 삭제할까요? 이 브랜드의 모든 댓글이벤트와 제출된 정보도 함께 삭제돼요.`
    );
    if (!confirmed) return;

    startTransition(() => {
      deleteBrand(brandId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-500 hover:underline disabled:opacity-60"
    >
      삭제
    </button>
  );
}
