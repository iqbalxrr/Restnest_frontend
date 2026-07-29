"use client";

import Link from "next/link";
import { useMyRentals } from "@/hooks/useRentals";
import { useMyPayments } from "@/hooks/usePayments";
import { RentalStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ClipboardList, CreditCard, Home, ArrowRight } from "lucide-react";
import { RentalRequest } from "@/lib/types";

function normalize(data: unknown): RentalRequest[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const d = data as Record<string, unknown>;
  if (d.rentalRequests) return d.rentalRequests as RentalRequest[];
  if (d.requests) return d.requests as RentalRequest[];
  return [];
}

export default function TenantDashboard() {
  const { data: rentalsRaw, isLoading: rentalsLoading } = useMyRentals();
  const { data: paymentsRaw, isLoading: paymentsLoading } = useMyPayments();

  const rentals = normalize(rentalsRaw);
  const payments = Array.isArray(paymentsRaw) ? paymentsRaw : [];

  const pending = rentals.filter((r) => r.status === "PENDING").length;
  const approved = rentals.filter((r) => r.status === "APPROVED").length;
  const active = rentals.filter((r) => r.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Requests", value: rentals.length, icon: <ClipboardList size={20} className="text-[var(--primary)]" /> },
          { label: "Approved", value: approved, icon: <Home size={20} className="text-blue-500" /> },
          { label: "Active Rentals", value: active, icon: <CreditCard size={20} className="text-green-500" /> },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 pt-4">
              <div className="w-10 h-10 bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {rentalsLoading ? <Skeleton className="h-7 w-8" /> : s.value}
                </div>
                <div className="text-xs text-[var(--muted)]">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending action */}
      {approved > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-blue-800">You have {approved} approved request{approved > 1 ? "s" : ""}!</div>
            <div className="text-sm text-blue-600">Proceed to payment to activate your rental.</div>
          </div>
          <Link href="/dashboard/tenant/requests">
            <Button size="sm">View Requests</Button>
          </Link>
        </div>
      )}

      {/* Recent requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Requests</CardTitle>
          <Link href="/dashboard/tenant/requests" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {rentalsLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : rentals.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted)]">
              <p>No rental requests yet.</p>
              <Link href="/properties" className="mt-3 inline-block"><Button size="sm" variant="outline">Browse Properties</Button></Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[var(--secondary)] text-[var(--muted)]">
                <tr>
                  <th className="text-left px-4 py-2">Property</th>
                  <th className="text-left px-4 py-2 hidden md:table-cell">Start</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {rentals.slice(0, 5).map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-medium">{r.property?.title || "Property"}</td>
                    <td className="px-4 py-3 text-[var(--muted)] hidden md:table-cell">{formatDate(r.startDate)}</td>
                    <td className="px-4 py-3"><RentalStatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      {r.status === "APPROVED" && (
                        <Link href={`/dashboard/tenant/requests/${r.id}/pay`}>
                          <Button size="sm" variant="primary">Pay Now</Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Recent payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Payments</CardTitle>
          <Link href="/dashboard/tenant/payments" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {paymentsLoading ? (
            <div className="p-6 space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted)]">No payments yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[var(--secondary)] text-[var(--muted)]">
                <tr>
                  <th className="text-left px-4 py-2">Property</th>
                  <th className="text-left px-4 py-2">Amount</th>
                  <th className="text-left px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {payments.slice(0, 3).map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">{p.rentalRequest?.property?.title || "Property"}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3"><PaymentStatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
