"use client";

import { useParams, useRouter } from "next/navigation";
import { useProperty } from "@/hooks/useProperties";
import { useUpdateProperty } from "@/hooks/useProperties";
import PropertyForm, { PropertyFormData } from "@/components/property/PropertyForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading } = useProperty(id);
  const { mutate: update, isPending } = useUpdateProperty(id);

  const handleSubmit = (data: PropertyFormData) => {
    update(
      {
        ...data,
        area: typeof data.area === "number" ? data.area : undefined,
        status: data.status as "AVAILABLE" | "UNAVAILABLE" | "RENTED" | undefined,
      },
      { onSuccess: () => router.push("/dashboard/landlord/properties") }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!property) return <div className="text-center py-20 text-[var(--muted)]">Property not found.</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Edit Property</h2>
        <p className="text-[var(--muted)] text-sm mt-1">{property.title}</p>
      </div>
      <Card>
        <CardContent className="py-6">
          <PropertyForm onSubmit={handleSubmit} loading={isPending} defaultValues={property} isEdit />
        </CardContent>
      </Card>
    </div>
  );
}
