"use client";

import Link from "next/link";
import { useMyRentals } from "@/hooks/useRentals";
import { RentalStatusBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { normalizeRentals } from "@/lib/normalize";
import { Calendar } from "lucide-react";

export default function TenantRequestsPage() {
  const { data: raw, isLoading } = useMyRentals();
  const rentals = normalizeRentals(raw);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">My Rental Requests</h2>
        <p className="text-[var(--muted)] text-sm mt-1">Track all your rental applications</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : rentals.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted)]">
          <p>No requests yet.</p>
          <Link href="/properties"><Button size="sm" variant="outline" className="mt-3">Browse Properties</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rentals.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-[var(--border)] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{r.property?.title || "Property"}</h3>
                  <p className="text-sm text-[var(--muted)] mt-0.5">{r.property?.location}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-[var(--muted)]">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </span>
                    {r.property?.price && (
                      <span className="font-medium text-[var(--primary)]">
                        {formatCurrency(r.property.price)}/mo
                      </span>
                    )}
                  </div>
                  {r.message && (
                    <p className="text-xs text-[var(--muted)] mt-2 italic">"{r.message}"</p>
                  )}
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <RentalStatusBadge status={r.status} />
                  {r.status === "APPROVED" && (
                    <Link href={`/dashboard/tenant/requests/${r.id}/pay`}>
                      <Button size="sm">Pay Now →</Button>
                    </Link>
                  )}
                  {r.status === "ACTIVE" && (
                    <Link href="/dashboard/tenant/reviews">
                      <Button size="sm" variant="outline">Leave Review</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
