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
  Clock3,
  CreditCard,
  Headphones,
  HeartHandshake,
  Home,
  KeyRound,
  MapPin,
  Quote,
  Search,
  Shield,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

const CITIES = [
  {
    name: "Gulshan",
    homes: "Premium apartments",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=70",
  },
  {
    name: "Banani",
    homes: "Studios & flats",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=70",
  },
  {
    name: "Dhanmondi",
    homes: "Family houses",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=70",
  },
  {
    name: "Uttara",
    homes: "Quiet condos",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=70",
  },
];

const TESTIMONIALS = [
  {
    name: "Nusrat Ahmed",
    role: "Tenant · Banani",
    quote:
      "I found a clean studio, got approved in two days, and paid online without chasing anyone. RentNest made moving feel easy.",
    rating: 5,
  },
  {
    name: "Rafiq Hassan",
    role: "Landlord · Gulshan",
    quote:
      "Listing my flat took minutes. Requests came with clear details, and I could approve tenants from one dashboard.",
    rating: 5,
  },
  {
    name: "Mahiya Chowdhury",
    role: "Tenant · Dhanmondi",
    quote:
      "Filters actually work. I narrowed by budget and bedrooms, requested a home, and the landlord responded fast.",
    rating: 4,
  },
];

const FAQS = [
  {
    q: "Do I need an account to browse homes?",
    a: "No. Anyone can browse and filter listings. You only need an account to submit a rental request or list a property.",
  },
  {
    q: "How does payment work?",
    a: "After a landlord approves your request, you pay securely with Stripe. Fake cash-on-delivery options are not used.",
  },
  {
    q: "Can landlords manage everything online?",
    a: "Yes. Landlords can create, edit, and remove listings, then approve or reject incoming rental requests from their dashboard.",
  },
  {
    q: "Is RentNest available outside Dhaka?",
    a: "The marketplace is designed for Bangladesh rentals, with Dhaka neighborhoods featured first and room to grow across cities.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { data, isLoading } = useProperties({ limit: 6 });
  const { data: categories } = useCategories();
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

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

      {/* Stats */}
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-[var(--border)]">
            {[
              { label: "Homes available", value: `${data?.meta?.total ?? "—"}+`, icon: Home },
              { label: "Property types", value: `${categories?.length ?? "—"}`, icon: Building2 },
              { label: "Secure checkout", value: "Stripe", icon: CreditCard },
              { label: "Avg. response", value: "Fast", icon: Clock3 },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-[var(--secondary)]/60 px-3 py-4 text-center sm:rounded-none sm:bg-transparent sm:px-4">
                <s.icon size={18} className="mx-auto mb-2 text-[var(--primary)] opacity-80" />
                <div className="text-xl font-bold tracking-tight text-[var(--primary)] sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[10px] text-[var(--muted)] sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular cities */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              Explore neighborhoods
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Popular places to rent
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
            Jump straight into Dhaka&apos;s most requested areas and start browsing homes that match your lifestyle.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CITIES.map((city) => (
            <Link
              key={city.name}
              href={`/properties?location=${encodeURIComponent(city.name)}`}
              className="group relative h-64 overflow-hidden rounded-3xl shadow-lg shadow-emerald-950/10"
            >
              <SafeImage
                src={city.image}
                alt={city.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width:1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-xl font-bold">{city.name}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-white/70">
                  {city.homes}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="border-y border-[var(--border)] bg-[#f3f0e8]/70 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                  Find your fit
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">Browse by property type</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
                From compact studios to family villas, explore homes made for every chapter of life.
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
          </div>
        </section>
      )}

      {/* Featured properties */}
      <section className="py-16 sm:py-20">
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.properties?.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[var(--muted)]">No properties available yet.</div>
          )}
          <Link href="/properties" className="mt-8 block sm:hidden">
            <Button variant="outline" className="w-full rounded-full">
              View all homes <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why RentNest */}
      <section className="bg-[#0d3527] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f0cc74]">
              Why choose RentNest
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Renting should feel modern, clear, and fair
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "Verified homes",
                text: "Browse listings with clear details, amenities, and landlord information.",
              },
              {
                icon: HeartHandshake,
                title: "Direct connection",
                text: "Talk to landlords through structured rental requests—no endless middlemen.",
              },
              {
                icon: Wallet,
                title: "Secure Stripe pay",
                text: "Pay only after approval with a real payment gateway and success tracking.",
              },
              {
                icon: Users,
                title: "Role-based dashboards",
                text: "Tenants, landlords, and admins each get tools built for their journey.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:bg-white/[0.07]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f0cc74]/15 text-[#f0cc74]">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            ].map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center rounded-3xl border border-transparent p-7 text-center transition-colors hover:border-[var(--border)] hover:bg-[var(--secondary)]/60"
              >
                <span className="absolute left-5 top-5 grid h-7 w-7 place-items-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div className="z-10 mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-6 text-[var(--muted)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landlord split CTA */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-xl shadow-emerald-950/5 lg:grid-cols-2">
          <div className="relative min-h-72 lg:min-h-full">
            <SafeImage
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=75"
              alt="Landlord listing a home"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d3527]/70 to-transparent lg:bg-gradient-to-r" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              For landlords
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              List once. Manage requests with ease.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
              Create polished listings, review tenant requests, approve the right match,
              and keep every rental conversation organized in one dashboard.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[var(--foreground)]">
              {[
                "Photo-ready property forms",
                "Approve or reject requests instantly",
                "Track availability in one place",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[var(--primary)]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full px-7">
                  Start listing <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f3f0e8] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              Loved by renters & owners
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Stories from the RentNest community
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <article
                key={item.name}
                className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm"
              >
                <Quote size={22} className="text-[var(--primary)]/30" />
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < item.rating ? "currentColor" : "none"}
                      className={i < item.rating ? "text-amber-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                FAQ
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Answers before you move in
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                Quick answers about browsing, requests, payments, and landlord tools.
              </p>
              <div className="mt-8 hidden rounded-3xl bg-[#0d3527] p-6 text-white lg:block">
                <Headphones size={22} className="text-[#f0cc74]" />
                <p className="mt-4 font-semibold">Still have questions?</p>
                <p className="mt-2 text-sm text-white/55">
                  Create an account and explore role-based dashboards built for tenants and landlords.
                </p>
                <Link href="/auth/register" className="mt-5 inline-flex">
                  <Button variant="secondary" className="rounded-full bg-white hover:bg-[#f4efe3]">
                    Join RentNest
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <button
                    key={faq.q}
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    className="w-full rounded-2xl border border-[var(--border)] bg-white p-5 text-left transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold leading-6">{faq.q}</h3>
                      <span className="mt-0.5 text-xl leading-none text-[var(--primary)]">
                        {open ? "−" : "+"}
                      </span>
                    </div>
                    {open && (
                      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{faq.a}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
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
