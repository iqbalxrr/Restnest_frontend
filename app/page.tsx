"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useProperties, useCategories } from "@/hooks/useProperties";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  Headphones,
  KeyRound,
  MapPin,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { data, isLoading } = useProperties({ limit: 6 });
  const { data: categories } = useCategories();
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (categoryId) params.set("categoryId", categoryId);
    router.push(`/properties${params.size ? `?${params}` : ""}`);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative isolate min-h-[680px] overflow-hidden bg-[#0a2c20] text-white lg:min-h-[760px]">
        <video
          className="hero-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=75"
          aria-hidden="true"
        >
          <source
            src="https://videos.pexels.com/video-files/7578554/7578554-hd_1280_720_30fps.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,25,17,.95)_0%,rgba(4,30,20,.78)_48%,rgba(4,30,20,.3)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(4,25,17,.75)_0%,transparent_50%)]" />
        <div className="hero-glow absolute -left-32 top-16 h-80 w-80 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="hero-glow hero-glow-delayed absolute right-10 top-24 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-4 pb-44 pt-20 sm:px-6 lg:min-h-[760px] lg:px-8 lg:pb-48">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-md">
              <Sparkles size={14} className="text-amber-300" />
              Bangladesh&apos;s smarter rental marketplace
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
              A better way to find
              <span className="block text-[#f0cc74]">a place to belong.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Discover verified homes, connect directly with trusted landlords,
              and complete your rental securely—all from one beautiful platform.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/properties">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full rounded-full bg-white px-7 shadow-xl shadow-black/10 hover:bg-[#f4efe3] sm:w-auto"
                >
                  Explore homes <ArrowRight size={17} />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full border-white/45 bg-white/5 px-7 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-[var(--primary)] sm:w-auto"
                >
                  List a property
                </Button>
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-medium text-white/70">
              {["Verified listings", "Secure payments", "Direct landlord contact"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-300" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Floating property search */}
        <div className="absolute inset-x-0 bottom-6 z-10 px-4 sm:bottom-8 sm:px-6 lg:bottom-10 lg:px-8">
          <form
            onSubmit={handleSearch}
            className="mx-auto grid max-w-5xl gap-3 rounded-2xl border border-white/25 bg-white/95 p-3 text-[var(--foreground)] shadow-2xl shadow-black/20 backdrop-blur-xl sm:grid-cols-[1.25fr_1fr_auto] sm:rounded-3xl sm:p-4"
          >
            <label className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors focus-within:bg-[var(--secondary)]">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-[var(--primary)]">
                <MapPin size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Location
                </span>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-gray-400"
                  placeholder="Gulshan, Banani, Uttara..."
                />
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border-t border-[var(--border)] px-3 py-2 transition-colors focus-within:bg-[var(--secondary)] sm:border-l sm:border-t-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-700">
                <Building2 size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Property type
                </span>
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold outline-none"
                >
                  <option value="">All property types</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <Button
              type="submit"
              size="lg"
              className="h-full min-h-14 rounded-xl px-7 shadow-lg shadow-emerald-900/15 sm:rounded-2xl"
            >
              <Search size={18} />
              Search homes
            </Button>
          </form>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-[var(--border)]">
            {[
              { label: "Homes available", value: `${data?.meta?.total ?? "—"}+` },
              { label: "Property types", value: `${categories?.length ?? "—"}` },
              { label: "Payment security", value: "100%" },
            ].map((s) => (
              <div key={s.label} className="px-2 text-center sm:px-4">
                <div className="text-xl font-bold tracking-tight text-[var(--primary)] sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[10px] text-[var(--muted)] sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                Find your fit
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Browse by property type</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
              From compact studios to family villas, explore homes made for every
              chapter of life.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/properties?categoryId=${cat.id}`}
                className="group rounded-2xl border border-[var(--border)] bg-white p-4 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-emerald-900/5 sm:p-5"
              >
                <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-[var(--secondary)] text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                  <Building2 size={20} />
                </span>
                <span className="flex items-center justify-between gap-2 font-semibold">
                  {cat.name}
                  <ArrowRight
                    size={15}
                    className="text-[var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary)]"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured properties */}
      <section className="bg-[#f3f0e8] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              Handpicked for you
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Fresh homes on RentNest</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Explore our latest available rentals.</p>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="hidden rounded-full sm:inline-flex">
              View all homes <ArrowRight size={15} />
            </Button>
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
        <Link href="/properties" className="mt-8 block sm:hidden">
          <Button variant="outline" className="w-full rounded-full">
            View all homes <ArrowRight size={15} />
          </Button>
        </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              Simple from search to keys
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Your next home in three easy steps
            </h2>
          </div>
          <div className="relative grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="absolute left-[17%] right-[17%] top-12 hidden border-t border-dashed border-[var(--primary)]/25 md:block" />
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
              <div
                key={step.title}
                className="relative flex flex-col items-center rounded-3xl border border-transparent p-7 text-center transition-colors hover:border-[var(--border)] hover:bg-[var(--secondary)]/60"
              >
                <div className="z-10 mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-6 text-[var(--muted)]">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-4 rounded-3xl bg-[#0d3527] p-6 text-white sm:grid-cols-3 sm:p-8">
            {[
              { icon: Shield, label: "Verified listings", text: "Quality homes you can trust" },
              { icon: CreditCard, label: "Stripe secured", text: "Protected online payments" },
              { icon: Headphones, label: "Human support", text: "Help whenever you need it" },
            ].map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-[#f0cc74]">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="mt-0.5 block text-xs text-white/55">{text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--primary)] p-8 text-white shadow-2xl shadow-emerald-950/15 sm:p-12 lg:p-16">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[50px] border-white/5" />
          <div className="absolute -bottom-28 right-1/3 h-60 w-60 rounded-full bg-[#f0cc74]/10 blur-2xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f0cc74]">
                <KeyRound size={24} />
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your next chapter starts at the right address.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-white/70">
                Join RentNest today. Browse verified listings, connect with landlords,
                and rent with complete confidence.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/auth/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full rounded-full bg-white px-8 hover:bg-[#f4efe3]"
                >
                  Get started free <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/properties">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full border-white/35 text-white hover:bg-white hover:text-[var(--primary)]"
                >
                  Browse homes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
