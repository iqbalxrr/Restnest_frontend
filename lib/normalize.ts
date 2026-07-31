import { Property, RentalRequest } from "@/lib/types";

/** Backend may return a bare array or wrap lists under rentals / rentalRequests / requests. */
export function normalizeRentals(data: unknown): RentalRequest[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as RentalRequest[];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.rentals)) return d.rentals as RentalRequest[];
  if (Array.isArray(d.rentalRequests)) return d.rentalRequests as RentalRequest[];
  if (Array.isArray(d.requests)) return d.requests as RentalRequest[];
  return [];
}

/** Backend may return a bare array or wrap under properties. */
export function normalizeProperties(data: unknown): Property[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Property[];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.properties)) return d.properties as Property[];
  return [];
}
