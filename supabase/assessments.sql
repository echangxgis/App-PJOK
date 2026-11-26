-- Run AFTER schema.sql and progress.sql.
-- Menyimpan asesmen murid (diagnostik, sumatif, kuis, praktik, refleksi, misi, nonkognitif)
-- agar guru bisa melihatnya dari browser mana saja.
-- Tanpa PIN: data laporan diri, bukan bukti asesmen resmi.

create table if not exists public.pjok_assessment_scores (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.pjok_students(id) on delete cascade,
  category text not null check (category in ('diagnostic','summative','quiz','practice','reflection','mission','noncog')),
  item_id text not null,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  notes text,
  updated_at timestamptz not null default now(),
  unique(student_id, category, item_id)
);

alter table public.pjok_assessment_scores enable row level security;
revoke all on public.pjok_assessment_scores from public, anon, authenticated;
grant select on public.pjok_assessment_scores to authenticated;

drop policy if exists teacher_assessment_scores on public.pjok_assessment_scores;
create policy teacher_assessment_scores on public.pjok_assessment_scores
  for select to authenticated using (
    exists (select 1 from public.pjok_teachers where user_id = (select auth.uid()))
  );

-- Browser (anon) hanya boleh menulis via RPC ini, tidak boleh membaca langsung.
create or replace function public.pjok_merge_assessment_score(
  p_student_id uuid,
  p_category text,
  p_item_id text,
  p_score integer,
  p_total integer,
  p_notes text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.pjok_students where id = p_student_id) then
    raise exception 'Murid tidak ditemukan' using errcode = '22023';
  end if;

  insert into public.pjok_assessment_scores
    (student_id, category, item_id, score, total, notes, updated_at)
  values
    (p_student_id, p_category, p_item_id, p_score, p_total, p_notes, now())
  on conflict (student_id, category, item_id)
  do update set
    score = excluded.score,
    total = excluded.total,
    notes = excluded.notes,
    updated_at = now();
end;
$$;

revoke all on function public.pjok_merge_assessment_score(uuid,text,text,integer,integer,text) from public, anon, authenticated;
grant execute on function public.pjok_merge_assessment_score(uuid,text,text,integer,integer,text) to anon, authenticated;

-- Fungsi bantu untuk guru mengambil asesmen murid sekolah.
create or replace function public.pjok_get_assessment_scores(p_student_id uuid)
returns table (
  category text,
  item_id text,
  score integer,
  total integer,
  notes text,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  select category, item_id, score, total, notes, updated_at
  from public.pjok_assessment_scores
  where student_id = p_student_id
  order by updated_at desc;
end;
$$;

revoke all on function public.pjok_get_assessment_scores(uuid) from public, anon, authenticated;
grant execute on function public.pjok_get_assessment_scores(uuid) to anon, authenticated;
