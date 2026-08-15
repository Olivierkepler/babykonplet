"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Mail,
  MessageCircle,
  Package,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCategory = {
  title: string;
  icon: typeof Package;
  items: FaqItem[];
};

const faqCategories: FaqCategory[] = [
  {
    title: "Orders & Shipping",
    icon: Truck,
    items: [
      {
        question: "How long does delivery take?",
        answer:
          "Standard delivery arrives in 4–7 business days. Express delivery is available at checkout for eligible orders and typically arrives in 1–3 business days.",
      },
      {
        question: "Where do you currently deliver?",
        answer:
          "We currently deliver only within Massachusetts. Enter your ZIP code at checkout or from the delivery menu to confirm availability in your area.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes. Once your order ships, you'll receive a confirmation with tracking details. You can also check order status anytime from My Orders in your account.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    icon: RotateCcw,
    items: [
      {
        question: "What is your return policy?",
        answer:
          "Most items are eligible for return within 30 days of delivery. Return eligibility for a specific item is shown on the product page and at checkout.",
      },
      {
        question: "How do I start a return?",
        answer:
          "Go to My Orders, select the order you'd like to return, and follow the prompts. We'll email you a confirmation once your return is received and processed.",
      },
      {
        question: "When will I get my refund?",
        answer:
          "Refunds are issued to your original payment method within 5–7 business days of us receiving your returned item.",
      },
    ],
  },
  {
    title: "Account & Orders",
    icon: ShieldCheck,
    items: [
      {
        question: "Do I need an account to order?",
        answer:
          "You'll need to sign in to view your cart, place an order, and track past purchases. Creating an account only takes a minute.",
      },
      {
        question: "How do I update my saved addresses?",
        answer:
          "Go to your account menu and select Saved addresses to add, edit, or remove a delivery address.",
      },
      {
        question: "I forgot my password. What do I do?",
        answer:
          'Select "Forgot password" on the sign-in page and we\'ll send you a reset link by email.',
      },
    ],
  },
];

function FaqAccordionItem({ item }: { item: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#E7EEF3] last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
      >
        <span className="text-sm font-semibold text-slate-900">
          {item.question}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#63A0C7] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <p className="pb-4 pr-8 text-sm leading-6 text-slate-600">
          {item.answer}
        </p>
      ) : null}
    </div>
  );
}

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2  border border-[#E7EEF3] bg-white px-5 py-3.5 text-sm text-slate-500 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.15)]"
        >
          <Link
            href="/"
            className="font-medium transition-colors hover:text-[#63A0C7]"
          >
            Home
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden="true" />

          <span aria-current="page" className="font-semibold text-slate-950">
            Help Center
          </span>
        </nav>

        {/* HERO */}
        <section className=" border border-[#E7EEF3] bg-white px-6 py-10 text-center shadow-[0_18px_50px_-30px_rgba(15,23,42,0.18)] sm:px-9">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF4F8] text-[#63A0C7]">
            <CircleHelp className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            How can we help?
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            Find answers to common questions below, or reach out to our team
            directly.
          </p>
        </section>

        {/* QUICK CONTACT OPTIONS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <a
            href="mailto:support@babykonplet.com"
            className="group flex flex-col items-start gap-3  border border-[#E7EEF3] bg-white p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.15)] transition hover:-translate-y-0.5 hover:border-[#D9EDF5] hover:shadow-[0_16px_36px_-20px_rgba(15,23,42,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4F8] text-[#63A0C7]">
              <Mail className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-950">Email us</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                support@babykonplet.com — we typically reply within one
                business day.
              </p>
            </div>
          </a>

          <Link
            href="/orders"
            className="group flex flex-col items-start gap-3  border border-[#E7EEF3] bg-white p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.15)] transition hover:-translate-y-0.5 hover:border-[#D9EDF5] hover:shadow-[0_16px_36px_-20px_rgba(15,23,42,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4F8] text-[#63A0C7]">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-950">
                Track an order
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Check the status of a recent order from your account.
              </p>
            </div>
          </Link>

          <Link
            href="/returns"
            className="group flex flex-col items-start gap-3  border border-[#E7EEF3] bg-white p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.15)] transition hover:-translate-y-0.5 hover:border-[#D9EDF5] hover:shadow-[0_16px_36px_-20px_rgba(15,23,42,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4F8] text-[#63A0C7]">
              <RotateCcw className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-950">
                Start a return
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Return eligibility and steps for a recent purchase.
              </p>
            </div>
          </Link>
        </section>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight text-slate-950">
            Frequently asked questions
          </h2>

          <div className="mt-5 space-y-5">
            {faqCategories.map((category) => {
              const CategoryIcon = category.icon;

              return (
                <div
                  key={category.title}
                  className=" border border-[#E7EEF3] bg-white p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.15)] sm:p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF4F8] text-[#63A0C7]">
                      <CategoryIcon className="h-4 w-4" />
                    </div>

                    <h3 className="text-base font-bold text-slate-950">
                      {category.title}
                    </h3>
                  </div>

                  <div className="mt-2">
                    {category.items.map((item) => (
                      <FaqAccordionItem key={item.question} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STILL NEED HELP */}
        <section className="mt-10  border border-[#E7EEF3] bg-white px-6 py-10 text-center shadow-[0_18px_50px_-30px_rgba(15,23,42,0.18)] sm:px-9">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4F8] text-[#63A0C7]">
            <MessageCircle className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-950">
            Still need help?
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
            Our team is happy to help with anything not covered above.
          </p>

          <a
            href="mailto:support@babykonplet.com"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#63A0C7] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4F8CB5]"
          >
            Contact Support
          </a>
        </section>
      </div>
    </main>
  );
}