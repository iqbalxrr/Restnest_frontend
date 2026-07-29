"use client";

import { useRouter } from "next/navigation";
import PropertyForm, { PropertyFormData } from "@/components/property/PropertyForm";
import { useCreateProperty } from "@/hooks/useProperties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function NewPropertyPage() {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateProperty();

  const handleSubmit = (data: PropertyFormData) => {
    create(
      {
        ...data,
        area: typeof data.area === "number" ? data.area : undefined,
        amenities: data.amenities,
        images: data.images,
      },
      { onSuccess: () => router.push("/dashboard/landlord/properties") }
    );
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Add New Property</h2>
        <p className="text-[var(--muted)] text-sm mt-1">Fill in the details to list your property.</p>
      </div>
      <Card>
        <CardContent className="py-6">
          <PropertyForm onSubmit={handleSubmit} loading={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
