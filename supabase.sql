-- NumCode backend. Paste this whole file into Supabase > SQL Editor > Run.
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default 'Student',
  role text not null default 'student' check (role in ('student','teacher')),
  points int not null default 0,
  created_at timestamptz default now()
);
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  questions jsonb not null,
  created_by uuid not null references auth.users,
  created_at timestamptz default now()
);
create table public.results (
  id uuid primary key default gen_random_uuid(),
  quiz_code text not null,
  quiz_title text not null,
  student_id uuid not null references auth.users,
  student_name text not null,
  score int not null check (score >= 0),
  total int not null check (total > 0),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.quizzes enable row level security;
alter table public.results enable row level security;

create function public.is_teacher() returns boolean language sql security definer set search_path = public as
$$ select exists (select 1 from profiles where id = auth.uid() and role = 'teacher') $$;

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as
$$ begin
  insert into profiles (id, name, role) values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'name',''), 'Student'),
    case when new.raw_user_meta_data->>'role' = 'teacher' then 'teacher' else 'student' end);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.get_quiz(p_code text) returns table (code text, title text, questions jsonb)
language sql security definer set search_path = public as
$$ select q.code, q.title, q.questions from quizzes q where q.code = upper(p_code) $$;

create function public.add_points() returns trigger language plpgsql security definer set search_path = public as
$$ begin update profiles set points = points + new.score where id = new.student_id; return new; end $$;
create trigger on_result_added after insert on public.results for each row execute function public.add_points();

-- Policies (students cannot change their own role or points: there is no update policy)
create policy "own profile" on public.profiles for select using (id = auth.uid());
create policy "teacher reads own quizzes" on public.quizzes for select using (created_by = auth.uid());
create policy "anyone creates quizzes" on public.quizzes for insert with check (created_by = auth.uid());
create policy "teacher deletes own quizzes" on public.quizzes for delete using (created_by = auth.uid());
create policy "student saves own result" on public.results for insert with check (student_id = auth.uid());
create policy "read own or own-quiz results" on public.results for select using (
  student_id = auth.uid() or exists (select 1 from quizzes q where q.code = results.quiz_code and q.created_by = auth.uid())
);

-- Lesson progress that follows a student across devices
create table if not exists public.lesson_progress (
  student_id uuid not null references auth.users on delete cascade,
  lesson_id text not null,
  primary key (student_id, lesson_id)
);
alter table public.lesson_progress enable row level security;
drop policy if exists "own progress" on public.lesson_progress;
create policy "own progress" on public.lesson_progress for all using (student_id = auth.uid()) with check (student_id = auth.uid());
