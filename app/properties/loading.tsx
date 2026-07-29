import { PropertyCardSkeleton } from "@/components/ui/Skeleton";

export default function PropertiesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-2" />
      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
