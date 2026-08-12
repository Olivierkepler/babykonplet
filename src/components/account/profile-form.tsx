"use client";

import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";

type ProfileUser = {
  name: string;
  email: string;
  phone: string;
  image: string;
  language: string;
  currency: string;
  theme: string;
};

type Props = {
  user: ProfileUser;
};

type FormState = {
  name: string;
  phone: string;
  image: string;
  language: string;
  currency: string;
  theme: string;
};

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "U";
}

export default function ProfileForm({ user }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: user.name,
    phone: user.phone,
    image: user.image,
    language: user.language || "en",
    currency: user.currency || "USD",
    theme: user.theme || "system",
  });

  const [previewImage, setPreviewImage] = useState(user.image);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  }

  function handleImageSelection(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please choose a PNG, JPG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Profile image must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      setPreviewImage(reader.result);
      updateField("image", reader.result);
    };

    reader.onerror = () => {
      setErrorMessage("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  }

  function removeImage() {
    setPreviewImage("");
    updateField("image", "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (name.length < 2) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (phone && !/^[+()\-\s\d]{7,20}$/.test(phone)) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          image: form.image || null,
          language: form.language,
          currency: form.currency,
          theme: form.theme,
        }),
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to update your profile."
        );
      }

      setSuccessMessage(
        result.message || "Your profile was updated successfully."
      );

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update your profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      {/* PROFILE IMAGE */}
      <section className="border-b border-slate-200 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-slate-950">
          Profile picture
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Add a photo to personalize your customer account.
        </p>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative w-fit shrink-0">
            {previewImage ? (
              <img
                src={previewImage}
                alt={form.name || "Profile picture"}
                className="h-24 w-24 rounded-full border border-slate-200 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-950 text-2xl font-bold text-white shadow-sm">
                {getInitials(form.name)}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-slate-950 shadow-md transition hover:bg-amber-300"
              aria-label="Choose profile photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900">
              Upload a new profile photo
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              PNG, JPG, or WebP. Maximum file size is 2 MB.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
              >
                <Camera className="h-4 w-4" />
                Choose Photo
              </button>

              {previewImage ? (
                <button
                  type="button"
                  onClick={removeImage}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              ) : null}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelection}
              className="hidden"
            />
          </div>
        </div>
      </section>

      {/* PERSONAL INFORMATION */}
      <section className="border-b border-slate-200 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-slate-950">
          Personal information
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Update your name and contact details.
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="profile-name"
              className="text-sm font-semibold text-slate-800"
            >
              Full name
            </label>

            <div className="relative mt-2">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="profile-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                autoComplete="name"
                maxLength={80}
                required
                placeholder="Enter your full name"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="text-sm font-semibold text-slate-800"
            >
              Email address
            </label>

            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="profile-email"
                type="email"
                value={user.email}
                readOnly
                className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 pl-10 pr-3 text-sm text-slate-500 outline-none"
              />
            </div>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Email changes require additional verification.
            </p>
          </div>

          <div>
            <label
              htmlFor="profile-phone"
              className="text-sm font-semibold text-slate-800"
            >
              Phone number
            </label>

            <div className="relative mt-2">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="profile-phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value)
                }
                autoComplete="tel"
                maxLength={20}
                placeholder="+1 617 555 0123"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PREFERENCES */}
      <section className="p-5 sm:p-6">
        <h2 className="text-lg font-bold text-slate-950">
          Account preferences
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Customize your shopping and display experience.
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div>
            <label
              htmlFor="profile-language"
              className="text-sm font-semibold text-slate-800"
            >
              Language
            </label>

            <select
              id="profile-language"
              value={form.language}
              onChange={(event) =>
                updateField("language", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="profile-currency"
              className="text-sm font-semibold text-slate-800"
            >
              Currency
            </label>

            <select
              id="profile-currency"
              value={form.currency}
              onChange={(event) =>
                updateField("currency", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            >
              <option value="USD">USD — US Dollar</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="profile-theme"
              className="text-sm font-semibold text-slate-800"
            >
              Theme
            </label>

            <select
              id="profile-theme"
              value={form.theme}
              onChange={(event) =>
                updateField("theme", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            >
              <option value="system">System default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div
            role="status"
            className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMessage}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-11 min-w-40 items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 text-sm font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </section>
    </form>
  );
}