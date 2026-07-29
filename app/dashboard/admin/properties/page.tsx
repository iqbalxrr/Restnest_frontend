"use client";

import { useAdminProperties } from "@/hooks/useAdmin";
import { PropertyStatusBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Property } from "@/lib/types";

export default function AdminPropertiesPage() {
  const { data, isLoading } = useAdminProperties();
  const properties: Property[] = data?.properties || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">All Properties</h2>
        <p className="text-[var(--muted)] text-sm">{properties.length} total listings</p>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--secondary)] text-[var(--muted)]">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Landlord</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Listed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4, 5].map((j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              : properties.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--secondary)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-[var(--muted)]">{p.location}</div>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)] hidden md:table-cell">{p.landlord?.name || "—"}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3"><PropertyStatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-[var(--muted)] hidden lg:table-cell">{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
