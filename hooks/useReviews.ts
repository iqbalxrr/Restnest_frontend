import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Review } from "@/lib/types";
import { toast } from "sonner";

interface CreateReviewData {
  rentalRequestId: string;
  rating: number;
  comment?: string;
}

export function usePropertyReviews(propertyId: string) {
  return useQuery({
    queryKey: ["reviews", propertyId],
    queryFn: () => api.get<Review[]>(`/reviews/property/${propertyId}`),
    enabled: !!propertyId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewData) => api.post<Review>("/reviews", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["my-rentals"] });
      toast.success("Review submitted successfully!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
