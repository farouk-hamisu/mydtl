-- ============================================================
-- Row-level security
-- ============================================================

alter table public.profiles           enable row level security;
alter table public.shipments          enable row level security;
alter table public.tracking_events    enable row level security;
alter table public.shipment_fees      enable row level security;
alter table public.payments           enable row level security;
alter table public.shipment_images    enable row level security;
alter table public.notifications      enable row level security;
alter table public.gallery_items      enable row level security;
alter table public.testimonials       enable row level security;
alter table public.services           enable row level security;
alter table public.brand_partners     enable row level security;
alter table public.contact_requests   enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.site_settings      enable row level security;

-- Helper: is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce(
    exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','manager','staff')),
    false
  );
$$;

-- ---------- profiles ----------
create policy "profiles read self or admin"  on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles update self or admin" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- ---------- shipments ----------
create policy "shipments select customer or admin" on public.shipments
  for select using (
    customer_id = auth.uid() or public.is_admin()
  );
create policy "shipments insert admin" on public.shipments
  for insert with check (public.is_admin());
create policy "shipments update admin" on public.shipments
  for update using (public.is_admin());
create policy "shipments delete admin" on public.shipments
  for delete using (public.is_admin());

-- Public can track by tracking number through a SECURITY DEFINER function (later).
-- For a public tracking endpoint that does not require auth, expose a function instead.

-- ---------- tracking_events ----------
create policy "events select customer or admin" on public.tracking_events
  for select using (
    exists (select 1 from public.shipments s where s.id = shipment_id
            and (s.customer_id = auth.uid() or public.is_admin()))
  );
create policy "events insert admin" on public.tracking_events
  for insert with check (public.is_admin());
create policy "events delete admin" on public.tracking_events
  for delete using (public.is_admin());

-- ---------- shipment_fees ----------
create policy "fees select customer or admin" on public.shipment_fees
  for select using (
    exists (select 1 from public.shipments s where s.id = shipment_id
            and (s.customer_id = auth.uid() or public.is_admin()))
  );
create policy "fees insert admin" on public.shipment_fees
  for insert with check (public.is_admin());
create policy "fees update admin" on public.shipment_fees
  for update using (public.is_admin());
create policy "fees delete admin" on public.shipment_fees
  for delete using (public.is_admin());

-- ---------- payments ----------
create policy "payments select customer or admin" on public.payments
  for select using (
    customer_id = auth.uid()
    or exists (select 1 from public.shipments s where s.id = shipment_id and s.customer_id = auth.uid())
    or public.is_admin()
  );
create policy "payments insert customer or admin" on public.payments
  for insert with check (
    customer_id = auth.uid() or public.is_admin()
  );
create policy "payments update admin" on public.payments
  for update using (public.is_admin());
create policy "payments delete admin" on public.payments
  for delete using (public.is_admin());

-- ---------- shipment_images ----------
create policy "images select customer or admin" on public.shipment_images
  for select using (
    exists (select 1 from public.shipments s where s.id = shipment_id
            and (s.customer_id = auth.uid() or public.is_admin()))
  );
create policy "images insert admin" on public.shipment_images
  for insert with check (public.is_admin());
create policy "images update admin" on public.shipment_images
  for update using (public.is_admin());
create policy "images delete admin" on public.shipment_images
  for delete using (public.is_admin());

-- ---------- notifications ----------
create policy "notifications select own" on public.notifications
  for select using (user_id = auth.uid() or public.is_admin());
create policy "notifications insert admin" on public.notifications
  for insert with check (public.is_admin());
create policy "notifications update own" on public.notifications
  for update using (user_id = auth.uid() or public.is_admin());
create policy "notifications delete own or admin" on public.notifications
  for delete using (user_id = auth.uid() or public.is_admin());

-- ---------- CMS (public read, admin write) ----------
create policy "gallery read" on public.gallery_items   for select using (true);
create policy "gallery write" on public.gallery_items  for all using (public.is_admin()) with check (public.is_admin());

create policy "testimonials read"  on public.testimonials for select using (true);
create policy "testimonials write" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

create policy "services read"  on public.services for select using (true);
create policy "services write" on public.services for all using (public.is_admin()) with check (public.is_admin());

create policy "partners read"  on public.brand_partners for select using (true);
create policy "partners write" on public.brand_partners for all using (public.is_admin()) with check (public.is_admin());

create policy "settings read"  on public.site_settings for select using (true);
create policy "settings write" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

-- ---------- contact_requests (public insert, admin read) ----------
create policy "contact insert" on public.contact_requests for insert with check (true);
create policy "contact read"   on public.contact_requests for select using (public.is_admin());
create policy "contact delete" on public.contact_requests for delete using (public.is_admin());

-- ---------- newsletter ----------
create policy "newsletter insert" on public.newsletter_subscribers for insert with check (true);
create policy "newsletter read"   on public.newsletter_subscribers for select using (public.is_admin());
create policy "newsletter delete" on public.newsletter_subscribers for delete using (public.is_admin());

-- ============================================================
-- SECURITY DEFINER RPC: public tracking lookup
-- Used by unauthenticated users that only know a tracking number.
-- ============================================================
create or replace function public.track_by_number(p_tracking text)
returns table (
  tracking_number text,
  service text,
  status text,
  origin_name text, origin_country text,
  destination_name text, destination_country text,
  current_lat double precision, current_lng double precision,
  current_location_label text,
  estimated_delivery timestamptz,
  actual_delivery timestamptz,
  sender_name text, receiver_name text,
  weight_kg numeric, pieces integer,
  total_fees numeric, outstanding numeric
)
language sql
security definer set search_path = public
as $$
  select
    s.tracking_number, s.service, s.status,
    s.origin_name, s.origin_country,
    s.destination_name, s.destination_country,
    s.current_lat, s.current_lng,
    s.current_location_label,
    s.estimated_delivery, s.actual_delivery,
    s.sender_name, s.receiver_name,
    s.weight_kg, s.pieces,
    coalesce((select sum(amount) from public.shipment_fees where shipment_id = s.id), 0)::numeric,
    coalesce((select sum(amount) from public.shipment_fees where shipment_id = s.id and status = 'unpaid'), 0)::numeric
  from public.shipments s
  where s.tracking_number = p_tracking
  limit 1;
$$;

create or replace function public.track_events_public(p_tracking text)
returns table (
  status text, location_label text, lat double precision, lng double precision, note text, occurred_at timestamptz
)
language sql
security definer set search_path = public
as $$
  select e.status, e.location_label, e.lat, e.lng, e.note, e.occurred_at
  from public.tracking_events e
  join public.shipments s on s.id = e.shipment_id
  where s.tracking_number = p_tracking
  order by e.occurred_at desc;
$$;

create or replace function public.track_images_public(p_tracking text)
returns table (
  url text, caption text, kind text, taken_at timestamptz
)
language sql
security definer set search_path = public
as $$
  select i.url, i.caption, i.kind, i.taken_at
  from public.shipment_images i
  join public.shipments s on s.id = i.shipment_id
  where s.tracking_number = p_tracking
  order by i.created_at asc;
$$;

create or replace function public.track_fees_public(p_tracking text)
returns table (
  id uuid, name text, description text, amount numeric, currency text,
  status text, due_date date, notes text
)
language sql
security definer set search_path = public
as $$
  select f.id, f.name, f.description, f.amount, f.currency, f.status, f.due_date, f.notes
  from public.shipment_fees f
  join public.shipments s on s.id = f.shipment_id
  where s.tracking_number = p_tracking;
$$;
