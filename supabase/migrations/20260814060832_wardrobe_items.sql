create table public.wardrobe_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  gender text not null check (gender in ('female', 'male')),
  name text not null,
  category text not null,
  color text not null,
  style text not null,
  material text not null default 'Cotton',
  image_path text not null,
  created_at timestamptz not null default now()
);

alter table public.wardrobe_items enable row level security;

create policy "read own wardrobe items"
  on public.wardrobe_items for select to authenticated
  using (auth.uid() = user_id);

create policy "insert own wardrobe items"
  on public.wardrobe_items for insert to authenticated
  with check (auth.uid() = user_id);

create policy "update own wardrobe items"
  on public.wardrobe_items for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own wardrobe items"
  on public.wardrobe_items for delete to authenticated
  using (auth.uid() = user_id);

create index wardrobe_items_user_gender_idx
  on public.wardrobe_items (user_id, gender, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wardrobe', 'wardrobe', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "read own wardrobe photos"
  on storage.objects for select to authenticated
  using (bucket_id = 'wardrobe' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "insert own wardrobe photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'wardrobe' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "update own wardrobe photos"
  on storage.objects for update to authenticated
  using (bucket_id = 'wardrobe' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'wardrobe' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "delete own wardrobe photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'wardrobe' and (storage.foldername(name))[1] = auth.uid()::text);
