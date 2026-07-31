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
  BadgeCheck,
  Bath,
  BedDouble,
  Calendar,
  Check,
  ChevronRight,
  Home,
  ImageIcon,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  ShieldCheck,
  Star,
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
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-2/5" />
        <Skeleton className="h-[520px] w-full rounded-3xl" />
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-80 w-full rounded-3xl" />
          <Skeleton className="h-72 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-[var(--muted)]">
        Property not found.
        <div className="mt-4"><Link href="/properties"><Button>Back to Properties</Button></Link></div>
      </div>
    );
  }

  const images = property.images?.length ? property.images : [FALLBACK];

  return (
    <div className="bg-[#f7f5ef]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-[var(--muted)]">
          <Link href="/" className="transition-colors hover:text-[var(--primary)]">Home</Link>
          <ChevronRight size={14} />
          <Link href="/properties" className="transition-colors hover:text-[var(--primary)]">Properties</Link>
          <ChevronRight size={14} />
          <span className="max-w-52 truncate text-[var(--foreground)]">{property.title}</span>
        </nav>

        {/* Property heading */}
        <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <PropertyStatusBadge status={property.status} />
              <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-medium">
                {property.category?.name}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)]">
                <BadgeCheck size={15} /> Verified listing
              </span>
            </div>
            <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              {property.title}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)] sm:text-base">
              <MapPin size={17} className="shrink-0 text-[var(--primary)]" />
              <span>{property.address}, {property.location}</span>
            </div>
          </div>
          <div className="shrink-0 lg:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Monthly rent</p>
            <p className="mt-1 text-3xl font-bold text-[var(--primary)]">
              {formatCurrency(property.price)}
              <span className="ml-1 text-sm font-normal text-[var(--muted)]">/month</span>
            </p>
          </div>
        </div>

        {/* Image gallery */}
        <div className="relative mb-9 overflow-hidden rounded-3xl bg-gray-200 shadow-xl shadow-emerald-950/10">
          <div className={`grid gap-1.5 ${images.length > 1 ? "lg:grid-cols-[2fr_1fr]" : ""}`}>
            <button
              type="button"
              className="group relative h-80 overflow-hidden text-left sm:h-[430px] lg:h-[520px]"
              aria-label="View main property image"
            >
              <SafeImage
                src={images[activeImage]}
                fallbackSrc={FALLBACK}
                alt={property.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                sizes="(max-width:1024px) 100vw, 67vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </button>

            {images.length > 1 && (
              <div className="hidden grid-rows-2 gap-1.5 lg:grid">
                {images.slice(0, 2).map((img, index) => {
                  const imageIndex = index;
                  return (
                    <button
                      type="button"
                      key={`${img}-${index}`}
                      onClick={() => setActiveImage(imageIndex)}
                      className={`relative overflow-hidden transition-opacity hover:opacity-90 ${
                        activeImage === imageIndex ? "ring-4 ring-inset ring-white" : ""
                      }`}
                    >
                      <SafeImage
                        src={img}
                        fallbackSrc={FALLBACK}
                        alt={`${property.title} view ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
            <ImageIcon size={14} />
            {activeImage + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-2 rounded-full bg-black/40 p-2 backdrop-blur-md">
              {images.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  aria-label={`Show image ${index + 1}`}
                  onClick={() => setActiveImage(index)}
                  className={`h-2 rounded-full transition-all ${
                    activeImage === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Main info */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
            {[
              { icon: BedDouble, value: property.bedrooms, label: "Bedrooms" },
              { icon: Bath, value: property.bathrooms, label: "Bathrooms" },
              { icon: Maximize2, value: property.area || "—", label: "Square feet" },
            ].map(({ icon: Icon, value, label }, index) => (
              <div
                key={label}
                className={`flex flex-col items-center px-3 py-5 text-center sm:flex-row sm:justify-center sm:gap-3 ${
                  index > 0 ? "border-l border-[var(--border)]" : ""
                }`}
              >
                <span className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-[var(--primary)] sm:mb-0">
                  <Icon size={19} />
                </span>
                <span className="sm:text-left">
                  <span className="block text-lg font-bold">{value}</span>
                  <span className="block text-[10px] text-[var(--muted)] sm:text-xs">{label}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">About this home</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Property overview</h2>
            <p className="mt-4 leading-7 text-[var(--muted)]">{property.description}</p>
          </section>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Everything included</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">Amenities</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-2.5 rounded-xl bg-[var(--secondary)] px-3 py-3 text-sm font-medium"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[var(--primary)]">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    {amenity}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Tenant experiences</span>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Reviews {reviews?.length ? `(${reviews.length})` : ""}
                </h2>
              </div>
              {reviews && reviews.length > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
                  <Star size={14} fill="currentColor" />
                  {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                </div>
              )}
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-2xl bg-[var(--secondary)] p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                          {(review.tenant?.name || "T").charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{review.tenant?.name || "Tenant"}</p>
                          <p className="text-[11px] text-[var(--muted)]">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            size={12}
                            fill={index < review.rating ? "currentColor" : "none"}
                            className={index < review.rating ? "text-amber-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="text-sm leading-6 text-[var(--muted)]">{review.comment}</p>}
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] py-9 text-center">
                <Star size={24} className="mx-auto text-gray-300" />
                <p className="mt-2 text-sm text-[var(--muted)]">No tenant reviews yet.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Price card */}
          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-xl shadow-emerald-950/[0.07]">
            <div className="bg-[#0d3527] p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">Monthly rent</p>
              <div className="mt-2 text-3xl font-bold">
                {formatCurrency(property.price)}
                <span className="ml-1 text-sm font-normal text-white/55">/month</span>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-5 flex items-start gap-3 rounded-xl bg-emerald-50 p-3">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                <p className="text-xs leading-5 text-emerald-900/70">
                  Send a request first. You only pay securely after the landlord approves it.
                </p>
              </div>

              {property.status === "AVAILABLE" ? (
                user?.role === "TENANT" || !user ? (
                  <Button
                    className="w-full rounded-xl"
                    size="lg"
                    onClick={() => {
                      if (!user) { router.push("/auth/login"); return; }
                      setRequestOpen(true);
                    }}
                  >
                    <Calendar size={17} />
                    Request to rent
                  </Button>
                ) : (
                  <p className="rounded-xl bg-[var(--secondary)] p-3 text-center text-sm text-[var(--muted)]">
                    Only tenants can submit rental requests.
                  </p>
                )
              ) : (
                <Button className="w-full" disabled size="lg">Not available</Button>
              )}

              {!user && (
                <p className="mt-3 text-center text-xs text-[var(--muted)]">
                  Already registered?{" "}
                  <Link href="/auth/login" className="font-semibold text-[var(--primary)] hover:underline">Sign in</Link>
                </p>
              )}
            </div>
          </div>

          {/* Landlord */}
          {property.landlord && (
            <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Meet your landlord</h3>
                <BadgeCheck size={18} className="text-[var(--primary)]" />
              </div>
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--primary)] text-base font-bold text-white">
                  {property.landlord.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{property.landlord.name}</div>
                  <div className="mt-0.5 text-xs text-[var(--muted)]">Verified property owner</div>
                </div>
              </div>
              <div className="space-y-3 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
                <a href={`mailto:${property.landlord.email}`} className="flex items-center gap-2.5 transition-colors hover:text-[var(--primary)]">
                  <Mail size={14} /> {property.landlord.email}
                </a>
                {property.landlord.phone && (
                  <a href={`tel:${property.landlord.phone}`} className="flex items-center gap-2.5 transition-colors hover:text-[var(--primary)]">
                    <Phone size={14} /> {property.landlord.phone}
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 text-sm">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--secondary)] text-[var(--primary)]">
              <Home size={18} />
            </span>
            <div>
              <span className="block text-xs text-[var(--muted)]">Property type</span>
              <span className="font-semibold">{property.category?.name}</span>
            </div>
          </div>
        </aside>
      </div>
      </div>

      {/* Request Modal */}
      <Modal open={requestOpen} onClose={() => setRequestOpen(false)} title="Submit Rental Request">
        <form noValidate onSubmit={handleSubmit(onSubmitRequest)} className="space-y-4">
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
