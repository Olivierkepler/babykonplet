"use client";

import { Star, BadgeCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Review = {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user: {
    name?: string | null;
    image?: string | null;
  };
};

type Props = {
  productId: string;
  refreshKey?: number;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function ReviewList({
  productId,
  refreshKey = 0,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/reviews/${productId}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to load reviews.");
          return;
        }

        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD_REVIEWS_ERROR", error);
        setError("Something went wrong while loading reviews.");
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, [productId, refreshKey]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return total / reviews.length;
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter(
        (review) => review.rating === rating
      ).length;

      const percentage =
        reviews.length > 0
          ? Math.round((count / reviews.length) * 100)
          : 0;

      return {
        rating,
        count,
        percentage,
      };
    });
  }, [reviews]);

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm text-slate-500">
          Loading customer reviews...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm sm:p-8">
        {error}
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Customer feedback
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Ratings & Reviews
        </h2>
      </div>

      {reviews.length === 0 ? (
        <div className="py-12 text-center">
          <div className="flex justify-center gap-1 text-slate-300">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-7 w-7" />
            ))}
          </div>

          <h3 className="mt-5 text-xl font-bold text-slate-900">
            No reviews yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Be the first customer to share an honest experience with
            this product.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 border-b border-slate-200 py-8 md:grid-cols-[220px_1fr]">
            <div>
              <p className="text-5xl font-black text-slate-950">
                {averageRating.toFixed(1)}
              </p>

              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-3 text-sm text-slate-500">
                Based on {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>

            <div className="space-y-3">
              {ratingCounts.map((item) => (
                <div
                  key={item.rating}
                  className="grid grid-cols-[52px_1fr_42px] items-center gap-3"
                >
                  <span className="text-sm font-medium text-slate-600">
                    {item.rating} star
                  </span>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all"
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>

                  <span className="text-right text-sm text-slate-500">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {reviews.map((review) => {
              const reviewerName =
                review.user?.name?.trim() || "Customer";

              return (
                <article key={review.id} className="py-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {review.user?.image ? (
                        <img
                          src={review.user.image}
                          alt={reviewerName}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                          {reviewerName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <p className="font-bold text-slate-900">
                          {reviewerName}
                        </p>

                        {review.isVerifiedPurchase ? (
                          <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <BadgeCheck className="h-4 w-4" />
                            Verified purchase
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <time className="text-sm text-slate-500">
                      {formatDate(review.createdAt)}
                    </time>
                  </div>

                  <div className="mt-5 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>

                  {review.title ? (
                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {review.title}
                    </h3>
                  ) : null}

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {review.comment}
                  </p>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}