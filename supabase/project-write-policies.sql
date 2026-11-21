-- Nil Mobilya Sergimiz: project admin yazma ve yayınlama yetkileri.
-- Supabase SQL Editor'de bir kez çalıştırılabilir; tekrar çalıştırmak güvenlidir.
-- public.is_admin() fonksiyonunu kullanır; kullanıcıları veya projeleri silmez.

alter table public.projects enable row level security;

drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects
  for select to anon, authenticated
  using (published = true or (select public.is_admin()));

drop policy if exists "admin insert projects" on public.projects;
create policy "admin insert projects" on public.projects
  for insert to authenticated with check ((select public.is_admin()));

drop policy if exists "admin update projects" on public.projects;
create policy "admin update projects" on public.projects
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admin delete projects" on public.projects;
create policy "admin delete projects" on public.projects
  for delete to authenticated
  using ((select public.is_admin()));

grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;

select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'projects'
order by policyname;
