-- Nil Mobilya: categories/products içe aktarım ve düzenleme izinleri.
-- Supabase SQL Editor'de bir kez çalıştırılabilir; tekrar çalıştırmak güvenlidir.
-- Sadece public.is_admin() ile doğrulanan oturumlara yazma izni verir.
-- admin_users verilerini veya mevcut ürünleri değiştirmez.

alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "admin insert categories" on public.categories;
create policy "admin insert categories" on public.categories
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "admin update categories" on public.categories;
create policy "admin update categories" on public.categories
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "admin insert products" on public.products;
create policy "admin insert products" on public.products
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "admin update products" on public.products;
create policy "admin update products" on public.products
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "admin delete products" on public.products;
create policy "admin delete products" on public.products
  for delete to authenticated
  using ((select public.is_admin()));

-- Yönetici taslak ürünleri de okuyabilsin.
drop policy if exists "public read published products" on public.products;
create policy "public read published products" on public.products
  for select to anon, authenticated
  using (published = true or (select public.is_admin()));

-- Kategoriler hem ziyaretçi hem yönetici tarafından okunabilir.
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
  for select to anon, authenticated using (true);

-- Supabase API üzerinden tablo yetkileri
grant select on public.categories to anon;
grant select on public.products to anon;
grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.products to authenticated;

-- Durumu kontrol etmek için:
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename in ('products','categories')
order by tablename, policyname;
