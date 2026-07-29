"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: "TENANT" | "LANDLORD";
}

interface AuthResult {
  user: User;
  token: string;
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => api.post<AuthResult>("/auth/login", data),
    onSuccess: (result, _variables) => {
      setAuth(result.user, result.token);
      queryClient.clear();
      toast.success(`Welcome back, ${result.user.name}!`);
      if (result.user.role === "ADMIN") router.push("/dashboard/admin");
      else if (result.user.role === "LANDLORD") router.push("/dashboard/landlord");
      else router.push("/dashboard/tenant");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Login failed");
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) => api.post<AuthResult>("/auth/register", data),
    onSuccess: (result) => {
      setAuth(result.user, result.token);
      toast.success("Account created successfully!");
      if (result.user.role === "LANDLORD") router.push("/dashboard/landlord");
      else router.push("/dashboard/tenant");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Registration failed");
    },
  });
}

export function useMe() {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<User>("/auth/me"),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}
