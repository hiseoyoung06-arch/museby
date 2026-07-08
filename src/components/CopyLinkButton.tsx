"use client";

import { useEffect, useState } from "react";

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState(path);

  useEffect(() => {
    setLink(`${window.location.origin}${path}`);
  }, [path]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable; user can still select the text manually.
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2">
      <input
        readOnly
        value={link}
        onFocus={(e) => e.currentTarget.select()}
        className="flex-1 bg-transparent text-sm text-brand-900 outline-none"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
      >
        {copied ? "복사됨!" : "링크 복사"}
      </button>
    </div>
  );
}
