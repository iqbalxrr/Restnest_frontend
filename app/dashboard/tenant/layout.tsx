"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Home, ClipboardList, CreditCard, Star } from "lucide-react";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      title="Tenant Dashboard"
      navItems={[
        { href: "/dashboard/tenant", label: "Overview", icon: <Home size={16} /> },
        { href: "/dashboard/tenant/requests", label: "My Requests", icon: <ClipboardList size={16} /> },
        { href: "/dashboard/tenant/payments", label: "Payments", icon: <CreditCard size={16} /> },
        { href: "/dashboard/tenant/reviews", label: "Leave Review", icon: <Star size={16} /> },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
