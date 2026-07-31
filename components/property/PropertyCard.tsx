import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { PropertyStatusBadge } from "@/components/ui/Badge";
import { BedDouble, Bath, MapPin, Maximize2, ArrowUpRight } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80";

export default function PropertyCard({ property }: PropertyCardProps) {
  const image = property.images?.[0] || FALLBACK_IMAGE;

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10">
        <div className="relative h-56 overflow-hidden">
          <SafeImage
            src={image}
            fallbackSrc={FALLBACK_IMAGE}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
          <div className="absolute top-3 left-3">
            <PropertyStatusBadge status={property.status} />
          </div>
          {property.category && (
            <div className="absolute top-3 right-3">
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-[var(--foreground)] shadow-sm">
                {property.category.name}
              </span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[var(--primary)] opacity-0 shadow-sm transition-all group-hover:opacity-100">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div className="p-5">
          <h3 className="line-clamp-1 text-base font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
            {property.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-1 text-sm text-[var(--muted)]">
            <MapPin size={13} className="text-[var(--primary)]" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-1">
              <BedDouble size={14} /> {property.bedrooms} bd
            </span>
            <span className="flex items-center gap-1">
              <Bath size={14} /> {property.bathrooms} ba
            </span>
            {property.area && (
              <span className="flex items-center gap-1">
                <Maximize2 size={13} /> {property.area} sqft
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
            <div>
              <span className="text-lg font-bold text-[var(--primary)]">
                {formatCurrency(property.price)}
              </span>
              <span className="text-xs text-[var(--muted)]">/month</span>
            </div>
            {property._count && (
              <span className="text-xs text-[var(--muted)]">
                {property._count.reviews} review{property._count.reviews !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
