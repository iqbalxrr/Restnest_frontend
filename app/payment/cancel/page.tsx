"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">Payment Cancelled</h1>
        <p className="text-[var(--muted)] mb-8">
          Your payment was not completed. Your rental request is still approved — you can try again anytime.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/tenant/requests">
            <Button>Back to Requests</Button>
          </Link>
          <Link href="/properties">
            <Button variant="outline">Browse Properties</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
