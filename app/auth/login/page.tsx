"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useLogin } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Home } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[var(--secondary)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--primary)] font-bold text-2xl mb-4">
            <Home size={24} />
            RentNest
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Welcome back</h1>
          <p className="text-[var(--muted)] mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-8">
          <form onSubmit={handleSubmit((data) => login(data))} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" className="w-full" loading={isPending} size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-4 p-3 bg-[var(--secondary)] rounded-lg text-xs text-[var(--muted)] space-y-1">
            <p className="font-medium text-[var(--foreground)]">Demo accounts:</p>
            <p>Admin: <span className="font-mono">admin@rentnest.com</span> / <span className="font-mono">admin123</span></p>
            <p>Landlord: <span className="font-mono">landlord@rentnest.com</span> / <span className="font-mono">landlord123</span></p>
            <p>Tenant: <span className="font-mono">tenant@rentnest.com</span> / <span className="font-mono">tenant123</span></p>
          </div>

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[var(--primary)] font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
