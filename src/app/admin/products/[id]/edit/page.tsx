import { prisma } from "../../../../../lib/prisma";
import EditProductForm from "../../../../../components/admin/edit-product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) {
    return <main className="p-10">Product Not Found</main>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-green-600">
            Admin Dashboard / Products / Edit
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Edit Product
          </h1>
          <p className="mt-2 text-slate-600">
            Update product details, pricing, stock, visibility, and images.
          </p>
        </div>

        <EditProductForm product={product} />
      </div>
    </main>
  );
}