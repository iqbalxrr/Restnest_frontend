import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CreditCard,
  Home,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-[#08271d] text-white">
      <div className="absolute -right-28 -top-32 h-80 w-80 rounded-full border-[70px] border-white/[0.025]" />
      <div className="absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-amber-300/[0.04] blur-3xl" />

      {/* Trust ribbon */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {[
            {
              icon: ShieldCheck,
              title: "Verified listings",
              text: "Homes reviewed for confidence",
            },
            {
              icon: CreditCard,
              title: "Secure payments",
              text: "Protected by Stripe",
            },
            {
              icon: CheckCircle2,
              title: "Simple renting",
              text: "From search to keys, online",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 py-5 sm:px-6 first:pl-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-[#e7c66d]">
                <Icon size={19} />
              </span>
              <span>
                <span className="block text-sm font-semibold">{title}</span>
                <span className="mt-0.5 block text-xs text-white/45">{text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_.7fr_.7fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="mb-5 inline-flex items-center gap-2.5 text-2xl font-bold">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e7c66d] text-[#08271d] shadow-lg shadow-black/10">
                <Home size={20} />
              </span>
              RentNest
            </Link>
            <p className="text-sm leading-6 text-white/55">
              A modern rental marketplace connecting trusted landlords with
              tenants looking for a place to call home across Bangladesh.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/55">
              <a
                href="mailto:hello@rentnest.com"
                className="flex w-fit items-center gap-2.5 transition-colors hover:text-white"
              >
                <Mail size={15} className="text-[#e7c66d]" />
                hello@rentnest.com
              </a>
              <span className="flex items-center gap-2.5">
                <MapPin size={15} className="text-[#e7c66d]" />
                Dhaka, Bangladesh
              </span>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
              Explore
            </h4>
            <ul className="space-y-3.5 text-sm text-white/50">
              <li><FooterLink href="/">Home</FooterLink></li>
              <li><FooterLink href="/properties">Browse homes</FooterLink></li>
              <li><FooterLink href="/auth/register">List a property</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
              Account
            </h4>
            <ul className="space-y-3.5 text-sm text-white/50">
              <li><FooterLink href="/auth/login">Sign in</FooterLink></li>
              <li><FooterLink href="/auth/register">Create account</FooterLink></li>
              <li><FooterLink href="/dashboard/tenant">Tenant dashboard</FooterLink></li>
              <li><FooterLink href="/dashboard/landlord">Landlord dashboard</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
              Find your next home
            </h4>
            <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-sm">
              <Building2 size={24} className="text-[#e7c66d]" />
              <p className="mt-4 text-sm font-semibold leading-5">
                Fresh rental homes are waiting for you.
              </p>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Search by location, budget, and property type.
              </p>
              <Link
                href="/properties"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#e7c66d] transition-colors hover:text-[#f5dc99]"
              >
                Explore properties <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RentNest. All rights reserved.</p>
          <div className="flex gap-5">
            <span>Privacy-first marketplace</span>
            <span>Built with care in Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 transition-all hover:translate-x-1 hover:text-white"
    >
      {children}
    </Link>
  );
}
