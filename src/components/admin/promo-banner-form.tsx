"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PromoBannerFormProps = {
  bannerId?: string;
  initial?: {
    title: string;
    subtitle: string;
    imageUrl: string;
    href: string;
    isActive: boolean;
  };
};

const emptyForm = {
  title: "",
  subtitle: "",
  imageUrl: "",
  href: "",
  isActive: true,
};

const CUSTOM_LINK_VALUE = "__custom__";

// Mirrors the real destinations used across the storefront
// (category pages, section anchors, and top-level routes) so
// admins pick a link that's guaranteed to exist rather than
// hand-typing a path that might not match a real route.
const linkOptions = [
  {
    group: "Category pages",
    options: [
      { value: "/products?category=women", label: "Women" },
      { value: "/products?category=men", label: "Men" },
      { value: "/products?category=beauty", label: "Beauty" },
      { value: "/products?category=hair-care", label: "Hair Care" },
      { value: "/products?category=shoes", label: "Shoes" },
      { value: "/products?category=bags", label: "Bags" },
      { value: "/products?category=food-grocery", label: "Food & Grocery" },
      { value: "/products?category=home-essentials", label: "Home Essentials" },
      { value: "/products?category=kitchen", label: "Kitchen" },
      { value: "/products?category=cleaning", label: "Cleaning" },
      { value: "/products?category=wigs", label: "Wigs" },
      { value: "/products?category=personal-care", label: "Personal Care" },
    ],
  },
  {
    group: "Section pages",
    options: [
      { value: "/beauty-and-hair-care", label: "Beauty & Hair Care" },
      { value: "/fashion-finds", label: "Fashion Finds" },
      { value: "/food-and-grocery", label: "Food & Grocery (section)" },
      { value: "/home-essentials", label: "Home Essentials (section)" },
    ],
  },
  {
    group: "Storefront",
    options: [
      { value: "/products", label: "All products" },
      { value: "/products?section=discover", label: "Discover DJADOR" },
    ],
  },
];

const allKnownValues = new Set(
  linkOptions.flatMap((group) => group.options.map((o) => o.value))
);

export default function PromoBannerForm({
  bannerId,
  initial,
}: PromoBannerFormProps) {
  const router = useRouter();
  const isEditing = Boolean(bannerId);

  const [form, setForm] = useState(initial ?? emptyForm);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // If we're editing a banner whose saved href isn't one of the
  // known options (or the form is new), default the select to
  // "Custom link" so the existing/typed value isn't silently lost.
  const [linkMode, setLinkMode] = useState<"preset" | "custom">(
    initial?.href && !allKnownValues.has(initial.href)
      ? "custom"
      : "preset"
  );

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleLinkSelectChange(value: string) {
    if (value === CUSTOM_LINK_VALUE) {
      setLinkMode("custom");
      updateField("href", "");
      return;
    }

    setLinkMode("preset");
    updateField("href", value);
  }

  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const uploadData = new FormData();
      uploadData.append("files", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to upload image.");
        return;
      }

      if (Array.isArray(data.urls) && data.urls[0]) {
        updateField("imageUrl", data.urls[0]);
      }
    } catch (err) {
      console.error("BANNER_IMAGE_UPLOAD_ERROR", err);
      setError("Something went wrong while uploading the image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.subtitle.trim()) {
      setError("Title and subtitle are required.");
      return;
    }

    if (!form.imageUrl) {
      setError("Please upload a banner image.");
      return;
    }

    if (!form.href.trim()) {
      setError("Please choose or enter a link.");
      return;
    }

    try {
      setSubmitting(true);

      const endpoint = isEditing
        ? `/api/admin/promo-banners/${bannerId}`
        : "/api/admin/promo-banners";

      const response = await fetch(endpoint, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save banner.");
        return;
      }

      router.push("/admin/content/banners");
      router.refresh();
    } catch (err) {
      console.error("BANNER_SUBMIT_ERROR", err);
      setError("Something went wrong while saving the banner.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold text-green-600">
          Admin Dashboard / Homepage Content / Banners
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          {isEditing ? "Edit Banner" : "Add Banner"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-slate-900">
              Image
            </label>

            <div className="mt-2 flex items-center gap-4">
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt=""
                  className="h-24 w-40 rounded-xl border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-24 w-40 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-400">
                  No image
                </div>
              )}

              <label className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                {uploading ? "Uploading..." : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Beauty & Hair Care"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900">
              Subtitle
            </label>
            <input
              value={form.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              placeholder="Shop oils, shampoo, conditioner and hair essentials"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900">
              Link (where the banner sends shoppers)
            </label>

            <select
              value={linkMode === "custom" ? CUSTOM_LINK_VALUE : form.href}
              onChange={(e) => handleLinkSelectChange(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-600"
            >
              <option value="" disabled>
                Choose a destination
              </option>

              {linkOptions.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}

              <option value={CUSTOM_LINK_VALUE}>
                Custom link…
              </option>
            </select>

            {linkMode === "custom" && (
              <input
                value={form.href}
                onChange={(e) => updateField("href", e.target.value)}
                placeholder="/beauty-and-hair-care"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600"
              />
            )}
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                updateField("isActive", e.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm font-semibold text-slate-700">
              Show on homepage
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : isEditing
                ? "Save changes"
                : "Add banner"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/content/banners")}
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}