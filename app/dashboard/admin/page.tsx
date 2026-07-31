"use client";

import { useAdminDashboard } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { Users, Building2, ClipboardList, Clock } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboard();

  const statItems = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: <Users size={20} className="text-blue-500" /> },
        { label: "Total Properties", value: stats.totalProperties, icon: <Building2 size={20} className="text-[var(--primary)]" /> },
        { label: "Total Rentals", value: stats.totalRentals, icon: <ClipboardList size={20} className="text-yellow-500" /> },
        { label: "Pending Rentals", value: stats.pendingRentals, icon: <Clock size={20} className="text-orange-500" /> },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Platform Overview</h2>
        <p className="text-[var(--muted)] text-sm mt-1">Real-time statistics across the entire platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-4">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))
          : statItems.map((s) => (
              <Card key={s.label}>
                <CardContent className="flex items-center gap-4 pt-4">
                  <div className="w-10 h-10 bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-[var(--muted)]">{s.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
