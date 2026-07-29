"use client";

import { useState, useCallback } from "react";
import { useProperties, useCategories } from "@/hooks/useProperties";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/Skeleton";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filters = {
    search: search || undefined,
    location: location || undefined,
    categoryId: categoryId || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    bedrooms: bedrooms ? Number(bedrooms) : undefined,
    page,
    limit: 9,
  };

  const { data, isLoading } = useProperties(filters);
  const { data: categories } = useCategories();

  const clearFilters = () => {
    setSearch(""); setLocation(""); setCategoryId(""); setMinPrice(""); setMaxPrice(""); setBedrooms(""); setPage(1);
  };

  const hasFilters = !!(search || location || categoryId || minPrice || maxPrice || bedrooms);

  const catOptions = [
    { value: "", label: "All Categories" },
    ...(categories?.map((c) => ({ value: c.id, label: c.name })) || []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Properties</h1>
        <p className="text-[var(--muted)] mt-1">
          {data?.meta?.total !== undefined ? `${data.meta.total} properties found` : "Find your perfect rental"}
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title, location, description..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>
        <Button
          variant={showFilters ? "primary" : "secondary"}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasFilters && <span className="bg-white text-[var(--primary)] rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold">!</span>}
        </Button>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-1 text-red-500">
            <X size={15} /> Clear
          </Button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-[var(--border)] rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Location"
            placeholder="Gulshan, Dhanmondi..."
            value={location}
            onChange={(e) => { setLocation(e.target.value); setPage(1); }}
          />
          <Select
            label="Category"
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
            options={catOptions}
          />
          <Input
            label="Min Price (BDT)"
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
          />
          <Input
            label="Max Price (BDT)"
            type="number"
            placeholder="200000"
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
          />
          <Select
            label="Bedrooms"
            value={bedrooms}
            onChange={(e) => { setBedrooms(e.target.value); setPage(1); }}
            options={[
              { value: "", label: "Any" },
              { value: "1", label: "1+" },
              { value: "2", label: "2+" },
              { value: "3", label: "3+" },
              { value: "4", label: "4+" },
            ]}
          />
        </div>
      )}

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {search && <Chip label={`Search: "${search}"`} onRemove={() => setSearch("")} />}
          {location && <Chip label={`Location: ${location}`} onRemove={() => setLocation("")} />}
          {categoryId && categories && (
            <Chip
              label={`Category: ${categories.find((c) => c.id === categoryId)?.name}`}
              onRemove={() => setCategoryId("")}
            />
          )}
          {minPrice && <Chip label={`Min: ৳${minPrice}`} onRemove={() => setMinPrice("")} />}
          {maxPrice && <Chip label={`Max: ৳${maxPrice}`} onRemove={() => setMaxPrice("")} />}
          {bedrooms && <Chip label={`${bedrooms}+ beds`} onRemove={() => setBedrooms("")} />}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
        </div>
      ) : data?.properties?.length ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.properties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
          {/* Pagination */}
          {data.meta && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="gap-1"
              >
                <ChevronLeft size={15} /> Prev
              </Button>
              <span className="text-sm text-[var(--muted)]">
                Page {page} of {data.meta.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage(page + 1)}
                className="gap-1"
              >
                Next <ChevronRight size={15} />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-[var(--muted)]">
          <Search size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No properties found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
          {hasFilters && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
          )}
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string | undefined; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-red-500">
        <X size={12} />
      </button>
    </span>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense>
      <PropertiesContent />
    </Suspense>
  );
}
