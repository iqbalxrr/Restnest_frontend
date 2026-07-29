"use client";

import { useLandlordRequests, useUpdateRequestStatus } from "@/hooks/useRentals";
import { RentalStatusBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { RentalRequest } from "@/lib/types";
import { CheckCircle2, XCircle, Calendar } from "lucide-react";

function normalizeRentals(data: unknown): RentalRequest[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const d = data as Record<string, unknown>;
  if (d.rentalRequests) return d.rentalRequests as RentalRequest[];
  if (d.requests) return d.requests as RentalRequest[];
  return [];
}

export default function LandlordRequestsPage() {
  const { data: raw, isLoading } = useLandlordRequests();
  const { mutate: updateStatus, isPending } = useUpdateRequestStatus();
  const requests = normalizeRentals(raw);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Rental Requests</h2>
        <p className="text-[var(--muted)] text-sm mt-1">
          {requests.filter((r) => r.status === "PENDING").length} pending approval
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted)]">No requests received yet.</div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-[var(--border)] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{r.property?.title || "Property"}</h3>
                  <div className="text-sm text-[var(--muted)] mt-0.5">
                    Tenant: <span className="font-medium text-[var(--foreground)]">{r.tenant?.name || "—"}</span>
                    {r.tenant?.email && <span className="ml-1">({r.tenant.email})</span>}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[var(--muted)] mt-1">
                    <Calendar size={13} />
                    {formatDate(r.startDate)} → {formatDate(r.endDate)}
                  </div>
                  {r.message && (
                    <p className="text-xs text-[var(--muted)] mt-1 italic bg-[var(--secondary)] px-2 py-1 rounded">
                      "{r.message}"
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-start sm:items-end gap-3">
                  <RentalStatusBadge status={r.status} />
                  {r.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        className="gap-1"
                        loading={isPending}
                        onClick={() => updateStatus({ id: r.id, status: "APPROVED" })}
                      >
                        <CheckCircle2 size={14} /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="gap-1"
                        loading={isPending}
                        onClick={() => updateStatus({ id: r.id, status: "REJECTED" })}
                      >
                        <XCircle size={14} /> Reject
                      </Button>
                    </div>
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
