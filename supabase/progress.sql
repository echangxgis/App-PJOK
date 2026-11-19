-- Apply after schema.sql. Keep the allowlist in sync with js/data.js materials.
begin;

create table if not exists public.pjok_material_progress (
  student_id uuid not null references public.pjok_students(id) on delete cascade,
  material_id text not null check (material_id in (
    'pengenalan', 'lapangan', 'aturan', 'teknik-siap', 'passing-bawah',
    'passing-atas', 'servis-bawah', 'servis-atas', 'mengumpan', 'serangan',
    'komunikasi', 'taktik', 'keselamatan', 'sportivitas'
  )),
  primary key (student_id, material_id)
);

alter table public.pjok_material_progress enable row level security;
revoke all on public.pjok_material_progress from public, anon, authenticated;
grant select on public.pjok_material_progress to authenticated;
drop policy if exists teacher_material_progress on public.pjok_material_progress;
create policy teacher_material_progress on public.pjok_material_progress
  for select to authenticated using (
    exists (select 1 from public.pjok_teachers where user_id = (select auth.uid()))
  );

-- No-PIN reports are self-reported, not proof of identity or completion.
create or replace function public.pjok_merge_material_progress(p_student_id uuid, p_completed text[])
returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_completed is null or cardinality(p_completed) not between 1 and 14
     or array_ndims(p_completed) <> 1 then
    raise exception 'Daftar materi tidak valid' using errcode = '22023';
  end if;
  if not exists (select 1 from public.pjok_students where id = p_student_id) then
    raise exception 'Murid tidak ditemukan' using errcode = '22023';
  end if;

  -- NOT NULL and the allowlist constraint reject malformed IDs atomically.
  insert into public.pjok_material_progress (student_id, material_id)
    select p_student_id, material_id from unnest(p_completed) as m(material_id)
    on conflict (student_id, material_id) do nothing;
end;
$$;
revoke all on function public.pjok_merge_material_progress(uuid, text[]) from public, anon, authenticated;
grant execute on function public.pjok_merge_material_progress(uuid, text[]) to anon, authenticated;

commit;
