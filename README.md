# SpeedFlightz — Premium International Shipping & Logistics Platform

A premium logistics platform with real-time shipment tracking, live interactive maps, customs duty management, and a full admin dashboard.

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS + TanStack Router + Framer Motion + Leaflet
- **Backend:** Node.js + Express.js
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Authentication
- **Storage:** Supabase Storage

## Getting Started

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project. Copy the **Project URL** and **anon key** from Project Settings → API.

### 2. Run the database migrations

In your Supabase dashboard → SQL editor, run the migration files in order:

```
supabase/migrations/0000_init.sql
supabase/migrations/0001_triggers_functions.sql
supabase/migrations/0002_views.sql
supabase/migrations/0003_rls.sql
supabase/migrations/0004_storage.sql
supabase/migrations/0005_seed.sql
```

Or using the Supabase CLI:

```bash
supabase db push
```

### 3. Environment variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install & run

```bash
# Install all dependencies
npm install

# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:web   # Frontend on :5173
npm run dev:api   # Backend on :8787
```

### 5. First admin user

1. Sign up through the app at `/register`
2. In your Supabase dashboard, edit the user's `profiles.role` to `admin`
3. Or use the API (once auth is configured): `POST /api/auth/promote-admin { "email": "admin@example.com" }`

## Features

### Public
- Track shipments by tracking number (no auth required)
- Live interactive map with origin, destination and current position
- Timeline of tracking events
- Shipment images
- Fee/outstanding balance display
- Landing page with premium design
- Contact & quote request form

### Customer Dashboard
- View all shipments
- Track individual shipments with live map
- Pay outstanding fees (USDT / ACH)
- Upload payment receipts
- Receive notifications
- Manage profile

### Admin Dashboard
- **Overview:** Analytics (shipment counts, revenue, outstanding fees, status breakdown)
- **Shipments:** Full CRUD, tracking events, fees, images, customer notification
- **Customers:** User management with role assignment
- **Payments:** View, verify, or reject payment proofs
- **Content:** Manage services, testimonials, gallery, brand partners
- **Settings:** Site-wide configuration (contact info, social, SEO, payment details)

### Payment
- **USDT (TRC20):** `TXMjZ7MrfUMTFMQ96AwRTJTdsR3NmaL41u`
- **ACH / Wire:** SpeedFlightz, Lead Bank, Account 214144811917, Routing 101019644
- Upload receipt with transaction reference
- Admin verification workflow

## Project Structure

```
speedflightz/
├── app/                    # React frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── sections/       # Homepage sections
│       ├── pages/          # Route pages
│       ├── hooks/          # Auth + site settings hooks
│       └── lib/            # API client, types, utils, motion, router
├── server/                 # Express API server
│   └── src/
│       ├── routes/         # API route handlers
│       ├── middleware/     # Auth middleware
│       └── lib/            # Supabase admin client
└── supabase/
    └── migrations/         # SQL migrations
```
# speedflightz
