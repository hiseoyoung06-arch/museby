import { createServiceClient } from "@/lib/supabase/service";
import { CreateBrandForm } from "@/components/admin/CreateBrandForm";
import { DeleteBrandButton } from "@/components/admin/DeleteBrandButton";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const supabase = createServiceClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-6 text-lg font-bold text-brand-900">
          브랜드 코드 관리
        </h1>
        <div className="rounded-xl border border-brand-100 bg-white p-6">
          <CreateBrandForm />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          여기서 등록한 코드로만 브랜드가 로그인할 수 있어요.
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-brand-900">
          등록된 브랜드
        </h2>
        {!brands || brands.length === 0 ? (
          <p className="rounded-xl border border-dashed border-brand-200 bg-white p-8 text-center text-sm text-gray-400">
            등록된 브랜드가 없어요.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-brand-100 bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-100 text-xs text-gray-400">
                  <th className="px-3 py-2 font-medium">브랜드명</th>
                  <th className="px-3 py-2 font-medium">코드</th>
                  <th className="px-3 py-2 text-center font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id} className="border-b border-brand-50 last:border-0">
                    <td className="px-3 py-3 text-sm">{brand.name}</td>
                    <td className="px-3 py-3 text-sm text-gray-600">
                      {brand.code}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <DeleteBrandButton brandId={brand.id} brandName={brand.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
