"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c.8-4 3.3-6 7.5-6s6.7 2 7.5 6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      {hidden && <path d="M4 4l16 16" />}
    </svg>
  );
}

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to create account");
        return;
      }

      setMessage(
        "Account created successfully! Redirecting to OTP verification..."
      );

      setTimeout(() => {
        router.push(
          `/verify-otp?email=${encodeURIComponent(email)}`
        );
      }, 1000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white/80 py-4 pl-14 pr-4 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#ff4f7b] focus:ring-2 focus:ring-pink-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Full Name
        </label>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff4f7b]">
            <UserIcon />
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Email Address
        </label>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff4f7b]">
            <MailIcon />
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Password
        </label>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff4f7b]">
            <LockIcon />
          </div>

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className={`${inputClass} pr-14`}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label="Toggle password visibility"
          >
            <EyeIcon hidden={!showPassword} />
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Confirm Password
        </label>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff4f7b]">
            <LockIcon />
          </div>

          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className={`${inputClass} pr-14`}
            required
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label="Toggle confirm password visibility"
          >
            <EyeIcon hidden={!showConfirmPassword} />
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {message && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#ff4f7b] px-6 py-4 text-base font-bold text-white shadow-lg shadow-pink-200/60 transition hover:bg-[#f43f6d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-sm text-slate-500">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <p className="text-center text-base text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#ff4f7b] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}