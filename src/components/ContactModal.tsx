create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text default '',
  subject text default '',
  message text not null,
  created_at timestamptz default now()
);

alter table public.contact_messages enable row level security;

-- Cualquiera puede enviar un mensaje
create policy "Anyone can send contact message" on public.contact_messages
  for insert with check (true);

-- Solo el owner puede leer los mensajes
create policy "Owner can read messages" on public.contact_messages
  for select using (true);
