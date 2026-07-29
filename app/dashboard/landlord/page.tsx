"use client";

import Link from "next/link";
import { useLandlordProperties } from "@/hooks/useProperties";
import { useLandlordRequests } from "@/hooks/useRentals";
import { PropertyStatusBadge, RentalStatusBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { Building2, ClipboardList, TrendingUp, PlusCircle, ArrowRight } from "lucide-react";
import { RentalRequest } from "@/lib/types";

function normalizeRentals(data: unknown): RentalRequest[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const d = data as Record<string, unknown>;
  if (d.rentalRequests) return d.rentalRequests as RentalRequest[];
  if (d.requests) return d.requests as RentalRequest[];
  return [];
}

export default function LandlordDashboard() {
  const { data: properties = [], isLoading: propsLoading } = useLandlordProperties();
  const { data: requestsRaw, isLoading: reqLoading } = useLandlordRequests();
  const requests = normalizeRentals(requestsRaw);

  const propsArr = Array.isArray(properties) ? properties : [];
  const available = propsArr.filter((p) => p.status === "AVAILABLE").length;
  const rented = propsArr.filter((p) => p.status === "RENTED").length;
  const pending = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Properties",
            value: propsArr.length,
            icon: <Building2 size={20} className="text-[var(--primary)]" />,
            loading: propsLoading,
          },
          {
            label: "Pending Requests",
            value: pending,
            icon: <ClipboardList size={20} className="text-yellow-500" />,
            loading: reqLoading,
          },
          {
            label: "Active Rentals",
            value: rented,
            icon: <TrendingUp size={20} className="text-green-500" />,
            loading: propsLoading,
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 pt-4">
              <div className="w-10 h-10 bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {s.loading ? <Skeleton className="h-7 w-8" /> : s.value}
                </div>
                <div className="text-xs text-[var(--muted)]">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending alert */}
      {pending > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-yellow-800">{pending} pending request{pending > 1 ? "s" : ""} awaiting your action</div>
            <div className="text-sm text-yellow-600">Review and approve or reject tenant requests.</div>
          </div>
          <Link href="/dashboard/landlord/requests">
            <Button size="sm">Review Now</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Properties</CardTitle>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/landlord/properties/new">
                <Button size="sm" variant="outline" className="gap-1"><PlusCircle size={13} /> Add</Button>
              </Link>
              <Link href="/dashboard/landlord/properties" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
                All <ArrowRight size={13} />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {propsLoading ? (
              <div className="p-4 space-y-2">{[1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : propsArr.length === 0 ? (
              <div className="p-6 text-center text-[var(--muted)] text-sm">
                No properties yet.
                <div className="mt-2"><Link href="/dashboard/landlord/properties/new"><Button size="sm" variant="outline">Add First Property</Button></Link></div>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-[var(--secondary)] text-[var(--muted)]">
                  <tr>
                    <th className="text-left px-4 py-2">Title</th>
                    <th className="text-left px-4 py-2">Price</th>
                    <th className="text-left px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {propsArr.slice(0, 5).map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2.5 font-medium">{p.title}</td>
                      <td className="px-4 py-2.5">{formatCurrency(p.price)}</td>
                      <td className="px-4 py-2.5"><PropertyStatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Recent requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Requests</CardTitle>
            <Link href="/dashboard/landlord/requests" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
              All <ArrowRight size={13} />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {reqLoading ? (
              <div className="p-4 space-y-2">{[1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : requests.length === 0 ? (
              <div className="p-6 text-center text-[var(--muted)] text-sm">No requests received yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-[var(--secondary)] text-[var(--muted)]">
                  <tr>
                    <th className="text-left px-4 py-2">Tenant</th>
                    <th className="text-left px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {requests.slice(0, 5).map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-2.5">{r.tenant?.name || "Tenant"}<div className="text-xs text-[var(--muted)]">{r.property?.title}</div></td>
                      <td className="px-4 py-2.5"><RentalStatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
