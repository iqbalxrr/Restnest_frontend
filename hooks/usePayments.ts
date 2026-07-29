import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Payment } from "@/lib/types";
import { toast } from "sonner";

interface CreatePaymentData {
  rentalRequestId: string;
  provider: "STRIPE";
}

interface CreatePaymentResult {
  payment: Payment;
  clientSecret: string | null;
  publishableKey: string | null;
  stripePaymentIntentId?: string;
}

interface ConfirmPaymentData {
  paymentId: string;
  transactionId: string;
}

export function useMyPayments() {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: () => api.get<Payment[]>("/payments"),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => api.get<Payment>(`/payments/${id}`),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (data: CreatePaymentData) =>
      api.post<CreatePaymentResult>("/payments/create", data),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfirmPaymentData) =>
      api.post<{ payment: Payment; status: string }>("/payments/confirm", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-payments"] });
      qc.invalidateQueries({ queryKey: ["my-rentals"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
