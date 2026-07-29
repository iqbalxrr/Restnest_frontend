"use client";

import { useParams, useRouter } from "next/navigation";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { useState } from "react";
import { useProperty } from "@/hooks/useProperties";
import { usePropertyReviews } from "@/hooks/useReviews";
import { useCreateRental } from "@/hooks/useRentals";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { PropertyStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import Input from "@/components/ui/Input";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  MapPin, BedDouble, Bath, Maximize2, Star,
  Phone, Mail, Calendar, ChevronLeft, Check
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const rentalSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  message: z.string().max(500).optional(),
}).refine((d) => new Date(d.endDate) > new Date(d.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});
type RentalForm = z.infer<typeof rentalSchema>;

const FALLBACK = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: property, isLoading } = useProperty(id);
  const { data: reviews } = usePropertyReviews(id);
  const { mutate: createRental, isPending } = useCreateRental();
  const [activeImage, setActiveImage] = useState(0);
  const [requestOpen, setRequestOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RentalForm>({
    resolver: zodResolver(rentalSchema),
  });

  const onSubmitRequest = (data: RentalForm) => {
    if (!user) {
      toast.error("Please login to request a rental");
      router.push("/auth/login");
      return;
    }
    createRental(
      {
        propertyId: id,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        message: data.message,
      },
      {
        onSuccess: () => {
          setRequestOpen(false);
          reset();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-[var(--muted)]">
        Property not found.
        <div className="mt-4"><Link href="/properties"><Button>Back to Properties</Button></Link></div>
      </div>
    );
  }

  const images = property.images?.length ? property.images : [FALLBACK];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link href="/properties" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--primary)] mb-6">
        <ChevronLeft size={16} /> All Properties
      </Link>

      {/* Image gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8 rounded-2xl overflow-hidden">
        <div className="lg:col-span-2 relative h-72 lg:h-96">
          <SafeImage src={images[activeImage]} fallbackSrc={FALLBACK} alt={property.title} fill className="object-cover" sizes="(max-width:1024px) 100vw,66vw" />
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {images.slice(1, 3).map((img, i) => (
              <div
                key={i}
                className={`relative h-32 lg:h-full cursor-pointer ${activeImage === i + 1 ? "ring-2 ring-[var(--primary)]" : ""}`}
                onClick={() => setActiveImage(i + 1)}
              >
                <SafeImage src={img} fallbackSrc={FALLBACK} alt={`View ${i + 2}`} fill className="object-cover" sizes="200px" />
              </div>
            ))}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mb-8">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${activeImage === i ? "bg-[var(--primary)]" : "bg-gray-300"}`}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl lg:text-3xl font-bold leading-tight">{property.title}</h1>
              <PropertyStatusBadge status={property.status} />
            </div>
            <div className="flex items-center gap-1.5 text-[var(--muted)] mt-2">
              <MapPin size={15} />
              <span>{property.address}, {property.location}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-[var(--secondary)] rounded-xl">
            <div className="text-center">
              <div className="flex justify-center mb-1"><BedDouble size={20} className="text-[var(--primary)]" /></div>
              <div className="font-semibold">{property.bedrooms}</div>
              <div className="text-xs text-[var(--muted)]">Bedrooms</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1"><Bath size={20} className="text-[var(--primary)]" /></div>
              <div className="font-semibold">{property.bathrooms}</div>
              <div className="text-xs text-[var(--muted)]">Bathrooms</div>
            </div>
            {property.area && (
              <div className="text-center">
                <div className="flex justify-center mb-1"><Maximize2 size={20} className="text-[var(--primary)]" /></div>
                <div className="font-semibold">{property.area}</div>
                <div className="text-xs text-[var(--muted)]">sqft</div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-[var(--muted)] leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--secondary)] rounded-lg text-sm">
                    <Check size={13} className="text-[var(--primary)]" /> {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {reviews && reviews.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Reviews ({reviews.length})</h2>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 bg-[var(--secondary)] rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{r.tenant?.name || "Tenant"}</div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-[var(--muted)]">{r.comment}</p>}
                    <p className="text-xs text-[var(--muted)] mt-2">{formatDate(r.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Price card */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-[var(--primary)]">
              {formatCurrency(property.price)}
            </div>
            <div className="text-sm text-[var(--muted)] mb-5">per month</div>

            {property.status === "AVAILABLE" ? (
              user?.role === "TENANT" || !user ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    if (!user) { router.push("/auth/login"); return; }
                    setRequestOpen(true);
                  }}
                >
                  Request to Rent
                </Button>
              ) : (
                <p className="text-sm text-[var(--muted)] text-center">Only tenants can submit requests.</p>
              )
            ) : (
              <Button className="w-full" disabled size="lg">Not Available</Button>
            )}

            {!user && (
              <p className="text-xs text-center text-[var(--muted)] mt-3">
                <Link href="/auth/login" className="text-[var(--primary)] hover:underline">Login</Link> to submit a request
              </p>
            )}
          </div>

          {/* Landlord */}
          {property.landlord && (
            <div className="bg-white border border-[var(--border)] rounded-2xl p-5">
              <h3 className="font-semibold mb-3">Listed by</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {property.landlord.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-sm">{property.landlord.name}</div>
                  <div className="text-xs text-[var(--muted)]">Landlord</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-2"><Mail size={13} /> {property.landlord.email}</div>
                {property.landlord.phone && (
                  <div className="flex items-center gap-2"><Phone size={13} /> {property.landlord.phone}</div>
                )}
              </div>
            </div>
          )}

          {/* Category */}
          <div className="bg-[var(--secondary)] rounded-xl p-4 text-sm">
            <span className="text-[var(--muted)]">Category: </span>
            <span className="font-medium">{property.category?.name}</span>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <Modal open={requestOpen} onClose={() => setRequestOpen(false)} title="Submit Rental Request">
        <form onSubmit={handleSubmit(onSubmitRequest)} className="space-y-4">
          <div className="p-3 bg-[var(--secondary)] rounded-lg text-sm">
            <div className="font-medium">{property.title}</div>
            <div className="text-[var(--muted)]">{formatCurrency(property.price)}/month</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              required
              error={errors.startDate?.message}
              {...register("startDate")}
            />
            <Input
              label="End Date"
              type="date"
              required
              error={errors.endDate?.message}
              {...register("endDate")}
            />
          </div>
          <Textarea
            label="Message to Landlord (optional)"
            placeholder="Introduce yourself, ask questions..."
            {...register("message")}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setRequestOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={isPending}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
