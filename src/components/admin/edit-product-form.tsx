"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type ProductImage = {
  id: string;
  url: string;
};

type EditableProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  brand: string | null;
  category: string | null;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
  images: ProductImage[];
};

export default function EditProductForm({
  product,
}: {
  product: EditableProduct;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageActionId, setImageActionId] = useState<string | null>(null);

  async function uploadSelectedImages(): Promise<string[]> {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) return [];

    const uploadData = new FormData();
    Array.from(files).forEach((file) => uploadData.append("files", file));

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: uploadData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to upload images.");
    }

    return Array.isArray(data.urls) ? data.urls : [];
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      setSubmitting(true);

      const newImageUrls = await uploadSelectedImages();

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          price: formData.get("price"),
          originalPrice: formData.get("originalPrice"),
          brand: formData.get("brand"),
          category: formData.get("category"),
          stock: formData.get("stock"),
          isActive: formData.get("isActive") === "on",
          currentImageUrl: product.imageUrl || "",
          newImageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save product.");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error("EDIT_PRODUCT_SUBMIT_ERROR", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the product."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSetMain(imageUrl: string) {
    try {
      setImageActionId(imageUrl);

      const response = await fetch(
        `/api/admin/products/${product.id}/main-image`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to set main image.");
        return;
      }

      router.refresh();
    } catch (err) {
      console.error("SET_MAIN_IMAGE_ERROR", err);
      setError("Something went wrong while setting the main image.");
    } finally {
      setImageActionId(null);
    }
  }

  async function handleDeleteImage(imageId: string) {
    try {
      setImageActionId(imageId);

      const response = await fetch(
        `/api/admin/products/${product.id}/images/${imageId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to delete image.");
        return;
      }

      router.refresh();
    } catch (err) {
      console.error("DELETE_PRODUCT_IMAGE_ERROR", err);
      setError("Something went wrong while deleting the image.");
    } finally {
      setImageActionId(null);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
    >
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <input
          name="name"
          defaultValue={product.name}
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        <div className="grid gap-5 md:grid-cols-2">
          <input
            name="category"
            defaultValue={product.category || ""}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          <input
            name="brand"
            defaultValue={product.brand || ""}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <textarea
          name="description"
          rows={5}
          defaultValue={product.description}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        <div className="grid gap-5 md:grid-cols-3">
          <input
            name="price"
            type="number"
            defaultValue={product.price}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          <input
            name="originalPrice"
            type="number"
            defaultValue={product.originalPrice || ""}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          <input
            name="stock"
            type="number"
            defaultValue={product.stock}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Add More Product Images
          </label>
          <input
            ref={fileInputRef}
            name="images"
            type="file"
            multiple
            accept="image/*"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          <p className="mt-2 text-xs text-slate-500">
            Uploaded and attached when you click Save Changes.
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
          <p className="mb-3 font-semibold text-slate-700">Current Images</p>

          <div className="grid grid-cols-5 gap-4">
            {product.images.length > 0 ? (
              product.images.map((image) => {
                const isMain = product.imageUrl === image.url;
                const isBusy =
                  imageActionId === image.url || imageActionId === image.id;

                return (
                  <div
                    key={image.id}
                    className={`rounded-xl border p-2 ${
                      isMain ? "border-green-500 ring-2 ring-green-200" : ""
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={product.name}
                      className="h-28 w-full object-contain"
                    />

                    {isMain && (
                      <p className="mt-2 text-center text-xs font-bold text-green-600">
                        MAIN IMAGE
                      </p>
                    )}

                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        disabled={isMain || isBusy}
                        onClick={() => handleSetMain(image.url)}
                        className="flex-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Set Main
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDeleteImage(image.id)}
                        className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
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
            disabled={submitting}
            className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}