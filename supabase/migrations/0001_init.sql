-- ÓXIDO — esquema inicial + RLS
-- Pégalo en Supabase: Dashboard > SQL Editor > New query > Run.
-- Diseño: Label -> Artist -> Release -> Track -> Split, tal como lo veníamos
-- definiendo. Cada tabla trae sus políticas de Row Level Security: sin ellas,
-- con RLS activado, NADIE puede leer ni escribir nada (ese es el comportamiento
-- por defecto de Supabase) — por eso cada tabla abajo declara explícitamente
-- quién puede ver y tocar qué.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. PROFILES — un perfil por usuario de Supabase Auth, con username asignado
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  full_name text,
  role text not null default 'artist' check (role in ('admin', 'artist')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cualquiera autenticado puede ver usernames (útil para que el admin busque
-- a quién vincular un artista); cada quien solo edita su propia fila.
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Username automático al registrarse: slug del email + sufijo si ya existe.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  candidate text;
  suffix int := 0;
begin
  base_username := regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9]+', '-', 'gi');
  base_username := lower(base_username);
  candidate := base_username;

  while exists (select 1 from public.profiles where username = candidate) loop
    suffix := suffix + 1;
    candidate := base_username || '-' || suffix::text;
  end loop;

  insert into public.profiles (id, username)
  values (new.id, candidate);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. LABELS — tu sello. owner_id es el admin ("puerta trasera" completa).
-- ---------------------------------------------------------------------------

create table if not exists public.labels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  isrc_prefix text,
  created_at timestamptz not null default now()
);

alter table public.labels enable row level security;

create policy "labels_all_owner"
  on public.labels for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 3. ARTISTS — pertenecen a un label; opcionalmente vinculados a un usuario
--    (user_id) para que ese artista entre a su propio panel.
-- ---------------------------------------------------------------------------

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  label_id uuid not null references public.labels (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  slug text not null unique,
  name text not null,
  genres text[] not null default '{}',
  photo_url text,
  bio text,
  created_at timestamptz not null default now()
);

alter table public.artists enable row level security;

-- El dueño del label ve y edita todo su roster.
create policy "artists_all_label_owner"
  on public.artists for all
  to authenticated
  using (label_id in (select id from public.labels where owner_id = auth.uid()))
  with check (label_id in (select id from public.labels where owner_id = auth.uid()));

-- El artista ve su propia fila y puede actualizar solo su foto/bio.
create policy "artists_select_self"
  on public.artists for select
  to authenticated
  using (user_id = auth.uid());

create policy "artists_update_self_limited"
  on public.artists for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- El sitio público (visitantes sin sesión) solo ve artistas marcados visibles.
alter table public.artists add column if not exists is_public boolean not null default true;

create policy "artists_select_public"
  on public.artists for select
  to anon
  using (is_public = true);

-- ---------------------------------------------------------------------------
-- 4. RELEASES
-- ---------------------------------------------------------------------------

create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  label_id uuid not null references public.labels (id) on delete cascade,
  title text not null,
  format text not null default 'sencillo' check (format in ('sencillo', 'ep', 'album')),
  release_date date not null,
  cover_url text,
  upc text,
  status text not null default 'borrador'
    check (status in ('borrador', 'en_revision', 'distribuido', 'publicado')),
  created_at timestamptz not null default now()
);

alter table public.releases enable row level security;

create policy "releases_all_label_owner"
  on public.releases for all
  to authenticated
  using (label_id in (select id from public.labels where owner_id = auth.uid()))
  with check (label_id in (select id from public.labels where owner_id = auth.uid()));

-- El público (sitio, sin sesión) solo ve lanzamientos ya "publicado".
create policy "releases_select_public"
  on public.releases for select
  to anon
  using (status = 'publicado');

-- Un artista ve los releases en los que participa (vía release_artists).
create policy "releases_select_participant"
  on public.releases for select
  to authenticated
  using (
    id in (
      select ra.release_id from public.release_artists ra
      join public.artists a on a.id = ra.artist_id
      where a.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 5. RELEASE_ARTISTS — tabla puente (primario / invitado)
-- ---------------------------------------------------------------------------

create table if not exists public.release_artists (
  release_id uuid not null references public.releases (id) on delete cascade,
  artist_id uuid not null references public.artists (id) on delete cascade,
  role text not null default 'invitado' check (role in ('primario', 'invitado')),
  primary key (release_id, artist_id)
);

alter table public.release_artists enable row level security;

create policy "release_artists_all_label_owner"
  on public.release_artists for all
  to authenticated
  using (
    release_id in (
      select r.id from public.releases r
      join public.labels l on l.id = r.label_id
      where l.owner_id = auth.uid()
    )
  )
  with check (
    release_id in (
      select r.id from public.releases r
      join public.labels l on l.id = r.label_id
      where l.owner_id = auth.uid()
    )
  );

create policy "release_artists_select_public"
  on public.release_artists for select
  to anon
  using (
    release_id in (select id from public.releases where status = 'publicado')
  );

create policy "release_artists_select_participant"
  on public.release_artists for select
  to authenticated
  using (
    artist_id in (select id from public.artists where user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- 6. TRACKS
-- ---------------------------------------------------------------------------

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.releases (id) on delete cascade,
  title text not null,
  isrc text,
  track_number int not null default 1,
  duration_seconds int,
  explicit boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.tracks enable row level security;

create policy "tracks_all_label_owner"
  on public.tracks for all
  to authenticated
  using (
    release_id in (
      select r.id from public.releases r
      join public.labels l on l.id = r.label_id
      where l.owner_id = auth.uid()
    )
  )
  with check (
    release_id in (
      select r.id from public.releases r
      join public.labels l on l.id = r.label_id
      where l.owner_id = auth.uid()
    )
  );

create policy "tracks_select_public"
  on public.tracks for select
  to anon
  using (release_id in (select id from public.releases where status = 'publicado'));

create policy "tracks_select_participant"
  on public.tracks for select
  to authenticated
  using (
    release_id in (
      select ra.release_id from public.release_artists ra
      join public.artists a on a.id = ra.artist_id
      where a.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 7. SPLITS — reparto de regalías por track
-- ---------------------------------------------------------------------------

create table if not exists public.splits (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.tracks (id) on delete cascade,
  artist_id uuid references public.artists (id) on delete set null,
  contributor_name text not null,
  role text not null default 'artista',
  percentage numeric(5, 2) not null check (percentage > 0 and percentage <= 100),
  payout_email text,
  created_at timestamptz not null default now()
);

alter table public.splits enable row level security;

-- Los splits son información financiera: SOLO el dueño del label los ve/edita.
create policy "splits_all_label_owner"
  on public.splits for all
  to authenticated
  using (
    track_id in (
      select t.id from public.tracks t
      join public.releases r on r.id = t.release_id
      join public.labels l on l.id = r.label_id
      where l.owner_id = auth.uid()
    )
  )
  with check (
    track_id in (
      select t.id from public.tracks t
      join public.releases r on r.id = t.release_id
      join public.labels l on l.id = r.label_id
      where l.owner_id = auth.uid()
    )
  );

-- Un artista ve ÚNICAMENTE su propia fila de split (su porcentaje), no el de
-- los demás colaboradores del track.
create policy "splits_select_own_row"
  on public.splits for select
  to authenticated
  using (artist_id in (select id from public.artists where user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- 8. STREAMING_LINKS — links por release (Spotify, Apple Music, etc.)
-- ---------------------------------------------------------------------------

create table if not exists public.streaming_links (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.releases (id) on delete cascade,
  platform text not null,
  href text not null
);

alter table public.streaming_links enable row level security;

create policy "streaming_links_all_label_owner"
  on public.streaming_links for all
  to authenticated
  using (
    release_id in (
      select r.id from public.releases r
      join public.labels l on l.id = r.label_id
      where l.owner_id = auth.uid()
    )
  )
  with check (
    release_id in (
      select r.id from public.releases r
      join public.labels l on l.id = r.label_id
      where l.owner_id = auth.uid()
    )
  );

create policy "streaming_links_select_public"
  on public.streaming_links for select
  to anon
  using (release_id in (select id from public.releases where status = 'publicado'));

-- ---------------------------------------------------------------------------
-- Índices útiles
-- ---------------------------------------------------------------------------

create index if not exists idx_artists_label on public.artists (label_id);
create index if not exists idx_releases_label on public.releases (label_id);
create index if not exists idx_tracks_release on public.tracks (release_id);
create index if not exists idx_splits_track on public.splits (track_id);
