"use client";

import Link from "next/link";
import { MessageSquareText, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import ReviewForm from "./review-form";
import ReviewList from "./review-list";

type Props = {
  productId: string;
};

export default function ReviewSection({ productId }: Props) {
  const { data: session, status } = useSession();

  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const userId = (session?.user as { id?: string } | undefined)?.id;

  function handleReviewAdded() {
    setRefreshKey((previous) => previous + 1);
    setShowForm(false);
  }

  return (
    <section
      id="customer-reviews"
      className="mt-14 scroll-mt-24 border-t border-slate-300 pt-10"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">
            Customer Reviews
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Read customer feedback or share your experience with this product.
          </p>
        </div>

        {status !== "loading" && userId ? (
          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-900 px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white sm:w-auto"
          >
            {showForm ? (
              <>
                <X className="h-4 w-4" />
                Close Review Form
              </>
            ) : (
              <>
                <MessageSquareText className="h-4 w-4" />
                Write a Review
              </>
            )}
          </button>
        ) : null}
      </div>

      {/* SESSION LOADING */}
      {status === "loading" ? (
        <div className="mt-8 border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Checking your account...
          </p>
        </div>
      ) : null}

      {/* SIGN-IN MESSAGE */}
      {!userId && status !== "loading" ? (
        <div className="mt-8 flex flex-col gap-5 border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="text-base font-semibold text-slate-950">
              Sign in to write a review
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Share your product experience with other customers.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign In
          </Link>
        </div>
      ) : null}

      {/* REVIEW FORM */}
      {showForm && userId ? (
        <div className="mt-8 max-w-2xl">
          <ReviewForm
            userId={userId}
            productId={productId}
            onReviewAdded={handleReviewAdded}
          />
        </div>
      ) : null}

      {/* CUSTOMER REVIEWS */}
      <div className="mt-10">
        <ReviewList
          productId={productId}
          refreshKey={refreshKey}
        />
      </div>
    </section>
  );
}