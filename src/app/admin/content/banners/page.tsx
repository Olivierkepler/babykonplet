import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";
import AdminLayout from "../../../../components/admin/AdminLayout";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }
}

async function deleteBanner(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id"));

  await prisma.promoBanner.delete({ where: { id } });

  revalidatePath("/admin/content/banners");
  revalidatePath("/");
}

async function toggleBannerActive(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id"));
  const nextActive = formData.get("nextActive") === "true";

  await prisma.promoBanner.update({
    where: { id },
    data: { isActive: nextActive },
  });

  revalidatePath("/admin/content/banners");
  revalidatePath("/");
}

async function moveBanner(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id"));
  const direction = String(formData.get("direction"));

  const banners = await prisma.promoBanner.findMany({
    orderBy: { order: "asc" },
  });

  const index = banners.findIndex((b) => b.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= banners.length) return;

  const current = banners[index];
  const swapWith = banners[swapIndex];

  await prisma.$transaction([
    prisma.promoBanner.update({
      where: { id: current.id },
      data: { order: swapWith.order },
    }),
    prisma.promoBanner.update({
      where: { id: swapWith.id },
      data: { order: current.order },
    }),
  ]);

  revalidatePath("/admin/content/banners");
  revalidatePath("/");
}

export default async function AdminPromoBannersPage() {
  await requireAdmin();

  const banners = await prisma.promoBanner.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <AdminLayout>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-green-600">
                Admin Dashboard / Homepage Content
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                Promo Carousel Banners
              </h1>
              <p className="mt-2 text-slate-600">
                Controls the homepage carousel. Order here matches
                display order left to right.
              </p>
            </div>

            <Link
              href="/admin/content/banners/new"
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-green-700"
            >
              + Add Banner
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Link</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {banners.map((banner, index) => (
                  <tr key={banner.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <form action={moveBanner}>
                          <input type="hidden" name="id" value={banner.id} />
                          <input type="hidden" name="direction" value="up" />
                          <button
                            type="submit"
                            disabled={index === 0}
                            className="rounded border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-600 disabled:opacity-30"
                          >
                            ↑
                          </button>
                        </form>

                        <form action={moveBanner}>
                          <input type="hidden" name="id" value={banner.id} />
                          <input type="hidden" name="direction" value="down" />
                          <button
                            type="submit"
                            disabled={index === banners.length - 1}
                            className="rounded border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-600 disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </form>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <Image
                          src={banner.imageUrl}
                          alt={banner.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-950">
                        {banner.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {banner.subtitle}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {banner.href}
                    </td>

                    <td className="px-6 py-5">
                      {banner.isActive ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 [&_a]:w-[90px] [&_button]:w-[90px] [&_a]:text-center">
                        <Link
                          href={`/admin/content/banners/${banner.id}/edit`}
                          className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </Link>

                        <form action={toggleBannerActive}>
                          <input type="hidden" name="id" value={banner.id} />
                          <input
                            type="hidden"
                            name="nextActive"
                            value={(!banner.isActive).toString()}
                          />
                          <button
                            className={`w-full rounded-lg border px-3 py-2 text-xs font-bold ${
                              banner.isActive
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {banner.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </form>

                        <form action={deleteBanner}>
                          <input type="hidden" name="id" value={banner.id} />
                          <button className="rounded-lg border border-red-300 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}

                {banners.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <p className="text-lg font-bold text-slate-900">
                        No banners yet
                      </p>
                      <p className="mt-2 text-slate-500">
                        Add your first carousel banner to get started.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}