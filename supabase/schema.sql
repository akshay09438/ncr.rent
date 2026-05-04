-- delhi.rent — Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- Main pins table
create table if not exists public.pins (
  id            uuid        default gen_random_uuid() primary key,
  type          text        not null check (type in ('rental', 'seeker', 'flatmate')),
  lat           float       not null,
  lng           float       not null,
  bhk           integer    check (bhk is null or bhk between 1 and 10),
  rent          integer    not null check (rent > 0),

  -- Rental-specific
  furnishing    text       check (furnishing in ('furnished', 'unfurnished')),
  maintenance_included boolean default false,
  gated         boolean,
  landlord_type text       check (landlord_type in ('direct', 'broker')),
  who_lives     text       check (who_lives in ('family', 'bachelor', 'anyone')),
  deposit_months integer,
  pets_allowed  text       check (pets_allowed in ('yes', 'no', 'unsure')),
  parking       integer   check (parking >= 0),
  sqft          integer,

  -- Meta
  society_name  text,
  commute_hub   text       check (commute_hub in ('cyber_hub', 'cp', 'noida_sec62', 'saket', 'dwarka', 'none')),
  water_supply  text       check (water_supply in ('municipal', 'tanker', 'borewell', 'mixed')),
  power_cuts    text       check (power_cuts in ('rare', 'occasional', 'frequent')),
  one_liner     text,

  -- Flatmate/seeker specific
  available_from   text,
  gender_pref      text       check (gender_pref in ('male', 'female', 'any')),
  smoker_ok        text       check (smoker_ok in ('yes', 'no', 'no_preference')),
  food_pref        text       check (food_pref in ('veg', 'non_veg', 'any')),
  lifestyle_note   text,
  looking_for_flatmate boolean default false,
  budget           integer,
  bhk_pref         text,  -- "1,2,3,any"

  -- Contact (private — never shown publicly)
  email           text,
  phone           text,
  device_id       text    not null,
  creator_ip      text,   -- for spam detection only
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  deleted_at      timestamptz,
  reports_count   integer  default 0
);

-- Ratings
create table if not exists public.ratings (
  id               uuid        default gen_random_uuid() primary key,
  pin_id           uuid        not null references public.pins(id) on delete cascade,
  device_id        text        not null,
  locality_rating  integer    not null check (locality_rating between 1 and 5),
  built_rating     integer    check (built_rating between 1 and 5),
  created_at       timestamptz default now(),
  unique(pin_id, device_id)
);

-- Comments
create table if not exists public.comments (
  id         uuid        default gen_random_uuid() primary key,
  pin_id     uuid        not null references public.pins(id) on delete cascade,
  device_id  text        not null,
  body       text        not null check (char_length(body) <= 500),
  created_at timestamptz default now()
);

-- Reports
create table if not exists public.reports (
  id         uuid        default gen_random_uuid() primary key,
  pin_id     uuid        not null references public.pins(id) on delete cascade,
  device_id  text        not null,
  reason     text,
  created_at timestamptz default now()
);

-- Watched areas (watch this area alerts)
create table if not exists public.watched_areas (
  id             uuid        default gen_random_uuid() primary key,
  lat            float       not null,
  lng            float       not null,
  radius_km      float       not null default 1.0,
  email          text        not null,
  phone          text,
  duration_months integer   not null,
  active         boolean     default true,
  created_at     timestamptz default now(),
  expires_at     timestamptz
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists pins_type_idx          on public.pins(type);
create index if not exists pins_bhk_idx           on public.pins(bhk);
create index if not exists pins_rent_idx          on public.pins(rent);
create index if not exists pins_gated_idx         on public.pins(gated);
create index if not exists pins_device_id_idx     on public.pins(device_id);
create index if not exists pins_location_idx      on public.pins(lat, lng);
create index if not exists pins_created_at_idx    on public.pins(created_at desc);
create index if not exists pins_deleted_at_idx    on public.pins(deleted_at) where deleted_at is null;
create index if not exists ratings_pin_id_idx     on public.ratings(pin_id);
create index if not exists comments_pin_id_idx    on public.comments(pin_id);
create index if not exists reports_pin_id_idx     on public.reports(pin_id);
create index if not exists watched_areas_active_idx on public.watched_areas(active) where active = true;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.pins       enable row level security;
alter table public.ratings    enable row level security;
alter table public.comments   enable row level security;
alter table public.reports   enable row level security;
alter table public.watched_areas enable row level security;

-- Pins: anyone can read active pins; insert without device_id check (client sends it)
-- update/delete via client device_id check (see note below)
create policy "pins_read_active"
  on public.pins for select
  using (deleted_at is null and reports_count < 3);

-- Note: device_id is passed by the client in the payload. For RLS to enforce
-- device ownership, set app.device_id before each request via a service role key
-- OR use a Supabase Edge Function to handle writes (recommended for production).
-- For MVP: allow all inserts without device_id check (client-side device_id in payload).
create policy "pins_insert_anyone"
  on public.pins for insert with check (true);

create policy "pins_update_own"
  on public.pins for update
  using (device_id = current_setting('app.device_id', true));

create policy "pins_delete_own"
  on public.pins for delete
  using (device_id = current_setting('app.device_id', true));

-- Ratings: anyone can read; device can insert/update own
create policy "ratings_read_all"
  on public.ratings for select using (true);

create policy "ratings_insert_own"
  on public.ratings for insert
  with check (device_id = current_setting('app.device_id', true));

create policy "ratings_update_own"
  on public.ratings for update
  using (device_id = current_setting('app.device_id', true));

-- Comments: anyone can read; device can insert own
create policy "comments_read_all"
  on public.comments for select using (true);

create policy "comments_insert_own"
  on public.comments for insert
  with check (device_id = current_setting('app.device_id', true));

-- Reports: anyone can insert
create policy "reports_insert_all"
  on public.reports for insert with check (true);

-- Watched areas: anyone can insert; no select allowed
create policy "watched_areas_insert_all"
  on public.watched_areas for insert with check (true);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-hide pins with 3+ reports
create or replace function public.auto_hide_reported_pins()
returns trigger language plpgsql security definer as $$
begin
  if NEW.reports_count >= 3 then
    -- Pin is hidden; could notify admin here via a notification table
    return NEW;
  end if;
  return NEW;
end;
$$;

create trigger trg_auto_hide_reported_pins
  before update of reports_count on public.pins
  for each row execute function public.auto_hide_reported_pins();

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$;

create trigger trg_pins_updated_at
  before update on public.pins
  for each row execute function public.update_updated_at();

-- Server-side incrementer: updates reports_count by x (runs as definer so bypasses RLS)
create or replace function public.increment_reports_count(pin_id uuid, x integer default 1)
returns void language plpgsql security definer as $$
begin
  update public.pins set reports_count = reports_count + x where id = pin_id;
end;
$$;

-- Secure update: checks device_id matches, bypasses RLS via security definer
create or replace function public.update_pin(
  p_id      uuid,
  p_device_id text,
  p_updates jsonb
)
returns public.pins language plpgsql security definer as $$
begin
  -- Only allow update if device_id matches
  if not exists (
    select 1 from public.pins
    where id = p_id and device_id = p_device_id and deleted_at is null
  ) then
    raise exception 'Not authorized or pin not found';
  end if;

  update public.pins set
    bhk                = coalesce((p_updates->>'bhk')::int, bhk),
    rent               = coalesce((p_updates->>'rent')::int, rent),
    furnishing         = coalesce(p_updates->>'furnishing', furnishing),
    gated              = coalesce((p_updates->>'gated')::boolean, gated),
    landlord_type      = coalesce(p_updates->>'landlord_type', landlord_type),
    who_lives          = coalesce(p_updates->>'who_lives', who_lives),
    deposit_months     = coalesce((p_updates->>'deposit_months')::int, deposit_months),
    pets_allowed       = coalesce(p_updates->>'pets_allowed', pets_allowed),
    parking            = coalesce((p_updates->>'parking')::int, parking),
    sqft               = coalesce((p_updates->>'sqft')::int, sqft),
    society_name       = coalesce(p_updates->>'society_name', society_name),
    commute_hub        = coalesce(p_updates->>'commute_hub', commute_hub),
    water_supply       = coalesce(p_updates->>'water_supply', water_supply),
    power_cuts         = coalesce(p_updates->>'power_cuts', power_cuts),
    one_liner          = coalesce(p_updates->>'one_liner', one_liner),
    looking_for_flatmate = coalesce((p_updates->>'looking_for_flatmate')::boolean, looking_for_flatmate),
    email              = coalesce(p_updates->>'email', email),
    updated_at         = now()
  where id = p_id;

  return (select row(p) from public.pins p where id = p_id);
end;
$$;

-- Secure delete: soft-deletes, only owner can delete
create or replace function public.delete_pin(p_id uuid, p_device_id text)
returns void language plpgsql security definer as $$
begin
  if not exists (
    select 1 from public.pins
    where id = p_id and device_id = p_device_id and deleted_at is null
  ) then
    raise exception 'Not authorized or pin not found';
  end if;
  update public.pins set deleted_at = now() where id = p_id;
end;
$$;

-- ============================================================
-- ANON FUNCTION: get_pins
-- ============================================================

create or replace function public.get_pins(
  p_type     text default null,
  p_bhk      integer[] default null,
  p_min_rent integer default null,
  p_max_rent integer default null,
  p_gated    boolean default null,
  p_furnishing text default null,
  p_min_rating float default null,
  p_lat      float default null,
  p_lng      float default null,
  p_radius_km float default null
)
returns table (
  id                  uuid,
  type                text,
  lat                 float,
  lng                 float,
  bhk                 integer,
  rent                integer,
  furnishing          text,
  maintenance_included boolean,
  gated               boolean,
  landlord_type       text,
  who_lives           text,
  deposit_months      integer,
  pets_allowed        text,
  parking             integer,
  sqft                integer,
  society_name        text,
  commute_hub         text,
  water_supply        text,
  power_cuts          text,
  one_liner           text,
  available_from      text,
  gender_pref         text,
  smoker_ok           text,
  food_pref           text,
  lifestyle_note      text,
  looking_for_flatmate boolean,
  budget              integer,
  bhk_pref            text,
  created_at          timestamptz,
  reports_count       integer,
  avg_locality        float,
  avg_built           float,
  comment_count      bigint
) language plpgsql security definer as $$
begin
  return query
  select
    p.id, p.type,
    -- Round coords to 3 decimal places (~111m) to prevent exact location doxxing
    round(p.lat::numeric, 3)::float as lat,
    round(p.lng::numeric, 3)::float as lng,
    p.bhk, p.rent, p.furnishing, p.maintenance_included, p.gated,
    p.landlord_type, p.who_lives, p.deposit_months, p.pets_allowed,
    p.parking, p.sqft, p.society_name, p.commute_hub, p.water_supply,
    p.power_cuts, p.one_liner, p.available_from, p.gender_pref,
    p.smoker_ok, p.food_pref, p.lifestyle_note, p.looking_for_flatmate,
    p.budget, p.bhk_pref, p.created_at, p.reports_count,
    coalesce(r.avg_locality, 0) as avg_locality,
    coalesce(r.avg_built, 0) as avg_built,
    coalesce(c.comment_count, 0) as comment_count
  from public.pins p
  left join lateral (
    select
      pin_id,
      avg(locality_rating)::float as avg_locality,
      avg(built_rating)::float    as avg_built
    from public.ratings
    where pin_id = p.id
    group by pin_id
  ) r on true
  left join lateral (
    select count(*) as comment_count
    from public.comments
    where pin_id = p.id
  ) c on true
  where p.deleted_at is null
    and p.reports_count < 3
    and (p_type     is null or p.type = p_type)
    and (p_bhk      is null or p.bhk = any(p_bhk))
    and (p_min_rent is null or p.rent >= p_min_rent)
    and (p_max_rent is null or p.rent <= p_max_rent)
    and (p_gated    is null or p.gated = p_gated)
    and (p_furnishing is null or p.furnishing = p_furnishing)
    and (p_lat is null or p_radius_km is null
         or ST_DWithin(
               ST_MakePoint(p.lng, p.lat)::geography,
               ST_MakePoint(p_lng, p_lat)::geography,
               p_radius_km * 1000
             ))
  order by p.created_at desc
  limit 500;
end;
$$;

-- ============================================================
-- ANON FUNCTION: send_interest
-- ============================================================

create or replace function public.send_interest(
  p_pin_id    uuid,
  p_seeker_email text,
  p_message   text default null
)
returns jsonb language plpgsql security definer as $$
declare
  v_owner_email text;
  v_pin_rent   integer;
  v_pin_bhk    integer;
  v_pin_area   text;
  v_seeker_msg text;
begin
  select email, rent, bhk, society_name
    into v_owner_email, v_pin_rent, v_pin_bhk, v_pin_area
  from public.pins
  where id = p_pin_id and deleted_at is null;

  if v_owner_email is null then
    return jsonb_build_object('success', false, 'error', 'Pin not found');
  end if;

  -- In production: call Resend/SendGrid API here to send email.
  -- For now, log it (replace with real email send in edge function).
  v_seeker_msg := format(
    'Someone is interested in your listing at %s (₹%s / %s BHK). ' ||
    'Contact them at: %s. %s',
    coalesce(v_pin_area, 'the listed property'),
    v_pin_rent,
    v_pin_bhk,
    p_seeker_email,
    coalesce(p_message, '')
  );

  -- TODO: Send actual email via Resend/SendGrid API
  raise notice 'Interest email: to=%, msg=%', v_owner_email, v_seeker_msg;

  return jsonb_build_object('success', true);
end;
$$;

-- ============================================================
-- REALTIME
-- ============================================================

-- Enable realtime for pins
alter publication supabase_realtime add table public.pins;
