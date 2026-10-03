-- Gift card payments
-- Adds a 'gift_card' payment method plus the fields needed to verify a gift card.

alter table public.payments drop constraint if exists payments_method_check;
alter table public.payments add constraint payments_method_check
  check (method in ('usdt_trc20', 'ach', 'wire', 'other', 'gift_card'));

alter table public.payments add column if not exists card_brand  text;
alter table public.payments add column if not exists card_number text;
alter table public.payments add column if not exists card_value  numeric(14, 2);

create index if not exists payments_method_idx on public.payments (method);
