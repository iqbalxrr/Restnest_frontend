"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Home, Building2, ClipboardList, PlusCircle } from "lucide-react";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      title="Landlord Dashboard"
      navItems={[
        { href: "/dashboard/landlord", label: "Overview", icon: <Home size={16} /> },
        { href: "/dashboard/landlord/properties", label: "My Properties", icon: <Building2 size={16} /> },
        { href: "/dashboard/landlord/properties/new", label: "Add Property", icon: <PlusCircle size={16} /> },
        { href: "/dashboard/landlord/requests", label: "Rental Requests", icon: <ClipboardList size={16} /> },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
