"use client";

import Link from "next/link";

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

export default function ForgotPasswordForm() {
  return (
    <form className="space-y-6">
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
            placeholder="Enter your email"
            className="w-full rounded-xl border border-slate-200 bg-white/80 py-4 pl-14 pr-4 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#ff4f7b] focus:ring-2 focus:ring-pink-100"
            required
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-xl bg-[#ff4f7b] px-6 py-4 text-base font-bold text-white shadow-lg shadow-pink-200/60 transition hover:bg-[#f43f6d]"
      >
        Send Reset Link
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-sm text-slate-500">
          or
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Back to login */}
      <p className="text-center text-base text-slate-500">
        Remember your password?{" "}
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