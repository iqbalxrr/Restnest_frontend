export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type PropertyStatus = "AVAILABLE" | "UNAVAILABLE" | "RENTED";
export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number | null;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  categoryId: string;
  landlordId: string;
  category: { id: string; name: string };
  landlord: { id: string; name: string; email: string; phone: string | null };
  _count?: { reviews: number };
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  tenant: { id: string; name: string };
  createdAt: string;
}

export interface RentalRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  message: string | null;
  status: RentalStatus;
  property?: Pick<Property, "id" | "title" | "location" | "price" | "images">;
  tenant?: Pick<User, "id" | "name" | "email" | "phone">;
  createdAt: string;
}

export interface Payment {
  id: string;
  rentalRequestId: string;
  userId: string;
  amount: number;
  method: string;
  provider: string;
  status: PaymentStatus;
  transactionId: string | null;
  paidAt: string | null;
  rentalRequest?: {
    id: string;
    status: RentalStatus;
    property: { id: string; title: string; location: string };
  };
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errorDetails?: unknown;
}

export interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalRentals: number;
  pendingRentals: number;
  activeRentals: number;
  completedRentals: number;
  totalRevenue: number;
}

export interface LandlordStats {
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  pendingRequests: number;
  approvedRequests: number;
}
