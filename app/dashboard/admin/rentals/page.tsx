"use client";

import { useAdminRentals } from "@/hooks/useAdmin";
import { RentalStatusBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import { RentalRequest } from "@/lib/types";

function normalizeRentals(data: unknown): RentalRequest[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const d = data as Record<string, unknown>;
  if (d.rentalRequests) return d.rentalRequests as RentalRequest[];
  if (d.requests) return d.requests as RentalRequest[];
  return [];
}

export default function AdminRentalsPage() {
  const { data, isLoading } = useAdminRentals();
  const rentals = normalizeRentals(data);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">All Rental Requests</h2>
        <p className="text-[var(--muted)] text-sm">{rentals.length} total requests</p>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--secondary)] text-[var(--muted)]">
            <tr>
              <th className="text-left px-4 py-3">Property</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Tenant</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Period</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4].map((j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              : rentals.map((r) => (
                  <tr key={r.id} className="hover:bg-[var(--secondary)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.property?.title || "—"}</div>
                      <div className="text-xs text-[var(--muted)]">{r.property?.location}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">{r.tenant?.name || "—"}</td>
                    <td className="px-4 py-3 text-[var(--muted)] hidden lg:table-cell">
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </td>
                    <td className="px-4 py-3"><RentalStatusBadge status={r.status} /></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
