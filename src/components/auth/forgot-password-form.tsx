"use client";

export default function ForgotPasswordForm() {
  return (
    <form className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
      >
        Send Reset Link
      </button>
    </form>
  );
}