-- Nil Mobilya / ürün fotoğrafları için bir kez Supabase SQL Editor'de çalıştırın.
-- Fotoğraflar herkese açık URL ile okunur, yükleme/silme sadece admin kullanıcılarına açıktır.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('nil-product-images', 'nil-product-images', true, 8388608,
  array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "nil public product image read" on storage.objects;
create policy "nil public product image read" on storage.objects
for select to anon, authenticated
using (bucket_id = 'nil-product-images');

drop policy if exists "nil admin product image insert" on storage.objects;
create policy "nil admin product image insert" on storage.objects
for insert to authenticated
with check (bucket_id = 'nil-product-images' and (select public.is_admin()));

drop policy if exists "nil admin product image update" on storage.objects;
create policy "nil admin product image update" on storage.objects
for update to authenticated
using (bucket_id = 'nil-product-images' and (select public.is_admin()))
with check (bucket_id = 'nil-product-images' and (select public.is_admin()));

drop policy if exists "nil admin product image delete" on storage.objects;
create policy "nil admin product image delete" on storage.objects
for delete to authenticated
using (bucket_id = 'nil-product-images' and (select public.is_admin()));
