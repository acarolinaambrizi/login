-- Extensão para geração de UUIDs
create extension if not exists "uuid-ossp";

-- Tabela de usuários (já existente no projeto, mantida para referência)
create schema if not exists user_management;

-- Tabela de tarefas
create table user_management.todos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  completed boolean default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Habilitar Row Level Security na tabela de tarefas
alter table user_management.todos enable row level security;

-- Função para atualizar automaticamente o campo updated_at
create or replace function public.trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger que chama a função acima antes de atualizar
create trigger set_timestamp
before update on user_management.todos
for each row execute function public.trigger_set_timestamp();

-- Política: usuários só podem selecionar suas próprias tarefas
create policy "users can select own todos"
  on user_management.todos
  for select
  using (auth.uid() = user_id);

-- Política: usuários podem inserir suas próprias tarefas
create policy "users can insert own todos"
  on user_management.todos
  for insert
  with check (auth.uid() = user_id);

-- Política: usuários podem atualizar suas próprias tarefas
create policy "users can update own todos"
  on user_management.todos
  for update
  using (auth.uid() = user_id);

-- Política: usuários podem deletar suas próprias tarefas
create policy "users can delete own todos"
  on user_management.todos
  for delete
  using (auth.uid() = user_id);