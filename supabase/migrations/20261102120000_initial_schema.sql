-- MASTER КАФЕЛЬ — начальная схема базы данных.
--
-- Одна и та же миграция разворачивается и в тестовом, и в рабочем проекте
-- Supabase. Личных данных, email и ключей здесь нет: администраторы
-- добавляются отдельно (см. docs/supabase-setup.md, шаг «Администратор»).
--
-- Модель доступа:
--   * посетители (anon) читают только опубликованные проекты и их фото;
--   * администраторы (таблица admins) управляют проектами, фото и заявками;
--   * заявки записывает только серверная функция submit-lead
--     (ключ service_role обходит RLS), из браузера записать их нельзя.

-- ---------------------------------------------------------------------------
-- Администраторы
-- ---------------------------------------------------------------------------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Пользователь видит только свою строку — так админка проверяет права.
create policy "admins: read own row"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));

-- security definer: функция читает admins в обход RLS, но возвращает только
-- true/false для текущего пользователя.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Общие триггеры
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Проекты портфолио
-- ---------------------------------------------------------------------------

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  category text not null
    check (category in ('bathroom', 'kitchen', 'veranda', 'interior')),
  status text not null default 'draft'
    check (status in ('draft', 'published')),

  title_ru text not null default '',
  title_ko text not null default '',
  district_ru text not null default '',
  district_ko text not null default '',
  -- Краткое описание для карточки в списке.
  summary_ru text not null default '',
  summary_ko text not null default '',
  -- Подробная страница: исходная задача, выполненные работы, результат.
  -- В work_* каждая строка — отдельный пункт списка.
  task_ru text not null default '',
  task_ko text not null default '',
  work_ru text not null default '',
  work_ko text not null default '',
  result_ru text not null default '',
  result_ko text not null default '',

  completed_on date,
  area_m2 numeric(7, 1) check (area_m2 is null or area_m2 > 0),
  cover_photo_id uuid,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,

  -- Опубликовать можно только проект с названием и районом на обоих языках.
  constraint projects_publishable check (
    status = 'draft'
    or (
      length(trim(title_ru)) > 0 and length(trim(title_ko)) > 0
      and length(trim(district_ru)) > 0 and length(trim(district_ko)) > 0
    )
  ),
  constraint projects_text_length check (
    length(title_ru) <= 200 and length(title_ko) <= 200
    and length(district_ru) <= 100 and length(district_ko) <= 100
    and length(summary_ru) <= 400 and length(summary_ko) <= 400
    and length(task_ru) <= 4000 and length(task_ko) <= 4000
    and length(work_ru) <= 4000 and length(work_ko) <= 4000
    and length(result_ru) <= 4000 and length(result_ko) <= 4000
  )
);

create index projects_public_list_idx
  on public.projects (status, completed_on desc nulls last, created_at desc);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- Дата первой публикации ставится автоматически.
create function public.set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

create trigger projects_set_published_at
  before insert or update of status on public.projects
  for each row execute function public.set_published_at();

-- ---------------------------------------------------------------------------
-- Фотографии проектов
-- ---------------------------------------------------------------------------
-- В базе хранится путь внутри хранилища, а не полный URL: при переносе в
-- рабочий проект адрес Supabase меняется, а пути остаются верными.

create table public.project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  -- before / after образуют пары по position: before[0] + after[0] и т.д.
  kind text not null check (kind in ('before', 'after', 'gallery')),
  storage_path text not null unique,
  thumb_path text,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (project_id, id)
);

create index project_photos_project_idx
  on public.project_photos (project_id, kind, position);

-- Обложка — только фото этого же проекта; при удалении фото обложка сбрасывается.
alter table public.projects
  add constraint projects_cover_photo_fk
  foreign key (id, cover_photo_id)
  references public.project_photos (project_id, id)
  on delete set null (cover_photo_id);

-- ---------------------------------------------------------------------------
-- Заявки с формы «Расчёт стоимости»
-- ---------------------------------------------------------------------------

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null check (length(trim(name)) between 1 and 80),
  phone text not null check (length(phone) between 9 and 20),
  district text check (district is null or length(district) <= 100),
  room_type text
    check (room_type is null or room_type in ('bathroom', 'kitchen', 'veranda', 'interior')),
  area_m2 numeric(7, 1) check (area_m2 is null or area_m2 > 0),
  message text check (message is null or length(message) <= 2000),
  lang text not null default 'ru' check (lang in ('ru', 'ko')),

  -- Согласие: когда дано и на какую версию текста политики.
  consent_at timestamptz not null,
  consent_version text not null,

  status text not null default 'new'
    check (status in ('new', 'in_progress', 'done', 'spam')),
  admin_note text check (admin_note is null or length(admin_note) <= 2000),

  -- Состояние Telegram-уведомления: заявка сохраняется даже если оно не дошло,
  -- а неотправленные можно повторить.
  notified_at timestamptz,
  notify_attempts integer not null default 0,
  notify_error text,

  -- Для ограничения частоты отправки (этап 5). Хранится хэш, не сам IP.
  client_hash text
);

create index leads_created_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status, created_at desc);
create index leads_unnotified_idx on public.leads (created_at) where notified_at is null;

create table public.lead_files (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  storage_path text not null unique,
  mime_type text not null,
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 10485760),
  created_at timestamptz not null default now()
);

create index lead_files_lead_idx on public.lead_files (lead_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.projects enable row level security;
alter table public.project_photos enable row level security;
alter table public.leads enable row level security;
alter table public.lead_files enable row level security;

-- Проекты
create policy "projects: public reads published"
  on public.projects for select
  to anon, authenticated
  using (status = 'published');

create policy "projects: admin reads all"
  on public.projects for select
  to authenticated
  using ((select public.is_admin()));

create policy "projects: admin inserts"
  on public.projects for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "projects: admin updates"
  on public.projects for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "projects: admin deletes"
  on public.projects for delete
  to authenticated
  using ((select public.is_admin()));

-- Фото проектов
create policy "photos: public reads photos of published projects"
  on public.project_photos for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );

create policy "photos: admin reads all"
  on public.project_photos for select
  to authenticated
  using ((select public.is_admin()));

create policy "photos: admin inserts"
  on public.project_photos for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "photos: admin updates"
  on public.project_photos for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "photos: admin deletes"
  on public.project_photos for delete
  to authenticated
  using ((select public.is_admin()));

-- Заявки: только чтение, изменение статуса и удаление администратором.
-- Политики insert нет намеренно — запись идёт через серверную функцию.
create policy "leads: admin reads"
  on public.leads for select
  to authenticated
  using ((select public.is_admin()));

create policy "leads: admin updates"
  on public.leads for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "leads: admin deletes"
  on public.leads for delete
  to authenticated
  using ((select public.is_admin()));

create policy "lead files: admin reads"
  on public.lead_files for select
  to authenticated
  using ((select public.is_admin()));

create policy "lead files: admin deletes"
  on public.lead_files for delete
  to authenticated
  using ((select public.is_admin()));

-- Посетителям не нужны права на изменение таблиц вовсе (вторая линия защиты
-- на случай ошибки в политиках).
revoke insert, update, delete on public.projects, public.project_photos,
  public.leads, public.lead_files, public.admins from anon;
revoke select on public.leads, public.lead_files, public.admins from anon;

-- ---------------------------------------------------------------------------
-- Хранилище файлов (Storage)
-- ---------------------------------------------------------------------------
-- project-photos: публичное чтение по прямой ссылке (имена файлов — UUID),
--   загрузка и удаление только администратором. Браузер сжимает фото в WebP
--   перед загрузкой, поэтому лимит небольшой.
-- lead-files: закрытое; читает только администратор по временной ссылке,
--   записывает только серверная функция submit-lead.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-photos', 'project-photos', true, 5242880,
    array['image/webp', 'image/jpeg', 'image/png']),
  ('lead-files', 'lead-files', false, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
on conflict (id) do nothing;

create policy "project photos: admin reads"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'project-photos' and (select public.is_admin()));

create policy "project photos: admin uploads"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-photos' and (select public.is_admin()));

create policy "project photos: admin updates"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-photos' and (select public.is_admin()))
  with check (bucket_id = 'project-photos' and (select public.is_admin()));

create policy "project photos: admin deletes"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-photos' and (select public.is_admin()));

create policy "lead files: admin reads"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'lead-files' and (select public.is_admin()));

create policy "lead files: admin deletes"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'lead-files' and (select public.is_admin()));
