import Link from "next/link";
import Image from "next/image";
import { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { PropertyStatusBadge } from "@/components/ui/Badge";
import { BedDouble, Bath, MapPin, Maximize2 } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80";

export default function PropertyCard({ property }: PropertyCardProps) {
  const image = property.images?.[0] || FALLBACK_IMAGE;

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={image}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <PropertyStatusBadge status={property.status} />
          </div>
          {property.category && (
            <div className="absolute top-3 right-3">
              <span className="bg-white/90 text-xs font-medium px-2 py-1 rounded-full text-[var(--foreground)]">
                {property.category.name}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-[var(--foreground)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-[var(--muted)] text-sm mt-1">
            <MapPin size={13} />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-[var(--muted)] mt-3">
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

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
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
