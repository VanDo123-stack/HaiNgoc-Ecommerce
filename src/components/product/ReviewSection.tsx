import { Star } from "lucide-react";

import { type Review } from "~/types/review";

// 1. Internal star rating helper
function StarRating({ rating }: { rating: number }) {
  return (
    <span aria-label={`Đánh giá ${rating} trên 5 sao`} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      ))}
    </span>
  );
}

// 2. ReviewSection — hidden when 0 reviews (D-13)
export function ReviewSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const averageRounded = Math.round(average);

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-semibold">Đánh giá từ khách hàng</h2>

      {/* Summary row */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl font-bold">{average.toFixed(1)}</span>
        <StarRating rating={averageRounded} />
        <span className="text-muted-foreground text-sm">
          ({reviews.length} đánh giá)
        </span>
      </div>

      {/* Review card grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-card border-border space-y-2 rounded-lg border p-4"
          >
            {/* Author row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{review.authorName}</p>
                {review.company && (
                  <p className="text-muted-foreground text-sm">
                    {review.company}
                  </p>
                )}
              </div>
            </div>

            {/* Rating + date row */}
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="text-muted-foreground text-xs">{review.date}</span>
            </div>

            {/* Comment */}
            <p className="text-sm leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
