"use client";

import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { useLandlordProperties, useDeleteProperty } from "@/hooks/useProperties";
import { PropertyStatusBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { PlusCircle, Pencil, Trash2, BedDouble, Bath } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/Modal";

export default function LandlordPropertiesPage() {
  const { data: properties = [], isLoading } = useLandlordProperties();
  const { mutate: deleteProperty, isPending: deleting } = useDeleteProperty();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const propsArr = Array.isArray(properties) ? properties : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">My Properties</h2>
          <p className="text-[var(--muted)] text-sm">{propsArr.length} listing{propsArr.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/dashboard/landlord/properties/new">
          <Button className="gap-2">
            <PlusCircle size={16} /> Add Property
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : propsArr.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted)]">
          <p>No properties listed yet.</p>
          <Link href="/dashboard/landlord/properties/new">
            <Button className="mt-4 gap-2"><PlusCircle size={15} /> Add Your First Property</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {propsArr.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-[var(--border)] overflow-hidden flex">
              <div className="relative w-32 flex-shrink-0">
                <SafeImage
                  src={p.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&q=60"}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{p.title}</h3>
                  <PropertyStatusBadge status={p.status} />
                </div>
                <p className="text-xs text-[var(--muted)] mt-0.5">{p.location}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted)]">
                  <span className="flex items-center gap-1"><BedDouble size={11} /> {p.bedrooms} bd</span>
                  <span className="flex items-center gap-1"><Bath size={11} /> {p.bathrooms} ba</span>
                </div>
                <div className="font-bold text-[var(--primary)] mt-1">{formatCurrency(p.price)}<span className="text-xs font-normal text-[var(--muted)]">/mo</span></div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/dashboard/landlord/properties/${p.id}/edit`}>
                    <Button size="sm" variant="secondary" className="gap-1"><Pencil size={11} /> Edit</Button>
                  </Link>
                  <Button size="sm" variant="danger" className="gap-1" onClick={() => setConfirmId(p.id)}>
                    <Trash2 size={11} /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete Property">
        <p className="text-[var(--muted)] mb-6">Are you sure you want to delete this property? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button
            variant="danger"
            className="flex-1"
            loading={deleting}
            onClick={() => {
              if (confirmId) {
                deleteProperty(confirmId, { onSuccess: () => setConfirmId(null) });
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
