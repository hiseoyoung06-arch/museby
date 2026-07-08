import Link from "next/link";
import { CodeEntryForm } from "@/components/CodeEntryForm";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-brand-900">
          뮤즈바이 댓글이벤트
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          브랜드 코드를 입력하고 댓글 이벤트를 관리해 보세요.
        </p>
        <CodeEntryForm />
        <Link
          href="/admin/login"
          className="mt-6 block text-center text-xs text-gray-400 hover:text-brand-500"
        >
          뮤즈바이 관리자이신가요?
        </Link>
      </div>
    </main>
  );
}
