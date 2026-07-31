import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RentalRequest, RentalStatus, PaginationMeta } from "@/lib/types";
import { toast } from "sonner";

interface CreateRentalData {
  propertyId: string;
  startDate: string;
  endDate: string;
  message?: string;
}

interface RentalsResult {
  rentals?: RentalRequest[];
  rentalRequests?: RentalRequest[];
  requests?: RentalRequest[];
  meta?: PaginationMeta;
}

export function useMyRentals(status?: RentalStatus) {
  const params = status ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["my-rentals", status],
    queryFn: () => api.get<RentalsResult | RentalRequest[]>(`/rentals${params}`),
  });
}

export function useRental(id: string) {
  return useQuery({
    queryKey: ["rental", id],
    queryFn: () => api.get<RentalRequest>(`/rentals/${id}`),
    enabled: !!id,
  });
}

export function useCreateRental() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRentalData) => api.post<RentalRequest>("/rentals", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-rentals"] });
      toast.success("Rental request submitted!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// Landlord requests
export function useLandlordRequests(status?: RentalStatus) {
  const params = status ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["landlord-requests", status],
    queryFn: () => api.get<RentalsResult | RentalRequest[]>(`/landlord/requests${params}`),
  });
}

export function useUpdateRequestStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      api.patch<RentalRequest>(`/landlord/requests/${id}`, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["landlord-requests"] });
      const prev = qc.getQueryData(["landlord-requests"]);
      // Optimistically update common query shapes used by the landlord requests page
      qc.setQueriesData({ queryKey: ["landlord-requests"] }, (old: unknown) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return (old as RentalRequest[]).map((r) => (r.id === id ? { ...r, status } : r));
        }
        const data = old as { rentals?: RentalRequest[]; rentalRequests?: RentalRequest[]; requests?: RentalRequest[] };
        const key = data.rentals ? "rentals" : data.rentalRequests ? "rentalRequests" : data.requests ? "requests" : null;
        if (!key) return old;
        return {
          ...data,
          [key]: (data[key] as RentalRequest[]).map((r) => (r.id === id ? { ...r, status } : r)),
        };
      });
      return { prev };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["landlord-requests"] });
      toast.success("Request status updated!");
    },
    onError: (err: Error, _vars, ctx: { prev?: unknown } | undefined) => {
      if (ctx?.prev) qc.setQueryData(["landlord-requests"], ctx.prev);
      toast.error(err.message);
    },
  });
}
