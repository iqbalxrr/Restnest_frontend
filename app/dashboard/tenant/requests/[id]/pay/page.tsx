"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRental } from "@/hooks/useRentals";
import { useCreatePayment, useConfirmPayment } from "@/hooks/usePayments";
import { Skeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Shield, CreditCard } from "lucide-react";

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

function CheckoutForm({
  clientSecret,
  paymentId,
  amount,
}: {
  clientSecret: string;
  paymentId: string;
  amount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { mutate: confirm } = useConfirmPayment();
  const [loading, setLoading] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?paymentId=${paymentId}`,
      },
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      confirm(
        { paymentId, transactionId: paymentIntent.id },
        {
          onSuccess: () => router.push(`/payment/success?paymentId=${paymentId}`),
          onError: () => router.push(`/payment/success?paymentId=${paymentId}`),
        }
      );
    } else {
      toast.error("Payment not completed. Try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <PaymentElement />
      <div className="flex items-center gap-2 text-xs text-[var(--muted)] bg-[var(--secondary)] rounded-lg p-3">
        <Shield size={14} className="text-[var(--primary)]" />
        Secured by Stripe. Test card: <span className="font-mono font-bold">4242 4242 4242 4242</span> | Any future date | Any CVC
      </div>
      <Button type="submit" loading={loading} className="w-full" size="lg">
        <CreditCard size={18} />
        Pay {formatCurrency(amount)}
      </Button>
    </form>
  );
}

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: rental, isLoading: rentalLoading } = useRental(id);
  const { mutate: createPayment, isPending: creating } = useCreatePayment();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [stripePromise] = useState(() => loadStripe(STRIPE_PK));

  useEffect(() => {
    if (rental && rental.status === "APPROVED" && !clientSecret) {
      createPayment(
        { rentalRequestId: id, provider: "STRIPE" },
        {
          onSuccess: (data) => {
            if (data.clientSecret === null) {
              // Already paid
              router.push(`/payment/success?paymentId=${data.payment.id}`);
              return;
            }
            setClientSecret(data.clientSecret);
            setPaymentId(data.payment.id);
          },
        }
      );
    }
  }, [rental, id, clientSecret, createPayment, router]);

  if (rentalLoading || creating) {
    return (
      <div className="max-w-lg mx-auto py-12 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!rental) return <div className="text-center py-20">Rental not found.</div>;
  if (rental.status !== "APPROVED") {
    return (
      <div className="max-w-lg mx-auto py-20 text-center text-[var(--muted)]">
        This rental is not in an approved state.
        <div className="mt-4">
          <Button onClick={() => router.push("/dashboard/tenant/requests")}>Back to Requests</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>

      {/* Property summary */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-5 mb-6">
        <h2 className="font-semibold text-lg">{rental.property?.title}</h2>
        <p className="text-[var(--muted)] text-sm mt-1">{rental.property?.location}</p>
        <div className="mt-3 pt-3 border-t border-[var(--border)] flex justify-between">
          <span className="text-[var(--muted)] text-sm">Monthly Rent</span>
          <span className="font-bold text-[var(--primary)] text-lg">
            {rental.property?.price ? formatCurrency(rental.property.price) : "—"}
          </span>
        </div>
      </div>

      {clientSecret && paymentId && stripePromise ? (
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <h3 className="font-semibold mb-4">Card Details</h3>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: { colorPrimary: "#1e5c3a" },
              },
            }}
          >
            <CheckoutForm
              clientSecret={clientSecret}
              paymentId={paymentId}
              amount={rental.property?.price || 0}
            />
          </Elements>
        </div>
      ) : (
        <div className="text-center py-8 text-[var(--muted)]">
          <Skeleton className="h-32 w-full rounded-xl" />
          <p className="mt-3 text-sm">Preparing payment form...</p>
        </div>
      )}
    </div>
  );
}
