import type { ReactNode } from "react";
import AuthBanner from "./auth-banner";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <section className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl px-6 py-10 lg:grid-cols-2 lg:gap-10">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              NovaCart
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              {subtitle}
            </p>

            <div className="mt-8">{children}</div>
          </div>
        </div>

        <div className="hidden lg:block">
          <AuthBanner />
        </div>
      </div>
    </section>
  );
}