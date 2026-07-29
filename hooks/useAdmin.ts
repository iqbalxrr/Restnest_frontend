import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User, Property, RentalRequest, DashboardStats, PaginationMeta } from "@/lib/types";
import { toast } from "sonner";

interface UsersResult {
  users: User[];
  meta: PaginationMeta;
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get<DashboardStats>("/admin/dashboard"),
  });
}

export function useAdminUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["admin-users", page, limit],
    queryFn: () => api.get<UsersResult>(`/admin/users?page=${page}&limit=${limit}`),
  });
}

export function useAdminProperties() {
  return useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => api.get<{ properties: Property[]; meta: PaginationMeta }>("/admin/properties"),
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ["admin-rentals"],
    queryFn: () => api.get<{ rentalRequests?: RentalRequest[]; requests?: RentalRequest[]; meta?: PaginationMeta }>("/admin/rentals"),
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "BANNED" }) =>
      api.patch<User>(`/admin/users/${id}`, { status }),
    onSuccess: (_, { status }) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(`User ${status === "BANNED" ? "banned" : "unbanned"} successfully.`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
