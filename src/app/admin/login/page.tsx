import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-brand-900">
          뮤즈바이 관리자
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          모든 브랜드의 댓글 이벤트를 관리해요.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
