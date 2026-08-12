"use client";

import { Star } from "lucide-react";
import { useState } from "react";

type ReviewFormProps = {
  userId: string;
  productId: string;
  onReviewAdded?: () => void;
};

export default function ReviewForm({
  userId,
  productId,
  onReviewAdded,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitReview(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!comment.trim()) {
      alert("Please write your review.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          rating,
          title: title.trim(),
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to submit review.");
        return;
      }

      setRating(5);
      setTitle("");
      setComment("");

      alert("Thank you for your review.");

      onReviewAdded?.();
    } catch (error) {
      console.error("REVIEW_SUBMIT_ERROR", error);
      alert("Something went wrong while submitting your review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border border-slate-200 bg-white p-5 sm:p-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-950">
          Write a Review
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Tell other customers about your experience with this product.
        </p>
      </div>

      <form onSubmit={submitReview} className="mt-7 space-y-6">
        {/* RATING */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-900">
            Rating
          </label>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`Select ${star} star rating`}
                className="rounded p-1 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <Star
                  className={`h-7 w-7 transition ${
                    rating >= star
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {rating} out of 5 stars selected
          </p>
        </div>

        {/* TITLE */}
        <div>
          <label
            htmlFor="review-title"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Review title
          </label>

          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Summarize your experience"
            maxLength={100}
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        {/* COMMENT */}
        <div>
          <label
            htmlFor="review-comment"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Review
          </label>

          <textarea
            id="review-comment"
            rows={6}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What did you like or dislike about this product?"
            maxLength={1000}
            required
            className="w-full resize-y rounded-md border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />

          <div className="mt-2 flex items-center justify-between gap-4 text-xs text-slate-500">
            <span>
              Please share your genuine product experience.
            </span>

            <span className="shrink-0">
              {comment.length}/1000
            </span>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </section>
  );
}