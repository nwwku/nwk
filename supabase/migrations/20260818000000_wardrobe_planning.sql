create table public.outfit_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  gender text not null check (gender in ('female', 'male')),
  planned_for date not null,
  title text not null,
  occasion text not null default '',
  wardrobe_item_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.wear_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  wardrobe_item_id uuid not null references public.wardrobe_items (id) on delete cascade,
  worn_on date not null default current_date,
  created_at timestamptz not null default now(),
  unique (user_id, wardrobe_item_id, worn_on)
);

create table public.capsule_items (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  wardrobe_item_id uuid not null references public.wardrobe_items (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, wardrobe_item_id)
);

alter table public.outfit_plans enable row level security;
alter table public.wear_logs enable row level security;
alter table public.capsule_items enable row level security;

create policy "manage own outfit plans" on public.outfit_plans for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "manage own wear logs" on public.wear_logs for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "manage own capsule" on public.capsule_items for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index outfit_plans_user_date_idx on public.outfit_plans (user_id, planned_for);
create index wear_logs_user_date_idx on public.wear_logs (user_id, worn_on desc);
