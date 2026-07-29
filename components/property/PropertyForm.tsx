"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useCategories } from "@/hooks/useProperties";
import { Property } from "@/lib/types";
import { useState } from "react";
import { X, Plus } from "lucide-react";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(2, "Location is required"),
  address: z.string().min(5, "Address is required"),
  price: z.coerce.number().positive("Price must be positive"),
  bedrooms: z.coerce.number().int().positive("Bedrooms must be at least 1"),
  bathrooms: z.coerce.number().int().positive("Bathrooms must be at least 1"),
  area: z.coerce.number().positive().optional().or(z.literal("")),
  categoryId: z.string().uuid("Please select a category"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "RENTED"]).optional(),
});

export type PropertyFormData = z.infer<typeof schema> & {
  amenities: string[];
  images: string[];
};

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  loading?: boolean;
  defaultValues?: Partial<Property>;
  isEdit?: boolean;
}

export default function PropertyForm({ onSubmit, loading, defaultValues, isEdit }: PropertyFormProps) {
  const { data: categories = [] } = useCategories();
  const [amenities, setAmenities] = useState<string[]>(defaultValues?.amenities || []);
  const [newAmenity, setNewAmenity] = useState("");
  const [images, setImages] = useState<string[]>(defaultValues?.images || [""]);

  const catOptions = Array.isArray(categories)
    ? categories.map((c) => ({ value: c.id, label: c.name }))
    : [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          description: defaultValues.description,
          location: defaultValues.location,
          address: defaultValues.address,
          price: defaultValues.price,
          bedrooms: defaultValues.bedrooms,
          bathrooms: defaultValues.bathrooms,
          area: defaultValues.area || undefined,
          categoryId: defaultValues.categoryId,
          status: defaultValues.status,
        }
      : {},
  });

  const handleFormSubmit = (data: z.infer<typeof schema>) => {
    onSubmit({
      ...data,
      area: data.area === "" ? undefined : data.area as number | undefined,
      amenities,
      images: images.filter(Boolean),
    });
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (i: number) => setAmenities(amenities.filter((_, idx) => idx !== i));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input label="Title" required placeholder="Modern 2BR Apartment in Gulshan" error={errors.title?.message} {...register("title")} />
        </div>
        <div className="md:col-span-2">
          <Textarea label="Description" required placeholder="Describe your property in detail..." error={errors.description?.message} {...register("description")} />
        </div>
        <Input label="Location" required placeholder="Gulshan" error={errors.location?.message} {...register("location")} />
        <Input label="Address" required placeholder="Road 45, Gulshan-2, Dhaka" error={errors.address?.message} {...register("address")} />
        <Input label="Monthly Rent (BDT)" type="number" required placeholder="45000" error={errors.price?.message} {...register("price")} />
        <Input label="Area (sqft, optional)" type="number" placeholder="1200" error={errors.area?.message as string} {...register("area")} />
        <Input label="Bedrooms" type="number" required placeholder="2" error={errors.bedrooms?.message} {...register("bedrooms")} />
        <Input label="Bathrooms" type="number" required placeholder="2" error={errors.bathrooms?.message} {...register("bathrooms")} />
        <Select
          label="Category"
          required
          error={errors.categoryId?.message}
          options={catOptions}
          placeholder="Select category"
          {...register("categoryId")}
        />
        {isEdit && (
          <Select
            label="Status"
            options={[
              { value: "AVAILABLE", label: "Available" },
              { value: "UNAVAILABLE", label: "Unavailable" },
              { value: "RENTED", label: "Rented" },
            ]}
            {...register("status")}
          />
        )}
      </div>

      {/* Images */}
      <div>
        <label className="text-sm font-medium block mb-2">Image URLs</label>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="https://images.unsplash.com/..."
                value={img}
                onChange={(e) => {
                  const updated = [...images];
                  updated[i] = e.target.value;
                  setImages(updated);
                }}
              />
              {images.length > 1 && (
                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setImages([...images, ""])} className="mt-2 text-sm text-[var(--primary)] flex items-center gap-1 hover:underline">
          <Plus size={14} /> Add another image
        </button>
      </div>

      {/* Amenities */}
      <div>
        <label className="text-sm font-medium block mb-2">Amenities</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {amenities.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--secondary)] rounded-full text-sm">
              {a}
              <button type="button" onClick={() => removeAmenity(i)} className="text-[var(--muted)] hover:text-red-500">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(); } }}
            placeholder="WiFi, Parking, Gym..."
            className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          />
          <Button type="button" variant="secondary" size="sm" onClick={addAmenity}>Add</Button>
        </div>
      </div>

      <Button type="submit" loading={loading} size="lg" className="w-full">
        {isEdit ? "Update Property" : "Create Property"}
      </Button>
    </form>
  );
}
