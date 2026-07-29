import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Property, Category, PaginationMeta } from "@/lib/types";
import { toast } from "sonner";

interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  bedrooms?: number;
  search?: string;
  page?: number;
  limit?: number;
}

interface PropertiesResult {
  properties: Property[];
  meta: PaginationMeta;
}

export function useProperties(filters: PropertyFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) params.set(k, String(v));
  });
  const query = params.toString();

  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => api.get<PropertiesResult>(`/properties${query ? `?${query}` : ""}`),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => api.get<Property>(`/properties/${id}`),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories"),
    staleTime: Infinity,
  });
}

// Landlord hooks
export function useLandlordProperties() {
  return useQuery({
    queryKey: ["landlord-properties"],
    queryFn: () => api.get<Property[]>("/landlord/properties"),
  });
}

interface CreatePropertyData {
  title: string;
  description: string;
  location: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  amenities: string[];
  images: string[];
  categoryId: string;
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePropertyData) => api.post<Property>("/landlord/properties", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["landlord-properties"] });
      toast.success("Property created successfully!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreatePropertyData> & { status?: string }) =>
      api.put<Property>(`/landlord/properties/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["landlord-properties"] });
      qc.invalidateQueries({ queryKey: ["property", id] });
      toast.success("Property updated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/landlord/properties/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["landlord-properties"] });
      toast.success("Property deleted.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
