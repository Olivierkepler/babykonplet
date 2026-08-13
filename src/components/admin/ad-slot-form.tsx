"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CUSTOM_LINK_VALUE,
  linkOptions,
  allKnownLinkValues,
} from "../../lib/site-links";

type AdSlotFormProps = {
  adId?: string;
  initial?: {
    imageUrl: string;
    href: string;
    alt: string;
    label: string;
    isActive: boolean;
  };
};

const emptyForm = {
  imageUrl: "",
  href: "",
  alt: "",
  label: "",
  isActive: true,
};

export default function AdSlotForm({ adId, initial }: AdSlotFormProps) {
  const router = useRouter();
  const isEditing = Boolean(adId);

  const [form, setForm] = useState(initial ?? emptyForm);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [linkMode, setLinkMode] = useState<"preset" | "custom">(
    initial?.href && !allKnownLinkValues.has(initial.href)
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
      console.error("AD_IMAGE_UPLOAD_ERROR", err);
      setError("Something went wrong while uploading the image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.imageUrl) {
      setError("Please upload an image.");
      return;
    }

    if (!form.href.trim()) {
      setError("Please choose or enter a link.");
      return;
    }

    if (!form.alt.trim()) {
      setError("Please enter alt text for accessibility.");
      return;
    }

    try {
      setSubmitting(true);

      const endpoint = isEditing
        ? `/api/admin/ad-slots/${adId}`
        : "/api/admin/ad-slots";

      const response = await fetch(endpoint, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save ad.");
        return;
      }

      router.push("/admin/content/ads");
      router.refresh();
    } catch (err) {
      console.error("AD_SUBMIT_ERROR", err);
      setError("Something went wrong while saving the ad.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold text-green-600">
          Admin Dashboard / Homepage Content / Ads
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          {isEditing ? "Edit Ad" : "Add Ad"}
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
              Image (portrait, ~3:4 ratio works best)
            </label>

            <div className="mt-2 flex items-center gap-4">
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt=""
                  className="h-28 w-20 rounded-xl border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-28 w-20 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-400">
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
              Link (where the ad sends shoppers)
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
                placeholder="/products?category=beauty"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600"
              />
            )}
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900">
              Alt text (for accessibility — describe the image)
            </label>
            <input
              value={form.alt}
              onChange={(e) => updateField("alt", e.target.value)}
              placeholder="Beauty sale banner"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900">
              Caption (optional, shown under the image)
            </label>
            <input
              value={form.label}
              onChange={(e) => updateField("label", e.target.value)}
              placeholder="Up to 40% off Beauty"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600"
            />
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
                : "Add ad"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/content/ads")}
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