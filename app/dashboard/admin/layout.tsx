"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Users, Building2, ClipboardList } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      title="Admin Dashboard"
      navItems={[
        { href: "/dashboard/admin", label: "Overview", icon: <LayoutDashboard size={16} /> },
        { href: "/dashboard/admin/users", label: "Users", icon: <Users size={16} /> },
        { href: "/dashboard/admin/properties", label: "Properties", icon: <Building2 size={16} /> },
        { href: "/dashboard/admin/rentals", label: "Rentals", icon: <ClipboardList size={16} /> },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
