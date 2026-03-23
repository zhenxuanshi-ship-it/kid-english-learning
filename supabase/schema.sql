-- ============================================================
-- 儿童英语学习 App — Supabase 数据库结构
-- 运行方式：Supabase Dashboard → SQL Editor → 粘贴执行
-- ============================================================

-- ============================================================
-- 1. profiles 表（家长账号，关联 auth.users）
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  nickname text default '家长',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 自动创建 profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. children 表（孩子档案，关联到家长）
-- ============================================================
create table if not exists public.children (
  id uuid default gen_random_uuid() primary key,
  parent_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  avatar_emoji text default '👦',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 索引：快速按家长查孩子
create index if not exists idx_children_parent on public.children(parent_id);

-- ============================================================
-- 3. word_progress 表（单词掌握进度）
-- ============================================================
create table if not exists public.word_progress (
  id uuid default gen_random_uuid() primary key,
  child_id uuid references public.children(id) on delete cascade not null,
  word_english text not null,
  category text,
  correct_count integer default 0,
  wrong_count integer default 0,
  mastery_level integer default 0 check (mastery_level between 0 and 5),
  last_practiced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(child_id, word_english)
);

-- 索引
create index if not exists idx_word_progress_child on public.word_progress(child_id);

-- ============================================================
-- 4. daily_records 表（每日学习记录）
-- ============================================================
create table if not exists public.daily_records (
  id uuid default gen_random_uuid() primary key,
  child_id uuid references public.children(id) on delete cascade not null,
  record_date date not null default current_date,
  words_practiced integer default 0,
  correct_count integer default 0,
  wrong_count integer default 0,
  time_spent_seconds integer default 0,
  streak_days integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(child_id, record_date)
);

create index if not exists idx_daily_records_child on public.daily_records(child_id);

-- ============================================================
-- 5. sentence_progress 表（句式练习进度）
-- ============================================================
create table if not exists public.sentence_progress (
  id uuid default gen_random_uuid() primary key,
  child_id uuid references public.children(id) on delete cascade not null,
  pattern_id text not null,
  stage integer default 0,
  correct_count integer default 0,
  wrong_count integer default 0,
  last_practiced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(child_id, pattern_id)
);

create index if not exists idx_sentence_progress_child on public.sentence_progress(child_id);

-- ============================================================
-- 6. learning_sessions 表（学习会话，记录每次练习）
-- ============================================================
create table if not exists public.learning_sessions (
  id uuid default gen_random_uuid() primary key,
  child_id uuid references public.children(id) on delete cascade not null,
  session_type text not null check (session_type in ('word', 'sentence', 'review', 'game')),
  category text,
  total_questions integer default 0,
  correct_count integer default 0,
  wrong_count integer default 0,
  time_spent_seconds integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_learning_sessions_child on public.learning_sessions(child_id);
create index if not exists idx_learning_sessions_date on public.learning_sessions(created_at);

-- ============================================================
-- Row Level Security (RLS) — 数据安全规则
-- ============================================================

-- 启用 RLS
alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.word_progress enable row level security;
alter table public.daily_records enable row level security;
alter table public.sentence_progress enable row level security;
alter table public.learning_sessions enable row level security;

-- profiles: 只有本人能读写
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- children: 只有关联家长能读写
create policy "Parents can view own children"
  on children for select using (auth.uid() = parent_id);
create policy "Parents can insert own children"
  on children for insert with check (auth.uid() = parent_id);
create policy "Parents can update own children"
  on children for update using (auth.uid() = parent_id);
create policy "Parents can delete own children"
  on children for delete using (auth.uid() = parent_id);

-- word_progress: 通过 children 继承家长权限
create policy "Parents can view word progress via child"
  on word_progress for select
  using (exists (
    select 1 from public.children c
    where c.id = word_progress.child_id and c.parent_id = auth.uid()
  ));
create policy "Parents can insert word progress via child"
  on word_progress for insert
  with check (exists (
    select 1 from public.children c
    where c.id = word_progress.child_id and c.parent_id = auth.uid()
  ));
create policy "Parents can update word progress via child"
  on word_progress for update using (exists (
    select 1 from public.children c
    where c.id = word_progress.child_id and c.parent_id = auth.uid()
  ));
create policy "Parents can delete word progress via child"
  on word_progress for delete using (exists (
    select 1 from public.children c
    where c.id = word_progress.child_id and c.parent_id = auth.uid()
  ));

-- daily_records: 同上
create policy "Parents can view daily records via child"
  on daily_records for select
  using (exists (select 1 from public.children c where c.id = daily_records.child_id and c.parent_id = auth.uid()));
create policy "Parents can insert daily records via child"
  on daily_records for insert
  with check (exists (select 1 from public.children c where c.id = daily_records.child_id and c.parent_id = auth.uid()));
create policy "Parents can update daily records via child"
  on daily_records for update using (exists (select 1 from public.children c where c.id = daily_records.child_id and c.parent_id = auth.uid()));

-- sentence_progress: 同上
create policy "Parents can view sentence progress via child"
  on sentence_progress for select
  using (exists (select 1 from public.children c where c.id = sentence_progress.child_id and c.parent_id = auth.uid()));
create policy "Parents can insert sentence progress via child"
  on sentence_progress for insert
  with check (exists (select 1 from public.children c where c.id = sentence_progress.child_id and c.parent_id = auth.uid()));
create policy "Parents can update sentence progress via child"
  on sentence_progress for update using (exists (select 1 from public.children c where c.id = sentence_progress.child_id and c.parent_id = auth.uid()));

-- learning_sessions: 同上
create policy "Parents can view sessions via child"
  on learning_sessions for select
  using (exists (select 1 from public.children c where c.id = learning_sessions.child_id and c.parent_id = auth.uid()));
create policy "Parents can insert sessions via child"
  on learning_sessions for insert
  with check (exists (select 1 from public.children c where c.id = learning_sessions.child_id and c.parent_id = auth.uid()));

-- ============================================================
-- 统计视图：家长报告
-- ============================================================
create or replace view public.children_summary as
select
  c.id as child_id,
  c.name as child_name,
  c.avatar_emoji,
  c.parent_id,
  count(distinct wp.id) as words_practiced,
  count(distinct case when wp.mastery_level >= 3 then wp.id end) as words_mastered,
  count(distinct sp.id) as patterns_practiced,
  count(distinct ls.id) filter (where ls.created_at >= current_date - interval '7 days') as sessions_this_week,
  dr.streak_days,
  dr.words_practiced as words_today,
  dr.correct_count as correct_today
from public.children c
left join public.word_progress wp on wp.child_id = c.id
left join public.sentence_progress sp on sp.child_id = c.id
left join public.learning_sessions ls on ls.child_id = c.id
left join public.daily_records dr on dr.child_id = c.id and dr.record_date = current_date
group by c.id, c.name, c.avatar_emoji, c.parent_id, dr.streak_days, dr.words_practiced, dr.correct_count;
