"use client";

import { useMyPayments } from "@/hooks/usePayments";
import { PaymentStatusBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CreditCard } from "lucide-react";

export default function TenantPaymentsPage() {
  const { data: payments, isLoading } = useMyPayments();
  const list = Array.isArray(payments) ? payments : [];

  const total = list.filter((p) => p.status === "COMPLETED").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Payment History</h2>
        <p className="text-[var(--muted)] text-sm mt-1">All your rental payment transactions</p>
      </div>

      {/* Total */}
      <div className="bg-[var(--primary)] text-white rounded-xl p-5 flex items-center gap-4">
        <CreditCard size={28} className="opacity-80" />
        <div>
          <div className="text-2xl font-bold">{formatCurrency(total)}</div>
          <div className="text-sm opacity-80">Total paid</div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted)]">No payment records yet.</div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--secondary)] text-[var(--muted)]">
              <tr>
                <th className="text-left px-4 py-3">Property</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {list.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.rentalRequest?.property?.title || "Property"}</div>
                    <div className="text-xs text-[var(--muted)]">{p.provider}</div>
                  </td>
                  <td className="px-4 py-3 font-bold text-[var(--primary)]">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3 text-[var(--muted)] hidden md:table-cell">
                    {p.paidAt ? formatDate(p.paidAt) : formatDate(p.createdAt)}
                  </td>
                  <td className="px-4 py-3"><PaymentStatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
