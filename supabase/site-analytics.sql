-- Nil Mobilya first-party analytics. Run in Supabase SQL Editor.
-- Counts are events, not unique visitors; no IP, email, user-agent or fingerprint is stored.
create table if not exists public.site_events (
 id bigint generated always as identity primary key,
 event_type text not null check (event_type in ('page_view','whatsapp_click')),
 page_path text not null check (length(page_path)<=160),
 created_at timestamptz not null default now()
);
create index if not exists site_events_created_at_idx on public.site_events(created_at desc);
alter table public.site_events enable row level security;
revoke all on public.site_events from anon, authenticated;
-- SECURITY DEFINER functions expose only validated writes and aggregated reads.
create or replace function public.record_site_event(p_type text,p_path text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if p_type not in ('page_view','whatsapp_click') or p_path is null or length(p_path)>160 or p_path !~ '^/[a-zA-Z0-9/_-]*$' or p_path like '/admin%' then
   raise exception 'Invalid event';
 end if;
 insert into public.site_events(event_type,page_path) values(p_type,p_path);
end $$;
revoke all on function public.record_site_event(text,text) from public;
grant execute on function public.record_site_event(text,text) to anon,authenticated;

create or replace function public.admin_site_analytics(p_days integer default 14)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if not public.is_admin() then raise exception 'Not authorized'; end if;
 if p_days not between 1 and 90 then raise exception 'Invalid range'; end if;
 select jsonb_build_object(
  'daily',coalesce((select jsonb_agg(jsonb_build_object('day',d.day::text,'views',coalesce(v.views,0),'whatsapp',coalesce(v.whatsapp,0)) order by d.day)
   from generate_series(current_date-(p_days-1),current_date,interval '1 day') as d(day)
   left join lateral (select count(*) filter(where event_type='page_view') as views,count(*) filter(where event_type='whatsapp_click') as whatsapp from public.site_events where created_at>=d.day and created_at<d.day+interval '1 day') v on true),'[]'::jsonb),
  'top_pages',coalesce((select jsonb_agg(jsonb_build_object('path',page_path,'views',views) order by views desc) from (select page_path,count(*) as views from public.site_events where event_type='page_view' and created_at>=now()-(p_days||' days')::interval group by page_path order by views desc limit 5) q),'[]'::jsonb)
 ) into result;
 return result;
end $$;
revoke all on function public.admin_site_analytics(integer) from public;
grant execute on function public.admin_site_analytics(integer) to authenticated;
