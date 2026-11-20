-- Supabase SQL Editor'de BİR KEZ çalıştır.
-- Kullanıcı rolü yalnızca sunucu tarafında SECURITY DEFINER fonksiyonuyla kontrol edilir.
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Eski policy'lerde admin_users tablosuna doğrudan erişim vardı.
-- Bunları rol doğrulama fonksiyonuyla değiştir.
drop policy if exists "public read published products" on public.products;
create policy "public read published products" on public.products
  for select to anon, authenticated
  using (published = true or (select public.is_admin()));
drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects
  for select to anon, authenticated
  using (published = true or (select public.is_admin()));

-- Ürün ve proje yazma işlemleri yalnızca yöneticiler için.
create policy "admin insert products" on public.products for insert to authenticated with check ((select public.is_admin()));
create policy "admin update products" on public.products for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin delete products" on public.products for delete to authenticated using ((select public.is_admin()));
create policy "admin insert projects" on public.projects for insert to authenticated with check ((select public.is_admin()));
create policy "admin update projects" on public.projects for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin delete projects" on public.projects for delete to authenticated using ((select public.is_admin()));
create policy "admin insert categories" on public.categories for insert to authenticated with check ((select public.is_admin()));
create policy "admin update categories" on public.categories for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin delete categories" on public.categories for delete to authenticated using ((select public.is_admin()));
