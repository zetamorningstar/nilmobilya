-- Nil Mobilya: Supabase SQL Editor'de çalıştırılacak ilk veri modeli.
-- Yönetici izinleri oluşturulmadan tarayıcıdan yazma işlemleri açılmaz.
create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text not null default '',
  image_urls text[] not null default '{}',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_urls text[] not null default '{}',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.admin_users enable row level security;

-- Ziyaretçiler sadece yayınlanan içeriği okuyabilir.
create policy "public read categories" on public.categories for select to anon, authenticated using (true);
create policy "public read published products" on public.products for select to anon, authenticated using (published = true or (select auth.uid()) in (select user_id from public.admin_users));
create policy "public read published projects" on public.projects for select to anon, authenticated using (published = true or (select auth.uid()) in (select user_id from public.admin_users));

-- Yönetici listesi istemciye açık değildir.
-- Yönetici kayıtları yalnızca Supabase SQL Editor / güvenli sunucu üzerinden eklenir.
-- Yazma izinleri kimlik doğrulama bağlantısı tamamlandığında ayrı migration ile tanımlanacak.
