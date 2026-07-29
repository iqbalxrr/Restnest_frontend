"use client";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function PropertiesError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <AlertTriangle size={36} className="mx-auto text-red-400 mb-4" />
      <h2 className="text-xl font-bold mb-2">Failed to load properties</h2>
      <p className="text-[var(--muted)] mb-6">{error.message}</p>
      <div className="flex gap-3 justify-center">
        <Button onClick={reset}>Retry</Button>
        <Link href="/"><Button variant="outline">Home</Button></Link>
      </div>
    </div>
  );
}
