import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";
import ProductSearchFilter from "../../../components/admin/product-search-filter";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

async function deactivateProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

async function activateProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));

  await prisma.product.update({
    where: { id },
    data: { isActive: true },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

async function deleteProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const { search = "", status = "all" } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
                { brand: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        status === "active"
          ? { isActive: true }
          : status === "inactive"
          ? { isActive: false }
          : status === "out-of-stock"
          ? { stock: 0 }
          : {},
      ],
    },
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const inactiveProducts = products.filter((p) => !p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-600">
              Admin Dashboard / Products
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              Product Management
            </h1>
            <p className="mt-2 text-slate-600">
              Manage inventory, pricing, visibility, and product lifecycle from one place.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-green-700"
          >
            + Add Product
          </Link>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Total Products</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{totalProducts}</h2>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-green-700">Active Products</p>
            <h2 className="mt-2 text-3xl font-bold text-green-700">{activeProducts}</h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Inactive Products</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{inactiveProducts}</h2>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">Inventory Units</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-700">{totalStock}</h2>
          </div>
        </div>

        <ProductSearchFilter />

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-950">All Products</h2>
              <p className="mt-1 text-sm text-slate-500">
                Track inventory, pricing, and product visibility across your storefront.
              </p>
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-5">
                    {product.imageUrl ? (
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-400">
                        N/A
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div>
                      <p className="font-bold text-slate-950">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{product.slug}</p>
                      <p className="mt-1 text-xs font-medium text-blue-600">
                        {product.images.length} Images
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    {product.category || "-"}
                  </td>

                  <td className="px-6 py-5 font-bold text-slate-950">
  {formatMoney(product.price)}
</td>

                  <td className="px-6 py-5">
                    <span
                      className={`font-semibold ${
                        product.stock > 0 ? "text-slate-800" : "text-red-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    {product.isActive ? (
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
                        href={`/products/${product.slug}`}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </Link>

                      {product.isActive ? (
                        <form action={deactivateProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <button className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                            Deactivate
                          </button>
                        </form>
                      ) : (
                        <form action={activateProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <button className="rounded-lg border border-green-200 px-3 py-2 text-xs font-bold text-green-600 hover:bg-green-50">
                            Activate
                          </button>
                        </form>
                      )}

                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button className="rounded-lg border border-red-300 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      No products found
                    </p>
                    <p className="mt-2 text-slate-500">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}