import { redirect } from "next/navigation";
import { getBrandIdFromSession } from "@/lib/brand-session";
import { createServiceClient } from "@/lib/supabase/service";
import { brandLogout } from "@/app/actions/brand";

export const dynamic = "force-dynamic";

export default async function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brandId = getBrandIdFromSession();
  if (!brandId) redirect("/");

  const supabase = createServiceClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("name")
    .eq("id", brandId)
    .maybeSingle();

  if (!brand) redirect("/");

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-brand-100 bg-white px-6 py-4">
        <span className="font-semibold text-brand-900">{brand.name}</span>
        <form action={brandLogout}>
          <button
            type="submit"
            className="text-sm text-gray-400 hover:text-brand-500"
          >
            로그아웃
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
    </div>
  );
}
