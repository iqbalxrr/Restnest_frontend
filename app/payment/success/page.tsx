"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const paymentId = params.get("paymentId");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">Payment Successful!</h1>
        <p className="text-[var(--muted)] mb-6">
          Your rental is now active. Welcome to your new home! 🏠
        </p>
        {paymentId && (
          <div className="bg-[var(--secondary)] rounded-lg p-3 mb-6 text-sm text-[var(--muted)]">
            Payment ID: <span className="font-mono text-xs">{paymentId}</span>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/tenant">
            <Button>Go to Dashboard</Button>
          </Link>
          <Link href="/dashboard/tenant/reviews">
            <Button variant="outline">Leave a Review</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}
