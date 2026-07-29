# RentNest Frontend 🏠

> **Find & List Rental Properties with Ease**

A modern, fully responsive Next.js 15 rental property marketplace frontend consuming the RentNest backend API.

## Live Links

| Resource | URL |
|---|---|
| Frontend | *Deploy to Vercel — set `NEXT_PUBLIC_API_URL`* |
| Backend API | *Your deployed backend URL* |
| API Docs | `http://localhost:5000/api-docs` |

## Admin Credentials

| Field | Value |
|---|---|
| Email | `admin@rentnest.com` |
| Password | `admin123` |

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Landlord | `landlord@rentnest.com` | `landlord123` |
| Tenant | `tenant@rentnest.com` | `tenant123` |

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | Framework, routing, Server/Client Components |
| TypeScript | Type safety |
| Tailwind CSS | Styling (custom design system) |
| TanStack Query | Server state, data fetching, caching |
| Zustand | Global auth state |
| React Hook Form + Zod | Form management & validation |
| Stripe.js + @stripe/react-stripe-js | Payment Elements integration |
| Sonner | Toast notifications |
| Lucide React | Icons |

## Project Structure

```
app/
├── auth/             # Login, Register
├── properties/       # Browse, [id] detail
├── dashboard/
│   ├── tenant/       # Requests, payments, reviews
│   ├── landlord/     # Property CRUD, request management
│   └── admin/        # Users, properties, rentals moderation
├── payment/          # success, cancel pages
middleware.ts         # JWT cookie-based route protection
lib/
├── api.ts            # Central fetch wrapper
├── types.ts          # Shared TypeScript types
├── utils.ts          # Helpers
hooks/                # TanStack Query hooks per module
store/                # Zustand auth store
components/
├── ui/               # Button, Input, Badge, Card, Modal, etc.
├── layout/           # Navbar, Footer, DashboardLayout
└── property/         # PropertyCard, PropertyForm
```

## Getting Started

### Prerequisites

- Node.js 18+
- RentNest Backend running at `http://localhost:5000`

### Setup

```bash
git clone <repo>
cd rentnest-frontend

npm install

# Copy env
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (no trailing slash) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...`) |

## Features

### Public
- Responsive property grid with skeleton loading
- Advanced filter/search (location, price, category, bedrooms)
- Property detail with image gallery, amenities, reviews, landlord info
- Graceful 404/500 error pages

### Tenant
- Registration with role selection, Zod-validated forms
- Submit rental requests (date range + message)
- Dashboard: request status tracking, payment history
- Stripe Elements payment flow
- Leave star reviews on active/completed rentals

### Landlord
- Property CRUD (create, edit, delete) with image URL upload
- Availability status toggles (AVAILABLE / UNAVAILABLE)
- Rental request management (approve/reject with optimistic UI)
- Overview stats and notifications

### Admin
- Platform health stats (users, properties, rentals, revenue)
- Paginated user management with ban/unban actions
- Content moderation: all properties and rental requests

## Payment Flow (Stripe)

1. Landlord approves tenant request
2. Tenant clicks **Pay Now** → `POST /api/payments/create` → backend creates PaymentIntent
3. Stripe Elements renders with `clientSecret`
4. Tenant enters test card `4242 4242 4242 4242` and submits
5. On success → `POST /api/payments/confirm` → rental becomes `ACTIVE`
6. Redirect to `/payment/success`

## API Integration

See [API_INTEGRATION.md](API_INTEGRATION.md) for complete frontend ↔ backend mapping.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint |

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import into Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = your backend URL
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your Stripe PK
4. Deploy
