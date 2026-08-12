import { redirect } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { auth } from "../../../auth";
import ProfileForm from "../../../components/account/profile-form";
import { prisma } from "../../../lib/prisma";

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id?: string }).id;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      phone: true,
      image: true,
      emailVerified: true,
      language: true,
      currency: true,
      theme: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-4">
      {/* PAGE HEADER */}
      <header className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
          Account settings
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-[-0.025em] text-slate-950 sm:text-[30px]">
          My Profile
        </h1>

        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-600">
          Manage your personal information, contact details, profile picture,
          and shopping preferences.
        </p>
      </header>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
        <ProfileForm
          user={{
            name: user.name ?? "",
            email: user.email,
            phone: user.phone ?? "",
            image: user.image ?? "",
            language: user.language || "en",
            currency: user.currency || "USD",
            theme: user.theme || "system",
          }}
        />

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-4 xl:sticky xl:top-24">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">
              Account details
            </h2>

            <dl className="mt-5 space-y-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <UserRound className="h-4 w-4" />
                </span>

                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Member since
                  </dt>

                  <dd className="mt-1 text-sm font-semibold text-slate-900">
                    {formatMonthYear(user.createdAt)}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <CalendarDays className="h-4 w-4" />
                </span>

                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Last updated
                  </dt>

                  <dd className="mt-1 text-sm font-semibold text-slate-900">
                    {formatFullDate(user.updatedAt)}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Mail className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Email
                  </dt>

                  <dd className="mt-1 break-all text-sm font-semibold text-slate-900">
                    {user.email}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Phone className="h-4 w-4" />
                </span>

                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Phone
                  </dt>

                  <dd className="mt-1 text-sm font-semibold text-slate-900">
                    {user.phone || "Not added"}
                  </dd>
                </div>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  user.emailVerified
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              />

              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Email status
                </h2>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    user.emailVerified
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}
                >
                  {user.emailVerified ? "Verified" : "Verification required"}
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {user.emailVerified
                    ? "Your email address has been verified."
                    : "Verify your email to secure your account."}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />

              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Security tip
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Protect your account with a strong password and never share
                  your login credentials.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />

              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Profile updates
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Changes to your profile appear across your account after
                  saving.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}