-- Run in Supabase SQL Editor. No real student names in this file.
create table if not exists public.pjok_students (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 class_name text not null,
 grade integer not null default 4 check (grade between 4 and 6),
 unique(class_name, name)
);
create table if not exists public.pjok_teachers (
 user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.pjok_entries (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.pjok_students(id),
 entered_at timestamptz not null default now()
);
alter table public.pjok_students enable row level security;
alter table public.pjok_teachers enable row level security;
alter table public.pjok_entries enable row level security;
revoke all on public.pjok_students, public.pjok_teachers, public.pjok_entries from anon, authenticated;
grant select on public.pjok_students, public.pjok_teachers, public.pjok_entries to authenticated;
drop policy if exists teacher_self on public.pjok_teachers;
create policy teacher_self on public.pjok_teachers for select to authenticated using (user_id = auth.uid());
drop policy if exists teacher_students on public.pjok_students;
create policy teacher_students on public.pjok_students for select to authenticated using (exists(select 1 from public.pjok_teachers where user_id=auth.uid()));
drop policy if exists teacher_entries on public.pjok_entries;
create policy teacher_entries on public.pjok_entries for select to authenticated using (exists(select 1 from public.pjok_teachers where user_id=auth.uid()));
create or replace function public.pjok_roster() returns table(id uuid,name text,class_name text,grade integer)
language sql security definer set search_path = public as $$
 select id,name,class_name,grade from public.pjok_students order by class_name,name;
$$;
create or replace function public.pjok_enter(p_student_id uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare entry_id uuid;
begin
 if not exists(select 1 from public.pjok_students where id=p_student_id) then
 raise exception 'Murid tidak ditemukan';
 end if;
 insert into public.pjok_entries(student_id) values(p_student_id) returning id into entry_id;
 return entry_id;
end;
$$;
revoke all on function public.pjok_roster() from public;
revoke all on function public.pjok_enter(uuid) from public;
grant execute on function public.pjok_roster(), public.pjok_enter(uuid) to anon, authenticated;
-- Name selection is NOT verified authentication. Entries can be impersonated.
