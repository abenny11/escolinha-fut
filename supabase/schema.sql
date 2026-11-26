-- ============================================================================
-- Schema Unificado: Escola de Futebol Grêmio Concórdia
-- Compartilhado entre Web (escolinha-fut) e App Android/iOS (escolinha-fut-mobile)
-- Execute este arquivo no SQL Editor do seu projeto Supabase.
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. Pré-cadastros de responsáveis e ficha completa da criança
create table if not exists public.fut_cadastros_responsaveis (
  id text primary key,
  responsavel_nome text not null,
  responsavel_telefone text not null,
  responsavel_email text not null unique,
  senha text not null,
  crianca_nome text not null,
  crianca_idade integer not null,
  categoria text not null,
  status text not null default 'pendente' check (status in ('pendente', 'aprovado', 'recusado')),
  ficha_completa jsonb,
  criado_em timestamptz not null default now(),
  aprovado_em timestamptz,
  updated_at timestamptz not null default now()
);

-- 2. Evolução por faixas de idade (Sub-5/Sub-7 até Avaliação Grêmio FBPA)
create table if not exists public.fut_faixas_progresso (
  student_id text primary key,
  student_name text not null,
  categoria text not null,
  pontos integer not null default 0,
  faixa_id text not null default 'sub7',
  historico jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- 3. Torneios, jogos ao vivo, eventos e súmulas
create table if not exists public.fut_torneios (
  id text primary key,
  nome text not null,
  data_evento text,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

-- 4. Galeria oficial de fotos da escolinha
create table if not exists public.fut_galeria_fotos (
  id text primary key,
  src text not null,
  alt text not null,
  titulo text not null,
  desc_texto text not null,
  ordem integer not null default 0,
  updated_at timestamptz not null default now()
);

-- 5. Configurações gerais (cores, dados da unidade, WhatsApp)
create table if not exists public.fut_configuracoes (
  chave text primary key,
  valor jsonb not null,
  updated_at timestamptz not null default now()
);

-- 6. Assinaturas / Planos sincronizados entre App Android/iOS e Web
create table if not exists public.fut_app_assinaturas (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  plano_id text not null default 'free',
  plataforma text not null default 'android',
  receipt_id text,
  status text not null default 'active',
  atualizado_em timestamptz not null default now()
);

-- Habilita RLS (Row Level Security)
alter table public.fut_cadastros_responsaveis enable row level security;
alter table public.fut_faixas_progresso enable row level security;
alter table public.fut_torneios enable row level security;
alter table public.fut_galeria_fotos enable row level security;
alter table public.fut_configuracoes enable row level security;
alter table public.fut_app_assinaturas enable row level security;

-- Políticas de acesso para o aplicativo Web + Mobile (anon e authenticated)
drop policy if exists "Acesso total app cadastros" on public.fut_cadastros_responsaveis;
create policy "Acesso total app cadastros"
  on public.fut_cadastros_responsaveis for all
  using (true) with check (true);

drop policy if exists "Acesso total app faixas" on public.fut_faixas_progresso;
create policy "Acesso total app faixas"
  on public.fut_faixas_progresso for all
  using (true) with check (true);

drop policy if exists "Acesso total app torneios" on public.fut_torneios;
create policy "Acesso total app torneios"
  on public.fut_torneios for all
  using (true) with check (true);

drop policy if exists "Acesso total app galeria" on public.fut_galeria_fotos;
create policy "Acesso total app galeria"
  on public.fut_galeria_fotos for all
  using (true) with check (true);

drop policy if exists "Acesso total app configuracoes" on public.fut_configuracoes;
create policy "Acesso total app configuracoes"
  on public.fut_configuracoes for all
  using (true) with check (true);

drop policy if exists "Acesso total app assinaturas" on public.fut_app_assinaturas;
create policy "Acesso total app assinaturas"
  on public.fut_app_assinaturas for all
  using (true) with check (true);

-- Realtime para placar ao vivo e aprovações em tempo real
do $$
begin
  alter publication supabase_realtime add table public.fut_torneios;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.fut_cadastros_responsaveis;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.fut_faixas_progresso;
exception when duplicate_object then null;
end $$;
