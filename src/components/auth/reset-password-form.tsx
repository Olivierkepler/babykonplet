"use client";

export default function ResetPasswordForm() {
  return (
    <form className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          New Password
        </label>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
      >
        Reset Password
      </button>
    </form>
  );
}