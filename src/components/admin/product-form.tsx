"use client";

import Link from "next/link";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { STORE_CATEGORIES } from "../../lib/store-categories";

type VariantForm = {
  id: string;
  size: string;
  color: string;
  stock: string;
  price: string;
  sku: string;
  imageUrl: string;
  isActive: boolean;
};

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];

function createVariant(size = ""): VariantForm {
  return {
    id: crypto.randomUUID(),
    size,
    color: "",
    stock: "",
    price: "",
    sku: "",
    imageUrl: "",
    isActive: true,
  };
}

function formatPrice(amount: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);
}

export default function ProductForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVariantId, setUploadingVariantId] = useState<string | null>(
    null
  );
  const [hasVariants, setHasVariants] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    brand: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    imageUrl: "",
    imageUrls: [] as string[],
    isActive: true,
  });

  const [variants, setVariants] = useState<VariantForm[]>(
    DEFAULT_SIZES.map((size) => createVariant(size))
  );

  function updateField(
    field: keyof typeof form,
    value: string | boolean | string[]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateVariant(
    variantId: string,
    field: keyof VariantForm,
    value: string | boolean
  ) {
    setVariants((previous) =>
      previous.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  }

  function addVariant() {
    setVariants((previous) => [...previous, createVariant()]);
  }

  function removeVariant(variantId: string) {
    setVariants((previous) =>
      previous.filter((variant) => variant.id !== variantId)
    );
  }

  const validVariants = useMemo(
    () =>
      variants.filter(
        (variant) =>
          variant.isActive &&
          (variant.size.trim() || variant.color.trim()) &&
          Number(variant.stock) >= 0
      ),
    [variants]
  );

  const variantStock = useMemo(
    () =>
      validVariants.reduce(
        (total, variant) => total + (Number(variant.stock) || 0),
        0
      ),
    [validVariants]
  );

  const displayedStock = hasVariants ? variantStock : Number(form.stock) || 0;

  const discount =
    Number(form.originalPrice) > Number(form.price) &&
    Number(form.price) > 0
      ? Math.round(
          ((Number(form.originalPrice) - Number(form.price)) /
            Number(form.originalPrice)) *
            100
        )
      : 0;

  async function uploadImages(files: File[]) {
    if (!files.length) return;

    try {
      setUploadingImages(true);

      const uploadData = new FormData();

      files.forEach((file) => {
        uploadData.append("files", file);
      });

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to upload product images.");
        return;
      }

      if (Array.isArray(data.urls) && data.urls.length > 0) {
        updateField("imageUrl", data.urls[0]);
        updateField("imageUrls", data.urls);
      }
    } catch (error) {
      console.error("PRODUCT_IMAGE_UPLOAD_ERROR", error);
      alert("Something went wrong while uploading product images.");
    } finally {
      setUploadingImages(false);
    }
  }

  async function uploadVariantImage(variantId: string, file: File) {
    try {
      setUploadingVariantId(variantId);

      const uploadData = new FormData();
      uploadData.append("files", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to upload the variant image.");
        return;
      }

      const uploadedUrl = Array.isArray(data.urls) ? data.urls[0] : null;

      if (!uploadedUrl) {
        alert("The upload finished, but no image URL was returned.");
        return;
      }

      updateVariant(variantId, "imageUrl", uploadedUrl);
    } catch (error) {
      console.error("VARIANT_IMAGE_UPLOAD_ERROR", error);
      alert("Something went wrong while uploading the variant image.");
    } finally {
      setUploadingVariantId(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hasVariants && validVariants.length === 0) {
      alert("Please configure at least one product variant.");
      return;
    }

    const duplicateSkus = validVariants
      .map((variant) => variant.sku.trim())
      .filter(Boolean);

    if (new Set(duplicateSkus).size !== duplicateSkus.length) {
      alert("Each variant SKU must be unique.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,

          stock: hasVariants
            ? variantStock
            : Number(form.stock || 0),

          variants: hasVariants
            ? validVariants.map((variant) => ({
                size: variant.size.trim() || null,
                color: variant.color.trim() || null,
                stock: Number(variant.stock || 0),
                price:
                  Number(variant.price) > 0
                    ? Number(variant.price)
                    : null,
                sku: variant.sku.trim() || null,
                imageUrl: variant.imageUrl.trim() || null,
                isActive: variant.isActive,
              }))
            : [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to save product.");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("CREATE_PRODUCT_ERROR", error);
      alert("Something went wrong while saving the product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-4 py-8 sm:px-6 lg:py-10">
      <div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-purple-300/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-blue-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 lg:mb-10">
          <p className="text-sm font-bold text-indigo-600">
            Admin / Products / Add New Product
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Add New Product
          </h1>

          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Create product listings, configure variants, manage inventory, and
            publish items to your store.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-2xl shadow-slate-200/70 backdrop-blur-xl sm:p-8"
          >
            <div className="mb-8 flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-2xl text-white shadow-lg">
                  📦
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Product Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the product information exactly as customers will see
                    it.
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${
                  form.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {form.isActive ? "✓ Publishing Enabled" : "Draft Mode"}
              </span>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Product Name
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  placeholder="Premium Cotton T-Shirt"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
              <div className="grid gap-5 md:grid-cols-3">
  <div>
    <label className="mb-2 block text-sm font-bold text-slate-800">
      Category
    </label>

    <select
      required
      value={form.category}
      onChange={(event) => {
        updateField("category", event.target.value);
        updateField("subCategory", "");
      }}
      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
    >
      <option value="">Select Category</option>

      {STORE_CATEGORIES.map((category) => (
        <option key={category.slug} value={category.slug}>
          {category.label}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="mb-2 block text-sm font-bold text-slate-800">
      Sub Category
    </label>

    <select
      required
      value={form.subCategory}
      disabled={!form.category}
      onChange={(event) =>
        updateField("subCategory", event.target.value)
      }
      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
    >
      <option value="">
        {form.category
          ? "Select Sub Category"
          : "Select Category First"}
      </option>

      {(
        STORE_CATEGORIES.find(
          (category) => category.slug === form.category
        )?.subCategories ?? []
      ).map((subCategory) => (
        <option key={subCategory} value={subCategory}>
          {subCategory}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="mb-2 block text-sm font-bold text-slate-800">
      Brand
    </label>

    <input
      value={form.brand}
      onChange={(event) =>
        updateField("brand", event.target.value)
      }
      placeholder="Nike"
      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
    />
  </div>
</div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Description
                </label>

                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Write clear product details for customers."
                  className="w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Selling Price
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      updateField("price", event.target.value)
                    }
                    placeholder="49.99"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Original Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(event) =>
                      updateField("originalPrice", event.target.value)
                    }
                    placeholder="79.99"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Base Stock.
                  </label>

                  <input
                    type="number"
                    min="0"
                    disabled={hasVariants}
                    value={hasVariants ? variantStock : form.stock}
                    onChange={(event) =>
                      updateField("stock", event.target.value)
                    }
                    placeholder="25"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  />

                  {hasVariants ? (
                    <p className="mt-2 text-xs text-slate-500">
                      Calculated automatically from variant inventory.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5">
                <label className="flex cursor-pointer items-start justify-between gap-5">
                  <div>
                    <p className="text-base font-bold text-slate-950">
                      Product has sizes or colors
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Enable this for clothing, shoes, wigs, or products with
                      different size and color options.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={hasVariants}
                    onChange={(event) =>
                      setHasVariants(event.target.checked)
                    }
                    className="mt-1 h-5 w-5 shrink-0 accent-indigo-600"
                  />
                </label>
              </div>

              {hasVariants ? (
                <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 sm:p-6">
                  <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">
                        Product Variants
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        Configure size, color, inventory, image, SKU, and
                        optional pricing.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addVariant}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <Plus className="h-4 w-4" />
                      Add Variant
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {variants.map((variant, index) => (
                      <div
                        key={variant.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                              {index + 1}
                            </span>

                            <div>
                              <p className="font-bold text-slate-900">
                                Variant
                              </p>

                              {variant.color || variant.size ? (
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {[variant.color, variant.size]
                                    .filter(Boolean)
                                    .join(" / ")}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeVariant(variant.id)}
                            disabled={variants.length === 1}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-300"
                            aria-label="Remove variant"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                          <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                              Size
                            </label>

                            <select
                              value={variant.size}
                              onChange={(event) =>
                                updateVariant(
                                  variant.id,
                                  "size",
                                  event.target.value
                                )
                              }
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-600"
                            >
                              <option value="">No Size</option>

                              {DEFAULT_SIZES.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}

                              <option value="One Size">One Size</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                              Color
                            </label>

                            <input
                              value={variant.color}
                              onChange={(event) =>
                                updateVariant(
                                  variant.id,
                                  "color",
                                  event.target.value
                                )
                              }
                              placeholder="Black"
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-600"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                              Stock
                            </label>

                            <input
                              required
                              type="number"
                              min="0"
                              value={variant.stock}
                              onChange={(event) =>
                                updateVariant(
                                  variant.id,
                                  "stock",
                                  event.target.value
                                )
                              }
                              placeholder="5"
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-600"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                              Price Override
                            </label>

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.price}
                              onChange={(event) =>
                                updateVariant(
                                  variant.id,
                                  "price",
                                  event.target.value
                                )
                              }
                              placeholder="Optional"
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-600"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                              SKU
                            </label>

                            <input
                              value={variant.sku}
                              onChange={(event) =>
                                updateVariant(
                                  variant.id,
                                  "sku",
                                  event.target.value
                                )
                              }
                              placeholder="TSH-BLK-M"
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-600"
                            />
                          </div>
                        </div>

                        <div className="mt-4 border-t border-slate-100 pt-4">
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            Variant Image
                          </label>

                          <div className="grid gap-4 sm:grid-cols-[1fr_110px] sm:items-center">
                            <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-center transition hover:border-indigo-500 hover:bg-indigo-50">
                              <ImagePlus className="h-5 w-5 text-slate-500" />

                              <span className="mt-2 text-sm font-semibold text-slate-700">
                                {uploadingVariantId === variant.id
                                  ? "Uploading..."
                                  : "Upload variant image"}
                              </span>

                              <span className="mt-1 text-xs text-slate-500">
                                Use the image matching this color.
                              </span>

                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingVariantId === variant.id}
                                className="hidden"
                                onChange={(event) => {
                                  const file = event.target.files?.[0];

                                  if (file) {
                                    uploadVariantImage(variant.id, file);
                                  }

                                  event.target.value = "";
                                }}
                              />
                            </label>

                            <div className="flex h-24 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                              {variant.imageUrl ? (
                                <img
                                  src={variant.imageUrl}
                                  alt={`${variant.color || "Variant"} ${
                                    variant.size || ""
                                  }`}
                                  className="h-full w-full object-contain p-2"
                                />
                              ) : (
                                <span className="px-2 text-center text-xs text-slate-400">
                                  No variant image
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm">
                    <span className="font-medium text-slate-600">
                      Active variants: {validVariants.length}
                    </span>

                    <span className="font-bold text-slate-950">
                      Total variant stock: {variantStock}
                    </span>
                  </div>
                </section>
              ) : null}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Main Product Images
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={uploadingImages}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                  onChange={(event) => {
                    const files = Array.from(event.target.files || []);
                    uploadImages(files);
                  }}
                />

                {uploadingImages ? (
                  <p className="mt-3 text-sm font-medium text-indigo-600">
                    Uploading product images...
                  </p>
                ) : null}

                {form.imageUrls.length > 0 ? (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                    {form.imageUrls.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white"
                      >
                        <img
                          src={image}
                          alt={`Product preview ${index + 1}`}
                          className="h-full w-full object-contain p-2"
                        />

                        {index === 0 ? (
                          <span className="absolute left-1 top-1 rounded bg-slate-950 px-2 py-1 text-[10px] font-bold text-white">
                            Main
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <label className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Publish Product
                  </p>

                  <p className="text-xs text-slate-500">
                    The product will be visible on the website after saving.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                  className="h-5 w-5 accent-indigo-600"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/admin/products"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </Link>

                <button
                  disabled={
                    loading ||
                    uploadingImages ||
                    Boolean(uploadingVariantId)
                  }
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 px-8 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Saving Product..." : "Save Product"}
                </button>
              </div>
            </div>
          </form>

          <aside className="h-fit rounded-[28px] border border-white/60 bg-white/90 p-6 shadow-2xl shadow-purple-200/50 backdrop-blur-xl lg:sticky lg:top-24">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Store Preview
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-950">
                  Product Card
                </h3>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                Live
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex h-72 items-center justify-center bg-slate-100">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt={form.name || "Product preview"}
                    className="h-full w-full object-contain p-4"
                  />
                ) : (
                  <span className="text-sm font-medium text-slate-400">
                    Product Image Preview
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="line-clamp-1 text-xs font-bold uppercase tracking-wide text-indigo-600">
                    {form.category || "Category"}
                  </p>

                  {discount > 0 ? (
                    <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      {discount}% OFF
                    </span>
                  ) : null}
                </div>

                <h3 className="line-clamp-2 text-lg font-bold text-slate-950">
                  {form.name || "Product Name"}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {form.description || "Product description preview"}
                </p>

                <div className="mt-4 flex flex-wrap items-end gap-2">
                  <span className="text-2xl font-bold text-slate-950">
                    {formatPrice(form.price || 0)}
                  </span>

                  {form.originalPrice ? (
                    <span className="pb-1 text-sm text-slate-400 line-through">
                      {formatPrice(form.originalPrice)}
                    </span>
                  ) : null}
                </div>

                {hasVariants ? (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Available Sizes
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {Array.from(
                        new Set(
                          validVariants
                            .map((variant) => variant.size)
                            .filter(Boolean)
                        )
                      ).map((size) => (
                        <span
                          key={size}
                          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p
                    className={`text-sm font-bold ${
                      displayedStock > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {displayedStock > 0
                      ? `${displayedStock} in stock`
                      : "Out of stock"}
                  </p>

                  <p className="text-xs font-semibold text-slate-400">
                    {form.brand || "Brand"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}