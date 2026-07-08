import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/server-auth";
import { adminLogout } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-brand-100 bg-white px-6 py-4">
        <span className="font-semibold text-brand-900">뮤즈바이 관리자</span>
        <form action={adminLogout}>
          <button
            type="submit"
            className="text-sm text-gray-400 hover:text-brand-500"
          >
            로그아웃
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
