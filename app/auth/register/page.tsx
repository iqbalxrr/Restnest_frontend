"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRegister } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { Home } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["TENANT", "LANDLORD"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();

  const {
    register: rhf,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const role = watch("role");

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[var(--secondary)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--primary)] font-bold text-2xl mb-4">
            <Home size={24} />
            RentNest
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Create an account</h1>
          <p className="text-[var(--muted)] mt-2">Join thousands of landlords and tenants</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-8">
          {/* Role picker */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["TENANT", "LANDLORD"] as const).map((r) => (
              <label
                key={r}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  role === r
                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
              >
                <input type="radio" value={r} {...rhf("role")} className="sr-only" />
                <span className="text-2xl">{r === "TENANT" ? "🏠" : "🏗️"}</span>
                <span className="text-sm font-medium">{r === "TENANT" ? "I'm a Tenant" : "I'm a Landlord"}</span>
                <span className="text-xs text-[var(--muted)] text-center">
                  {r === "TENANT" ? "Browse & rent properties" : "List & manage properties"}
                </span>
              </label>
            ))}
          </div>
          {errors.role && <p className="text-xs text-red-500 mb-4">{errors.role.message}</p>}

          <form noValidate onSubmit={handleSubmit((data) => register(data))} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              required
              error={errors.name?.message}
              {...rhf("name")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              error={errors.email?.message}
              {...rhf("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              required
              error={errors.password?.message}
              {...rhf("password")}
            />
            <Input
              label="Phone (optional)"
              type="tel"
              placeholder="+880..."
              error={errors.phone?.message}
              {...rhf("phone")}
            />
            <Button type="submit" className="w-full" loading={isPending} size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[var(--primary)] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
