import { cn } from "@/lib/utils";
import { RentalStatus, PropertyStatus, PaymentStatus } from "@/lib/types";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", className)}>
      {children}
    </span>
  );
}

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  const map: Record<RentalStatus, string> = {
    PENDING: "badge-pending",
    APPROVED: "badge-approved",
    REJECTED: "badge-rejected",
    ACTIVE: "badge-active",
    COMPLETED: "badge-completed",
  };
  return <Badge className={map[status]}>{status}</Badge>;
}

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  const map: Record<PropertyStatus, string> = {
    AVAILABLE: "badge-active",
    UNAVAILABLE: "badge-pending",
    RENTED: "badge-rejected",
  };
  return <Badge className={map[status]}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, string> = {
    PENDING: "badge-pending",
    COMPLETED: "badge-active",
    FAILED: "badge-rejected",
  };
  return <Badge className={map[status]}>{status}</Badge>;
}
