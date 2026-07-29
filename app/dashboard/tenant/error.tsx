"use client";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function TenantError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <AlertTriangle size={28} className="text-red-400 mb-3" />
      <p className="font-medium text-[var(--foreground)]">Failed to load dashboard data</p>
      <p className="text-sm text-[var(--muted)] mt-1">{error.message}</p>
      <Button size="sm" className="mt-4" onClick={reset}>Retry</Button>
    </div>
  );
}
