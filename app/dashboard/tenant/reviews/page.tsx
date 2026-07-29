"use client";

import { useMyRentals } from "@/hooks/useRentals";
import { useCreateReview } from "@/hooks/useReviews";
import { RentalRequest } from "@/lib/types";
import { Skeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function normalize(data: unknown): RentalRequest[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const d = data as Record<string, unknown>;
  if (d.rentalRequests) return d.rentalRequests as RentalRequest[];
  if (d.requests) return d.requests as RentalRequest[];
  return [];
}

function ReviewForm({ rental }: { rental: RentalRequest }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const { mutate: submit, isPending } = useCreateReview();

  const handleSubmit = () => {
    if (rating === 0) { toast.error("Please select a rating"); return; }
    submit({ rentalRequestId: rental.id, rating, comment: comment || undefined });
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-5">
      <h3 className="font-semibold mb-1">{rental.property?.title || "Property"}</h3>
      <p className="text-sm text-[var(--muted)] mb-4">Share your experience</p>
      
      {/* Star picker */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(i + 1)}
          >
            <Star
              size={24}
              fill={(hover || rating) > i ? "currentColor" : "none"}
              className={(hover || rating) > i ? "text-yellow-400" : "text-gray-300"}
            />
          </button>
        ))}
        <span className="text-sm text-[var(--muted)] ml-2">{rating > 0 ? `${rating}/5` : "Select rating"}</span>
      </div>

      <Textarea
        label="Comment (optional)"
        placeholder="Tell us about your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button className="mt-4" onClick={handleSubmit} loading={isPending}>
        Submit Review
      </Button>
    </div>
  );
}

export default function TenantReviewsPage() {
  const { data: raw, isLoading } = useMyRentals();
  const rentals = normalize(raw);
  const reviewable = rentals.filter((r) => r.status === "ACTIVE" || r.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Leave a Review</h2>
        <p className="text-[var(--muted)] text-sm mt-1">Review properties from your active or completed rentals</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}</div>
      ) : reviewable.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted)]">
          <Star size={40} className="mx-auto mb-4 opacity-20" />
          <p>No active or completed rentals to review yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewable.map((r) => <ReviewForm key={r.id} rental={r} />)}
        </div>
      )}
    </div>
  );
}
