-- ============================================================
-- Seed data
-- ============================================================

-- Default settings already populated in migration 0000; update with brand values.
update public.site_settings set
  site_name = 'DiamondThriveLogistics',
  tagline = 'Premium International Shipping & Logistics',
  hero_headline = 'Cargo Without Borders. Delivered on Time, Every Time.',
  hero_subheadline = 'Air, sea, and road freight with end-to-end visibility, live tracking, and dedicated customs handling across 190+ countries.',
  hero_bullets = 'Real-time tracking|Live interactive map|Customs clearance handled|Door-to-door delivery',
  contact_email = 'support@diamondthrivelogistics.com',
  contact_phone = '+1 (816) 555-0140',
  contact_address = '1801 Main Street, Kansas City, MO 64108, United States',
  business_hours = 'Mon – Fri: 08:00 – 18:00  ·  Sat: 09:00 – 14:00',
  social_facebook  = 'https://facebook.com',
  social_twitter   = 'https://twitter.com',
  social_linkedin  = 'https://linkedin.com',
  social_instagram = 'https://instagram.com',
  social_youtube   = 'https://youtube.com',
  usdt_trc20_address = 'TXMjZ7MrfUMTFMQ96AwRTJTdsR3NmaL41u',
  ach_account_holder = 'DiamondThriveLogistics',
  ach_bank           = 'Lead Bank',
  ach_account_number = '214144811917',
  ach_routing_number = '101019644',
  ach_account_type   = 'Personal Checking',
  ach_bank_address    = '1801 Main Street, Kansas City, MO 64108, United States',
  seo_title = 'DiamondThriveLogistics — Premium International Shipping & Logistics',
  seo_description = 'DiamondThriveLogistics delivers air, sea, and road freight with real-time tracking, live maps, customs handling, and global door-to-door delivery.',
  seo_keywords = 'international shipping, freight forwarding, logistics, air cargo, sea freight, customs clearance, cargo tracking'
where id = 1;

-- Shipment categories
insert into public.shipment_categories (name, slug, description) values
  ('Air Freight',       'air-freight',       'Express international air cargo'),
  ('Sea Freight',       'sea-freight',       'FCL / LCL ocean container shipping'),
  ('Road Freight',      'road-freight',       'Cross-border trucking'),
  ('Express Courier',   'express-courier',   'Time-critical small parcels'),
  ('Customs Clearance','customs-clearance',  'Customs documentation and clearance'),
  ('Warehousing',       'warehousing',        'Storage, picking & packing')
on conflict (slug) do nothing;

-- Brand partners (logos via clearbit/placeholder)
insert into public.brand_partners (name, logo_url, sort_order) values
  ('AeroGlobal',   'https://logo.clearbit.com/dhl.com',     1),
  ('NorthPort',    'https://logo.clearbit.com/ups.com',     2),
  ('CargoJet',     'https://logo.clearbit.com/fedex.com',   3),
  ('OceanLink',    'https://logo.clearbit.com/maersk.com',  4),
  ('FedForward',   'https://logo.clearbit.com/aramex.com',  5),
  ('SkyCargo',     'https://logo.clearbit.com/emirates.com',6)
on conflict do nothing;

-- Services
insert into public.services (title, description, icon, image_url, category_label, sort_order) values
  ('Air Freight',
   'Time-critical international air cargo with daily departures and priority boarding for express shipments.',
   'plane',
   'https://images.unsplash.com/photo-1556388158-fb2f9c4f0a8f?auto=format&fit=crop&w=1200&q=80',
   'Warehousing', 1),
  ('Sea Freight',
   'FCL and LCL ocean freight with competitive transit times and dedicated customs handling worldwide.',
   'anchor',
   'https://images.unsplash.com/photo-1494412574745-e8de75a01951?auto=format&fit=crop&w=1200&q=80',
   'Ocean Shipping', 2),
  ('Road Freight',
   'Cross-border trucking across North America and Europe with tracked fleet and bonded warehouses.',
   'truck',
   'https://images.unsplash.com/photo-1601584115787-c5bc4d0e69d0?auto=format&fit=crop&w=1200&q=80',
   'Land Transport', 3)
on conflict do nothing;

-- Gallery
insert into public.gallery_items (title, url, category, sort_order) values
  ('Container terminal at dusk', 'https://images.unsplash.com/photo-1494412574745-e8de75a01951?auto=format&fit=crop&w=1400&q=80', 'Ports', 1),
  ('Air freight loading',          'https://images.unsplash.com/photo-1556388158-fb2f9c4f0a8f?auto=format&fit=crop&w=1400&q=80', 'Air', 2),
  ('Warehouse operations',         'https://images.unsplash.com/photo-1553413077-190dd3058711?auto=format&fit=crop&w=1400&q=80', 'Warehousing', 3),
  ('Long-haul truck',              'https://images.unsplash.com/photo-1601584115787-c5bc4d0e69d0?auto=format&fit=crop&w=1400&q=80', 'Road', 4),
  ('Cargo plane taxiing',          'https://images.unsplash.com/photo-1569629748619-ce3a28d28a40?auto=format&fit=crop&w=1400&q=80', 'Air', 5),
  ('Port cargo handling',          'https://images.unsplash.com/photo-1577416412292-747c6607f0c7?auto=format&fit=crop&w=1400&q=80', 'Ports', 6)
on conflict do nothing;

-- Testimonials
insert into public.testimonials (author, role, company, avatar_url, quote, rating, sort_order) values
  ('Marcus Holloway', 'Head of Procurement', 'NorthBrew Imports', 'https://i.pravatar.cc/160?img=12',
   'DiamondThriveLogistics moved our cold-chain containers across three borders with full visibility. The live map alone won them a permanent place on our vendor list.', 5, 1),
  ('Adaeze Okeke', 'Logistics Director', 'Sahara Distributors', null,
   'They cleared customs faster than any partner we have used, and the dashboard made our finance team happy.', 5, 2),
  ('Tomás Reyes', 'Founder', 'Reyes Textiles', null,
   'I could see exactly where my container was at all times. The payment flow for duties turned a usually painful process into a few clicks.', 5, 3)
on conflict do nothing;

-- A sample, ended shipment (visible only once an admin links it to a profile)
-- tracking_number is left for demo / tracking by visitors
insert into public.shipments (
  tracking_number, service, status,
  sender_name, sender_country, sender_address,
  receiver_name, receiver_email, receiver_country, receiver_address,
  origin_name, origin_country, origin_lat, origin_lng,
  destination_name, destination_country, destination_lat, destination_lng,
  current_lat, current_lng, current_location_label,
  weight_kg, pieces, estimated_delivery, notes
) values (
  'DTL-DEMO-0001', 'Sea Freight', 'awaiting_payment',
  'NorthBrew Imports', 'United States', '1500 Broadway, Kansas City, MO',
  'Marcus Holloway', 'demo@diamondthrivelogistics.com', 'Kenya', 'Westlands, Nairobi',
  'Port of Kansas City', 'United States', 39.0998, -94.5786,
  'Port of Mombasa', 'Kenya', -4.0435, 39.6682,
  12.4634, 47.0225, 'Indian Ocean — off Madagascar',
  12400.00, 220, now() + interval '14 days',
  'Demo shipment shown on the public tracking demo.'
) on conflict do nothing;

-- fees on that demo shipment (unpaid)
insert into public.shipment_fees (shipment_id, name, description, amount, currency, status, due_date, notes)
select
  s.id, 'Customs Duty', 'VAT & duty on imported goods', 1820.00, 'USD', 'unpaid', now() + interval '7 days', 'KRA import duty'
from public.shipments s where s.tracking_number = 'DTL-DEMO-0001';

insert into public.shipment_fees (shipment_id, name, description, amount, currency, status, due_date, notes)
select
  s.id, 'Port Charges', 'Mombasa port handling & storage', 420.00, 'USD', 'unpaid', now() + interval '7 days', ''
from public.shipments s where s.tracking_number = 'DTL-DEMO-0001';

insert into public.shipment_fees (shipment_id, name, description, amount, currency, status, due_date, notes)
select
  s.id, 'Shipping Fee', 'Sea freight main leg', 1980.00, 'USD', 'paid', now() - interval '3 days', ''
from public.shipments s where s.tracking_number = 'DTL-DEMO-0001';

-- sample tracking events for the demo shipment
insert into public.tracking_events (shipment_id, status, location_label, lat, lng, note, occurred_at)
select s.id, 'created','Kansas City, USA',39.0998,-94.5786,'Shipment created',now() - interval '8 days'
from public.shipments s where s.tracking_number = 'DTL-DEMO-0001';
insert into public.tracking_events (shipment_id, status, location_label, lat, lng, note, occurred_at)
select s.id, 'picked_up','Kansas City Hub',39.0998,-94.5786,'Picked up from origin warehouse',now() - interval '7 days'
from public.shipments s where s.tracking_number = 'DTL-DEMO-0001';
insert into public.tracking_events (shipment_id, status, location_label, lat, lng, note, occurred_at)
select s.id, 'in_transit','Atlantic — mid-ocean',25.0,-30.0,'Loaded onto MV Ocean Pioneer',now() - interval '5 days'
from public.shipments s where s.tracking_number = 'DTL-DEMO-0001';
insert into public.tracking_events (shipment_id, status, location_label, lat, lng, note, occurred_at)
select s.id, 'in_transit','Indian Ocean — Madagascar EEZ',-12.4634,47.0225,'Tracking via satellite AIS',now() - interval '1 days'
from public.shipments s where s.tracking_number = 'DTL-DEMO-0001';
insert into public.tracking_events (shipment_id, status, location_label, lat, lng, note, occurred_at)
select s.id, 'awaiting_payment','Port of Mombasa',-4.0435,39.6682,'Awaiting customs duty payment before release',now()
from public.shipments s where s.tracking_number = 'DTL-DEMO-0001';

-- sample images
insert into public.shipment_images (shipment_id, url, caption, kind, taken_at)
select s.id, 'https://images.unsplash.com/photo-1553413077-190dd3058711?auto=format&fit=crop&w=1200&q=80','Warehouse palletization','warehouse', now() - interval '8 days'
from public.shipments s where s.tracking_number = 'DTL-DEMO-0001';
insert into public.shipment_images (shipment_id, url, caption, kind, taken_at)
select s.id, 'https://images.unsplash.com/photo-1494412574745-e8de75a01951?auto=format&fit=crop&w=1200&q=80','Container loading','port', now() - interval '6 days'
from public.shipments s where s.tracking_number = 'DTL-DEMO-0001';
insert into public.shipment_images (shipment_id, url, caption, kind, taken_at)
select s.id, 'https://images.unsplash.com/photo-1577416412292-747c6607f0c7?auto=format&fit=crop&w=1200&q=80','On-deck cargo','progress', now() - interval '3 days'
from public.shipments s where s.tracking_number = 'DTL-DEMO-0001';
