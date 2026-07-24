-- Add sender info columns to payments table for public payment submissions

alter table public.payments
  add column if not exists sender_name text,
  add column if not exists sender_email text;

-- Update track_by_number RPC to include all required shipment fields
drop function if exists public.track_by_number(text) cascade;
create function public.track_by_number(p_tracking text)
returns table (
  id uuid,
  tracking_number text,
  service text,
  status text,
  origin_name text, origin_country text, origin_lat double precision, origin_lng double precision,
  destination_name text, destination_country text, destination_lat double precision, destination_lng double precision,
  current_lat double precision, current_lng double precision, current_location_label text,
  estimated_delivery timestamptz, actual_delivery timestamptz,
  sender_name text, sender_company text, sender_address text, sender_country text, sender_phone text,
  receiver_name text, receiver_company text, receiver_address text, receiver_country text, receiver_phone text, receiver_email text,
  weight_kg numeric, pieces integer, dimensions text,
  reference text, notes text,
  created_at timestamptz, updated_at timestamptz,
  total_fees numeric, outstanding numeric
)
language sql
security definer set search_path = public
as $$
  select
    s.id, s.tracking_number, s.service, s.status,
    s.origin_name, s.origin_country, s.origin_lat, s.origin_lng,
    s.destination_name, s.destination_country, s.destination_lat, s.destination_lng,
    s.current_lat, s.current_lng, s.current_location_label,
    s.estimated_delivery, s.actual_delivery,
    s.sender_name, s.sender_company, s.sender_address, s.sender_country, s.sender_phone,
    s.receiver_name, s.receiver_company, s.receiver_address, s.receiver_country, s.receiver_phone, s.receiver_email,
    s.weight_kg, s.pieces, s.dimensions,
    s.reference, s.notes,
    s.created_at, s.updated_at,
    coalesce((select sum(amount) from public.shipment_fees where shipment_id = s.id), 0)::numeric,
    coalesce((select sum(amount) from public.shipment_fees where shipment_id = s.id and status in ('unpaid','partially_paid')), 0)::numeric
  from public.shipments s
  where s.tracking_number = p_tracking
  limit 1;
$$;
