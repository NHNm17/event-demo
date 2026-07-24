create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_path text not null,
  uploaded_at timestamptz not null default now(),
  table_number text,
  guest_name text,
  event_type text not null default 'wedding'
);

alter table public.photos enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'valid_event_type'
      and conrelid = 'public.photos'::regclass
  ) then
    alter table public.photos
      add constraint valid_event_type
      check (event_type in ('wedding', 'homecoming'));
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public;

do $$
begin
  create policy "Anyone can view photos"
  on public.photos
  for select
  using (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Anyone can insert photos"
  on public.photos
  for insert
  with check (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Anyone can delete photos"
  on public.photos
  for delete
  using (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Anyone can upload event photos"
  on storage.objects
  for insert
  with check (bucket_id = 'event-photos');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Anyone can view event photos"
  on storage.objects
  for select
  using (bucket_id = 'event-photos');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Anyone can delete event photos"
  on storage.objects
  for delete
  using (bucket_id = 'event-photos');
exception
  when duplicate_object then null;
end $$;
