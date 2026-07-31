# API Integration Map

> RentNest Frontend → RentNest Backend API

**Backend Base URL:** `NEXT_PUBLIC_API_URL` (default: `https://assginment-04.vercel.app`)

All endpoints are prefixed with `/api`.

---

## Authentication

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `app/auth/login/page.tsx` | POST | `/auth/login` | Submit login form → receive JWT token |
| `app/auth/register/page.tsx` | POST | `/auth/register` | Submit registration form (role: TENANT/LANDLORD) |
| `components/layout/Navbar.tsx` | GET | `/auth/me` | Fetch current user profile on mount |

**Hook:** `hooks/useAuth.ts`

JWT is stored in cookie `rentnest_token` and read by:
1. `lib/api.ts` — attaches as `Authorization: Bearer <token>` header
2. `middleware.ts` — reads cookie on server to guard `/dashboard/*` routes

---

## Properties (Public)

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `app/page.tsx` | GET | `/properties?limit=6` | Featured properties on home page |
| `app/properties/page.tsx` | GET | `/properties?{filters}` | Browse with search, location, price, category, bedrooms, page |
| `app/properties/[id]/page.tsx` | GET | `/properties/:id` | Full property detail + landlord info + reviews |
| Any page | GET | `/categories` | Property categories for filter/dropdown |

**Hook:** `hooks/useProperties.ts`

Query parameters: `search`, `location`, `minPrice`, `maxPrice`, `categoryId`, `bedrooms`, `page`, `limit`.

---

## Rentals (Tenant)

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `app/properties/[id]/page.tsx` → Modal | POST | `/rentals` | Submit rental request with startDate, endDate, message |
| `app/dashboard/tenant/requests/page.tsx` | GET | `/rentals` | Tenant's own rental requests |
| `app/dashboard/tenant/page.tsx` | GET | `/rentals` | Overview stats |
| `app/dashboard/tenant/requests/[id]/pay/page.tsx` | GET | `/rentals/:id` | Fetch single rental to verify status before payment |

**Hook:** `hooks/useRentals.ts`

---

## Payments (Stripe)

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `app/dashboard/tenant/requests/[id]/pay/page.tsx` | POST | `/payments/create` | Create Stripe PaymentIntent → receive `clientSecret` |
| `app/dashboard/tenant/requests/[id]/pay/page.tsx` | POST | `/payments/confirm` | Confirm completed payment after Stripe `confirmPayment` succeeds |
| `app/dashboard/tenant/payments/page.tsx` | GET | `/payments` | Tenant's payment history |

**Hook:** `hooks/usePayments.ts`

**Stripe Flow:**
1. Page mounts → `POST /payments/create` → backend creates PaymentIntent → returns `clientSecret`
2. Stripe Elements `confirmPayment()` → card charged
3. On success → `POST /payments/confirm` with `{ paymentId, transactionId }` → rental status becomes `ACTIVE`
4. Redirect to `/payment/success`

Test card: `4242 4242 4242 4242` | any future MM/YY | any CVC

---

## Reviews

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `app/properties/[id]/page.tsx` | GET | `/reviews/property/:propertyId` | Display reviews on detail page |
| `app/dashboard/tenant/reviews/page.tsx` | POST | `/reviews` | Submit review for active/completed rental |

**Hook:** `hooks/useReviews.ts`

---

## Landlord

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `app/dashboard/landlord/page.tsx` | GET | `/landlord/properties` | Overview stats + property list |
| `app/dashboard/landlord/properties/page.tsx` | GET | `/landlord/properties` | Full property list with edit/delete |
| `app/dashboard/landlord/properties/new/page.tsx` | POST | `/landlord/properties` | Create new property listing |
| `app/dashboard/landlord/properties/[id]/edit/page.tsx` | GET | `/properties/:id` | Load property for editing |
| `app/dashboard/landlord/properties/[id]/edit/page.tsx` | PUT | `/landlord/properties/:id` | Update property details/status |
| Any delete action | DELETE | `/landlord/properties/:id` | Delete property listing |
| `app/dashboard/landlord/requests/page.tsx` | GET | `/landlord/requests` | All incoming rental requests |
| `app/dashboard/landlord/requests/page.tsx` | PATCH | `/landlord/requests/:id` | Approve or reject request (optimistic update) |

**Hook:** `hooks/useProperties.ts`, `hooks/useRentals.ts`

---

## Admin

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `app/dashboard/admin/page.tsx` | GET | `/admin/dashboard` | Platform stats (users, properties, rentals, revenue) |
| `app/dashboard/admin/users/page.tsx` | GET | `/admin/users?page=1&limit=10` | Paginated user list |
| `app/dashboard/admin/users/page.tsx` | PATCH | `/admin/users/:id` | Ban/Unban user |
| `app/dashboard/admin/properties/page.tsx` | GET | `/admin/properties` | All properties across platform |
| `app/dashboard/admin/rentals/page.tsx` | GET | `/admin/rentals` | All rental requests across platform |

**Hook:** `hooks/useAdmin.ts`

---

## Error Handling

All API errors (`{ success: false, message, errorDetails }`) are caught in `lib/api.ts` and thrown as `ApiError`. TanStack Query `onError` callbacks call `toast.error(err.message)` to show user-friendly notifications via `sonner`.

Form validation errors are shown inline via React Hook Form + Zod resolvers. Global unhandled errors are caught by `app/error.tsx`.

---

## Middleware Auth

`middleware.ts` runs on `/dashboard/*` routes:
- No cookie → redirect to `/auth/login?redirect=<path>`
- Wrong role → redirect to correct dashboard
- Valid token + correct role → allow through
