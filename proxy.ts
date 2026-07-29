import { NextRequest, NextResponse } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  "/dashboard/tenant": ["TENANT"],
  "/dashboard/landlord": ["LANDLORD"],
  "/dashboard/admin": ["ADMIN"],
};

function parseJwt(token: string): { role?: string } | null {
  try {
    const base64 = token.split(".")[1];
    const json = Buffer.from(base64, "base64url").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedPrefix = "/dashboard";
  if (!pathname.startsWith(protectedPrefix)) return NextResponse.next();

  const token = req.cookies.get("rentnest_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  const payload = parseJwt(token);
  if (!payload || !payload.role) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  for (const [prefix, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix) && !roles.includes(payload.role)) {
      const url = req.nextUrl.clone();
      if (payload.role === "TENANT") url.pathname = "/dashboard/tenant";
      else if (payload.role === "LANDLORD") url.pathname = "/dashboard/landlord";
      else if (payload.role === "ADMIN") url.pathname = "/dashboard/admin";
      else url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
