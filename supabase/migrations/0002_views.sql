-- ============================================================
-- Views
-- ============================================================

create or replace view public.shipment_summary as
select
  s.id,
  s.tracking_number,
  s.customer_id,
  s.service,
  s.status,
  s.origin_country,
  s.destination_country,
  s.current_lat,
  s.current_lng,
  s.current_location_label,
  s.estimated_delivery,
  s.actual_delivery,
  s.created_at,
  coalesce(fee_total.total_fees, 0)         as total_fees,
  coalesce(fee_total.outstanding, 0)       as outstanding,
  coalesce(fee_total.paid, 0)              as fees_paid,
  img.preview_image,
  evt.last_event_at,
  evt.last_status,
  evt.last_location
from public.shipments s
left join lateral (
  select
    sum(amount) as total_fees,
    sum(amount) filter (where status = 'unpaid') as outstanding,
    sum(amount) filter (where status = 'paid')    as paid
  from public.shipment_fees
  where shipment_id = s.id
) fee_total on true
left join lateral (
  select url as preview_image
  from public.shipment_images
  where shipment_id = s.id
  order by created_at asc
  limit 1
) img on true
left join lateral (
  select occurred_at as last_event_at, status as last_status, location_label as last_location
  from public.tracking_events
  where shipment_id = s.id
  order by occurred_at desc
  limit 1
) evt on true;

-- Customer-facing shipments with debt visibility
create or replace view public.customer_shipment_view as
select
  ss.*,
  p.full_name as customer_name,
  p.email     as customer_email
from public.shipment_summary ss
left join public.profiles p on p.id = ss.customer_id;
