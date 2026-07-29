"use client";

import Link from "next/link";
import { useProperties, useCategories } from "@/hooks/useProperties";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { Search, Building2, Shield, CreditCard } from "lucide-react";

export default function HomePage() {
  const { data, isLoading } = useProperties({ limit: 6 });
  const { data: categories } = useCategories();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[var(--primary)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=60')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Find Your Perfect
              <br />
              <span className="text-[var(--accent)]">Rental Home</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Browse thousands of verified rental properties. Connect directly with landlords, submit requests, and move in — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/properties">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Search size={18} />
                  Browse Properties
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-[var(--primary)]">
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 divide-x divide-[var(--border)]">
            {[
              { label: "Properties Listed", value: "500+" },
              { label: "Happy Tenants", value: "1,200+" },
              { label: "Cities Covered", value: "15+" },
            ].map((s) => (
              <div key={s.label} className="text-center px-4">
                <div className="text-2xl font-bold text-[var(--primary)]">{s.value}</div>
                <div className="text-sm text-[var(--muted)] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/properties?categoryId=${cat.id}`}
                className="px-5 py-2.5 rounded-full border border-[var(--border)] bg-white text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Properties</h2>
            <p className="text-[var(--muted)] text-sm mt-1">Latest available rentals</p>
          </div>
          <Link href="/properties">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : data?.properties?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--muted)]">
            No properties available yet.
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-[var(--secondary)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">How RentNest Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search size={28} className="text-[var(--primary)]" />,
                title: "Browse & Filter",
                desc: "Search properties by location, price, type, and amenities with real-time filters.",
              },
              {
                icon: <Building2 size={28} className="text-[var(--primary)]" />,
                title: "Submit a Request",
                desc: "Found your ideal home? Submit a rental request directly to the landlord.",
              },
              {
                icon: <CreditCard size={28} className="text-[var(--primary)]" />,
                title: "Pay & Move In",
                desc: "Once approved, pay securely via Stripe and get your keys.",
              },
            ].map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-[var(--border)]">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[var(--primary)] text-white rounded-2xl p-8 md:p-12 text-center">
          <Shield size={40} className="mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-3">Ready to find your next home?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join RentNest today. Browse verified listings, connect with landlords, and rent with confidence.
          </p>
          <Link href="/auth/register">
            <Button variant="secondary" size="lg">Get Started for Free</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
