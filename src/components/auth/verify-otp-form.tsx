"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function getErrorMessage(error: unknown): string {
  if (!error) return "Invalid OTP";

  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const err = error as {
      message?: string;
      formErrors?: string[];
      fieldErrors?: Record<string, string[]>;
    };

    if (err.message) return err.message;

    if (err.formErrors?.length) return err.formErrors.join(", ");

    if (err.fieldErrors) {
      const values = Object.values(err.fieldErrors).flat();
      if (values.length) return values.join(", ");
    }
  }

  return "Invalid OTP";
}

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: otp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(getErrorMessage(data.error || data.message));
        return;
      }

      setMessage("Email verified successfully. Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          OTP Code
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          required
        />
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Back to{" "}
        <Link href="/login" className="font-semibold text-slate-900 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}