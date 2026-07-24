-- ============================================================
-- SpeedFlightz — initial schema
-- Profiles (RBAC), shipments, tracking events, fees, payments,
-- notifications, content (gallery/testimonials/services), settings
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- 1. profiles ( RBAC ) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  company text,
  country text,
  address text,
  avatar_url text,
  role text not null default 'customer'
    check (role in ('customer','admin','manager','staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_email_idx on public.profiles(email);

-- ---------- 2. shipment_categories (optional taxonomy) ----------
create table if not exists public.shipment_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- ---------- 3. shipments ----------
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text not null unique,
  customer_id uuid references public.profiles(id) on delete set null,
  reference text,
  service text,                      -- Air Freight, Sea Freight, Express Courier, ...
  category_id uuid references public.shipment_categories(id) on delete set null,

  sender_name text,
  sender_company text,
  sender_address text,
  sender_country text,
  sender_phone text,

  receiver_name text,
  receiver_company text,
  receiver_address text,
  receiver_country text,
  receiver_phone text,
  receiver_email text,

  origin_name text,
  origin_country text,
  origin_lat double precision,
  origin_lng double precision,

  destination_name text,
  destination_country text,
  destination_lat double precision,
  destination_lng double precision,

  current_lat double precision,
  current_lng double precision,
  current_location_label text,

  weight_kg numeric(12,3),
  pieces integer default 1,
  dimensions text,

  status text not null default 'created'
    check (status in (
      'created','picked_up','in_transit','out_for_delivery','delivered',
      'awaiting_customs_clearance','awaiting_payment','customs_hold',
      'payment_verification','cancelled','on_hold','returned'
    )),
  estimated_delivery timestamptz,
  actual_delivery timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shipments_customer_idx          on public.shipments(customer_id);
create index if not exists shipments_status_idx              on public.shipments(status);
create index if not exists shipments_tracking_idx           on public.shipments(tracking_number);
create index if not exists shipments_created_idx            on public.shipments(created_at desc);

-- ---------- 4. tracking_events ----------
create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  status text not null,
  location_label text,
  lat double precision,
  lng double precision,
  note text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);

create index if not exists tracking_events_shipment_idx on public.tracking_events(shipment_id, occurred_at desc);

-- ---------- 5. shipments fees ----------
create table if not exists public.shipment_fees (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  name text not null,
  description text,
  amount numeric(14,2) not null default 0,
  currency text not null default 'USD',
  status text not null default 'unpaid'
    check (status in ('paid','unpaid','partially_paid','waived')),
  due_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);

create index if not exists shipment_fees_shipment_idx on public.shipment_fees(shipment_id);
create index if not exists shipment_fees_status_idx   on public.shipment_fees(status);

-- ---------- 6. payments ----------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid references public.shipments(id) on delete cascade,
  fee_id uuid references public.shipment_fees(id) on delete set null,
  customer_id uuid references public.profiles(id) on delete set null,
  amount numeric(14,2) not null default 0,
  currency text not null default 'USD',
  method text not null default 'usdt_trc20'
    check (method in ('usdt_trc20','ach', 'wire','other')),
  reference text,
  notes text,
  receipt_url text,
  status text not null default 'pending'
    check (status in ('pending','verified','rejected')),
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_shipment_idx on public.payments(shipment_id);
create index if not exists payments_status_idx   on public.payments(status);

-- ---------- 7. shipment_images ----------
create table if not exists public.shipment_images (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  url text not null,
  caption text,
  kind text not null default 'progress'
    check (kind in ('progress','pickup','delivery','damage','document','warehouse','port')),
  taken_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists shipment_images_shipment_idx on public.shipment_images(shipment_id);

-- ---------- 8. notifications ----------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  link text,
  kind text not null default 'general',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

-- ---------- 9. CMS-ish content ----------
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  url text not null,
  category text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  role text,
  company text,
  avatar_url text,
  quote text not null,
  rating int default 5,
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  image_url text,
  category_label text,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists public.brand_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id int primary key default 1,
  site_name text not null default 'SpeedFlightz',
  tagline text,
  hero_headline text,
  hero_subheadline text,
  hero_bullets text,
  contact_email text,
  contact_phone text,
  contact_address text,
  business_hours text,
  social_facebook text,
  social_twitter text,
  social_linkedin text,
  social_instagram text,
  social_youtube text,
  usdt_trc20_address text,
  ach_account_holder text,
  ach_bank text,
  ach_account_number text,
  ach_routing_number text,
  ach_account_type text,
  ach_bank_address text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------- 10. contact_requests (request quote / contact form) ----------
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text,
  kind text default 'general',
  created_at timestamptz not null default now()
);
create index if not exists contact_requests_created_idx on public.contact_requests(created_at desc);

-- ---------- 11. newsletter_subscribers ----------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);
