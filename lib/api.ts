import { ApiResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://assginment-04.vercel.app";

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)rentnest_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setTokenCookie(token: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `rentnest_token=${encodeURIComponent(token)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function clearTokenCookie() {
  document.cookie = "rentnest_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

class ApiError extends Error {
  status: number;
  errorDetails?: unknown;
  constructor(message: string, status: number, errorDetails?: unknown) {
    super(message);
    this.status = status;
    this.errorDetails = errorDetails;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/api${path}`, { ...options, headers });
  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new ApiError(json.message || "Request failed", res.status, json.errorDetails);
  }
  return json.data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export { ApiError };
