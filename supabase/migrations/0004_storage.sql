-- ============================================================
-- Storage buckets & policies
-- ============================================================
insert into storage.buckets (id, name, public) values
  ('shipment-images', 'shipment-images', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values
  ('gallery',        'gallery',        true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values
  ('brand-logos',    'brand-logos',    true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values
  ('avatars',        'avatars',        true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values
  ('payment-receipts','payment-receipts', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values
  ('documents',      'documents',      false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values
  ('homepage',       'homepage',       true)
  on conflict (id) do nothing;

-- Public read for public-facing buckets (images)
create policy "public read shipment-images" on storage.objects for select
  using (bucket_id = 'shipment-images');
create policy "admin write shipment-images" on storage.objects for insert
  with check (bucket_id = 'shipment-images' and public.is_admin());
create policy "admin delete shipment-images" on storage.objects for delete
  using (bucket_id = 'shipment-images' and public.is_admin());

create policy "public read gallery" on storage.objects for select
  using (bucket_id = 'gallery');
create policy "admin write gallery"  on storage.objects for insert
  with check (bucket_id = 'gallery' and public.is_admin());
create policy "admin delete gallery" on storage.objects for delete
  using (bucket_id = 'gallery' and public.is_admin());

create policy "public read logos"  on storage.objects for select
  using (bucket_id = 'brand-logos');
create policy "admin write logos"   on storage.objects for insert
  with check (bucket_id = 'brand-logos' and public.is_admin());
create policy "admin delete logos"  on storage.objects for delete
  using (bucket_id = 'brand-logos' and public.is_admin());

create policy "public read avatars"  on storage.objects for select
  using (bucket_id = 'avatars');
create policy "owner write avatars"  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid() is not null);
create policy "owner delete avatars" on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid() is not null);

create policy "owner read receipts"  on storage.objects for select
  using (bucket_id = 'payment-receipts' and (auth.uid() = owner or public.is_admin()));
create policy "auth insert receipts" on storage.objects for insert
  with check (bucket_id = 'payment-receipts' and auth.uid() is not null);
create policy "admin delete receipts" on storage.objects for delete
  using (bucket_id = 'payment-receipts' and public.is_admin());

create policy "admin all homepage" on storage.objects for all
  using (bucket_id = 'homepage' and public.is_admin())
  with check (bucket_id = 'homepage' and public.is_admin());
create policy "public read homepage" on storage.objects for select
  using (bucket_id = 'homepage');

create policy "admin all documents" on storage.objects for all
  using (bucket_id = 'documents' and public.is_admin())
  with check (bucket_id = 'documents' and public.is_admin());
