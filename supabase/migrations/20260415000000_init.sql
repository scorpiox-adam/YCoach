create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create type public.goal as enum ('weight_loss', 'muscle_gain', 'recomposition', 'performance');
create type public.level as enum ('beginner', 'intermediate', 'advanced');
create type public.sync_status as enum ('queued', 'syncing', 'synced', 'failed');
create type public.recommendation_status as enum ('proposed', 'accepted', 'refused');
create type public.meal_source as enum ('manual', 'ai');
create type public.entity_origin as enum ('standard', 'custom');
create type public.workout_status as enum ('planned', 'in_progress', 'completed', 'skipped');
create type public.checkin_context as enum ('weekly', 'ad_hoc', 'recovery');
create type public.reminder_type as enum ('workout', 'meal', 'weekly_review', 'coach');
create type public.ai_availability as enum ('ready', 'missing_key', 'invalid_key', 'offline', 'degraded');

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  goal public.goal not null default 'recomposition',
  level public.level not null default 'intermediate',
  equipment text[] not null default '{}',
  constraints text[] not null default '{}',
  nutrition_preferences text[] not null default '{}',
  weekly_availability text[] not null default '{}',
  units text not null default 'metric',
  tone text not null default 'bienveillant_direct',
  weight_kg numeric(5,2),
  height_cm integer,
  age integer,
  streak_count integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  reminders_enabled boolean not null default true,
  theme text not null default 'light',
  ai_availability public.ai_availability not null default 'missing_key',
  openai_api_key_encrypted text,
  preferred_language text not null default 'fr-FR',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.training_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  goal public.goal not null,
  level text not null,
  frequency integer not null,
  structure jsonb not null default '[]'::jsonb,
  origin public.entity_origin not null default 'standard',
  owner_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.training_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.training_templates(id) on delete set null,
  name text not null,
  version integer not null default 1,
  status text not null default 'active',
  weekly_structure jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  muscle_group text not null,
  secondary_muscles text[] not null default '{}',
  equipment text not null,
  description text not null,
  variants text[] not null default '{}',
  origin public.entity_origin not null default 'standard',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.planned_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  training_plan_id uuid not null references public.training_plans(id) on delete cascade,
  day_label text not null,
  name text not null,
  scheduled_for date not null,
  status public.workout_status not null default 'planned',
  duration_minutes integer not null default 60,
  notes text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.planned_workout_exercises (
  id uuid primary key default gen_random_uuid(),
  planned_workout_id uuid not null references public.planned_workouts(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  sort_order integer not null,
  target_sets integer not null default 3,
  target_reps text not null default '8-10',
  target_rest_seconds integer not null default 120,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  planned_workout_id uuid references public.planned_workouts(id) on delete set null,
  performed_at timestamptz not null default timezone('utc'::text, now()),
  status public.workout_status not null default 'completed',
  notes text,
  summary text,
  client_mutation_id text unique,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.set_logs (
  id uuid primary key default gen_random_uuid(),
  workout_session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  set_number integer not null,
  reps integer,
  load_kg numeric(6,2),
  rest_seconds integer,
  effort integer,
  completed boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  calories integer not null,
  protein_grams integer not null,
  carbs_grams integer not null,
  fats_grams integer not null,
  valid_from date not null,
  valid_until date,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.food_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  calories integer not null,
  protein numeric(6,2) not null default 0,
  carbs numeric(6,2) not null default 0,
  fats numeric(6,2) not null default 0,
  fiber numeric(6,2) not null default 0,
  portion_grams integer not null default 100,
  origin public.entity_origin not null default 'standard',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.saved_meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.saved_meal_items (
  id uuid primary key default gen_random_uuid(),
  saved_meal_id uuid not null references public.saved_meals(id) on delete cascade,
  food_item_id uuid not null references public.food_items(id) on delete restrict,
  quantity numeric(8,2) not null default 1,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.meal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meal_name text not null,
  eaten_at timestamptz not null default timezone('utc'::text, now()),
  source public.meal_source not null default 'manual',
  confidence numeric(4,2) not null default 1,
  user_validated boolean not null default true,
  client_mutation_id text unique,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.meal_entry_items (
  id uuid primary key default gen_random_uuid(),
  meal_entry_id uuid not null references public.meal_entries(id) on delete cascade,
  food_item_id uuid references public.food_items(id) on delete set null,
  label text not null,
  quantity numeric(8,2) not null default 1,
  calories integer not null,
  protein numeric(6,2) not null default 0,
  carbs numeric(6,2) not null default 0,
  fats numeric(6,2) not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.recovery_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sleep integer not null,
  energy integer not null,
  fatigue integer not null,
  soreness integer not null,
  comment text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.progress_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  happened_at timestamptz not null default timezone('utc'::text, now()),
  weight_kg numeric(5,2),
  note text,
  context public.checkin_context not null default 'weekly',
  recovery_checkin_id uuid references public.recovery_checkins(id) on delete set null,
  client_mutation_id text unique,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.progress_checkin_photos (
  id uuid primary key default gen_random_uuid(),
  progress_checkin_id uuid not null references public.progress_checkins(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  context text not null,
  suggestion text not null,
  justification text not null,
  expected_impact text,
  status public.recommendation_status not null default 'proposed',
  source_rule text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.coach_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Coach IA',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.coach_threads(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.weekly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  summary jsonb not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.reminder_type not null,
  label text not null,
  schedule text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.sync_queue_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity text not null,
  action text not null,
  payload jsonb not null,
  attempts integer not null default 0,
  last_attempt_at timestamptz,
  status public.sync_status not null default 'queued',
  client_mutation_id text not null unique,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table public.product_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, first_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'first_name', ''));

  insert into public.user_settings (user_id)
  values (new.id);

  insert into public.coach_threads (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

do $$
declare
  t record;
begin
  for t in
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tablename in (
        'user_profiles', 'user_settings', 'training_templates', 'training_plans', 'exercises',
        'planned_workouts', 'planned_workout_exercises', 'workout_sessions', 'set_logs',
        'nutrition_targets', 'food_items', 'saved_meals', 'saved_meal_items', 'meal_entries',
        'meal_entry_items', 'recovery_checkins', 'progress_checkins', 'progress_checkin_photos',
        'ai_recommendations', 'coach_threads', 'coach_messages', 'weekly_summaries',
        'reminders', 'sync_queue_items', 'product_events'
      )
  loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;

create policy "profiles are private"
on public.user_profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "settings are private"
on public.user_settings for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "templates standard or owned"
on public.training_templates for select
using (origin = 'standard' or owner_id = auth.uid());

create policy "templates owned mutable"
on public.training_templates for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "plans owned"
on public.training_plans for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "exercises standard or owned"
on public.exercises for select
using (origin = 'standard' or owner_id = auth.uid());

create policy "exercises owned mutable"
on public.exercises for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "planned workouts owned"
on public.planned_workouts for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "planned workout exercises owned via workout"
on public.planned_workout_exercises for all
using (
  exists (
    select 1
    from public.planned_workouts pw
    where pw.id = planned_workout_id
      and pw.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.planned_workouts pw
    where pw.id = planned_workout_id
      and pw.user_id = auth.uid()
  )
);

create policy "user owned generic access"
on public.workout_sessions for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "set logs owned via session"
on public.set_logs for all
using (
  exists (
    select 1
    from public.workout_sessions ws
    where ws.id = workout_session_id
      and ws.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workout_sessions ws
    where ws.id = workout_session_id
      and ws.user_id = auth.uid()
  )
);

create policy "targets owned"
on public.nutrition_targets for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "foods standard or owned"
on public.food_items for select
using (origin = 'standard' or owner_id = auth.uid());

create policy "foods owned mutable"
on public.food_items for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "saved meals owned"
on public.saved_meals for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "saved meal items owned via parent"
on public.saved_meal_items for all
using (
  exists (
    select 1 from public.saved_meals sm
    where sm.id = saved_meal_id and sm.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.saved_meals sm
    where sm.id = saved_meal_id and sm.user_id = auth.uid()
  )
);

create policy "meal entries owned"
on public.meal_entries for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "meal items owned via meal entry"
on public.meal_entry_items for all
using (
  exists (
    select 1 from public.meal_entries me
    where me.id = meal_entry_id and me.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.meal_entries me
    where me.id = meal_entry_id and me.user_id = auth.uid()
  )
);

create policy "recovery checkins owned"
on public.recovery_checkins for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "progress checkins owned"
on public.progress_checkins for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "progress photos owned via checkin"
on public.progress_checkin_photos for all
using (
  exists (
    select 1 from public.progress_checkins pc
    where pc.id = progress_checkin_id and pc.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.progress_checkins pc
    where pc.id = progress_checkin_id and pc.user_id = auth.uid()
  )
);

create policy "recommendations owned"
on public.ai_recommendations for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "threads owned"
on public.coach_threads for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "messages owned via thread"
on public.coach_messages for all
using (
  exists (
    select 1 from public.coach_threads ct
    where ct.id = thread_id and ct.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.coach_threads ct
    where ct.id = thread_id and ct.user_id = auth.uid()
  )
);

create policy "weekly summaries owned"
on public.weekly_summaries for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "reminders owned"
on public.reminders for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "sync items owned"
on public.sync_queue_items for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "product events owned"
on public.product_events for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

create policy "progress photos are private"
on storage.objects for select
using (bucket_id = 'progress-photos' and owner = auth.uid());

create policy "users can upload progress photos"
on storage.objects for insert
with check (bucket_id = 'progress-photos' and owner = auth.uid());

create policy "users can update their progress photos"
on storage.objects for update
using (bucket_id = 'progress-photos' and owner = auth.uid())
with check (bucket_id = 'progress-photos' and owner = auth.uid());

create policy "users can delete their progress photos"
on storage.objects for delete
using (bucket_id = 'progress-photos' and owner = auth.uid());

do $$
declare
  t record;
begin
  for t in
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tablename in (
        'user_profiles', 'user_settings', 'training_templates', 'training_plans', 'exercises',
        'planned_workouts', 'workout_sessions', 'food_items', 'saved_meals', 'meal_entries',
        'progress_checkins', 'ai_recommendations', 'coach_threads', 'weekly_summaries',
        'reminders', 'sync_queue_items'
      )
  loop
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute procedure public.set_updated_at()', t.tablename, t.tablename);
  end loop;
end $$;
