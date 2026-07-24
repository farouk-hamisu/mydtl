-- ============================================================
-- Triggers & functions
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch  before update on public.profiles       for each row execute function public.touch_updated_at();
create trigger shipments_touch before update on public.shipments        for each row execute function public.touch_updated_at();
create trigger fees_touch      before update on public.shipment_fees    for each row execute function public.touch_updated_at();
create trigger payments_touch  before update on public.payments         for each row execute function public.touch_updated_at();
create trigger settings_touch  before update on public.site_settings    for each row execute function public.touch_updated_at();

-- Auto-create a tracking event whenever a shipment status changes
create or replace function public.shipment_status_change_event()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (tg_op = 'UPDATE') then
    if new.status is distinct from old.status then
      insert into public.tracking_events (shipment_id, status, location_label, lat, lng, note)
      values (
        new.id,
        new.status,
        coalesce(new.current_location_label, ''),
        new.current_lat,
        new.current_lng,
        'Status updated to ' || new.status
      );
    end if;
    return new;
  end if;
  return null;
end;
$$;

drop trigger if exists shipments_status_event on public.shipments;
create trigger shipments_status_event
  after update on public.shipments
  for each row execute function public.shipment_status_change_event();

-- When a payment is verified, mark the linked fee as paid
create or replace function public.apply_verified_payment()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (new.status = 'verified' and (old.status is null or old.status <> 'verified')) then
    if new.fee_id is not null then
      update public.shipment_fees set status = 'paid' where id = new.fee_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists payments_verify_trigger on public.payments;
create trigger payments_verify_trigger
  after update on public.payments
  for each row execute function public.apply_verified_payment();
