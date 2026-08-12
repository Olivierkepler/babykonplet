import Link from "next/link";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { prisma } from "../../../../../lib/prisma";

async function saveUploadedImages(files: File[]) {
  const urls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    // Same Blob upload path as POST /api/admin/upload (used by ProductForm).
    const safeName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");

    const blob = await put(
      `products/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-${safeName}`,
      file,
      {
        access: "public",
      }
    );

    urls.push(blob.url);
  }

  return urls;
}

async function setMainImage(productId: string, imageUrl: string) {
  "use server";

  await prisma.product.update({
    where: { id: productId },
    data: { imageUrl },
  });

  redirect(`/admin/products/${productId}/edit`);
}

async function deleteProductImage(productId: string, imageId: string) {
  "use server";

  await prisma.productImage.delete({
    where: { id: imageId },
  });

  const remainingImages = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { createdAt: "asc" },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      imageUrl: remainingImages[0]?.url || null,
    },
  });

  redirect(`/admin/products/${productId}/edit`);
}

async function updateProduct(id: string, formData: FormData) {
  "use server";

  const files = formData.getAll("images") as File[];
  const uploadedUrls = await saveUploadedImages(files);

  const currentImageUrl = String(formData.get("currentImageUrl") || "").trim();

  const mainImageUrl =
    uploadedUrls.length > 0 ? uploadedUrls[0] : currentImageUrl || null;

  await prisma.product.update({
    where: { id },
    data: {
      name: String(formData.get("name") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      price: Number(formData.get("price") || 0),
      originalPrice: Number(formData.get("originalPrice") || 0) || null,
      brand: String(formData.get("brand") || "").trim() || null,
      category: String(formData.get("category") || "").trim() || null,
      imageUrl: mainImageUrl,
      stock: Number(formData.get("stock") || 0),
      isActive: formData.get("isActive") === "on",
    },
  });

  if (uploadedUrls.length > 0) {
    await prisma.productImage.createMany({
      data: uploadedUrls.map((url) => ({
        productId: id,
        url,
      })),
    });
  }

  redirect("/admin/products");
}

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

        <form
          action={updateProduct.bind(null, product.id)}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
        >
          <div className="grid gap-6">
            <input name="name" defaultValue={product.name} required className="w-full rounded-xl border border-slate-300 px-4 py-3" />

            <div className="grid gap-5 md:grid-cols-2">
              <input name="category" defaultValue={product.category || ""} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
              <input name="brand" defaultValue={product.brand || ""} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
            </div>

            <textarea name="description" rows={5} defaultValue={product.description} className="w-full rounded-xl border border-slate-300 px-4 py-3" />

            <div className="grid gap-5 md:grid-cols-3">
              <input name="price" type="number" defaultValue={product.price} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
              <input name="originalPrice" type="number" defaultValue={product.originalPrice || ""} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
              <input name="stock" type="number" defaultValue={product.stock} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
            </div>

            <input type="hidden" name="currentImageUrl" value={product.imageUrl || ""} />

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Add More Product Images
              </label>
              <input
                name="images"
                type="file"
                multiple
                accept="image/*"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
              <p className="mt-2 text-xs text-slate-500">
                Upload more images without removing existing product images.
              </p>
            </div>

            <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={product.isActive}
              />
              <span className="font-medium">Product Active</span>
            </label>

            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="mb-3 font-semibold text-slate-700">
                Current Images
              </p>

              <div className="grid grid-cols-5 gap-4">
                {product.images.length > 0 ? (
                  product.images.map((image) => (
                    <div
                      key={image.id}
                      className={`rounded-xl border p-2 ${
                        product.imageUrl === image.url
                          ? "border-green-500 ring-2 ring-green-200"
                          : ""
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={product.name}
                        className="h-28 w-full object-contain"
                      />

                      {product.imageUrl === image.url && (
                        <p className="mt-2 text-center text-xs font-bold text-green-600">
                          MAIN IMAGE
                        </p>
                      )}

                      <div className="mt-2 flex gap-2">
                        <button
                          formAction={setMainImage.bind(
                            null,
                            product.id,
                            image.url
                          )}
                          className="flex-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                        >
                          Set Main
                        </button>

                        <button
                          formAction={deleteProductImage.bind(
                            null,
                            product.id,
                            image.id
                          )}
                          className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No images uploaded</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
              <Link
                href="/admin/products"
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}