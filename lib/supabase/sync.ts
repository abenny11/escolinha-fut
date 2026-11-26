import { createClient, isSupabaseConfigured } from './client';
import type { CadastroResponsavel } from '../cadastros-responsaveis';
import type { ProgressoAtleta } from '../faixas-evolucao';
import type { GaleriaFoto } from '../galeria';
import type { Torneio } from '../torneios';

export async function syncCadastrosToSupabase(lista: CadastroResponsavel[]) {
  if (!isSupabaseConfigured() || typeof window === 'undefined') return;
  try {
    const supabase = createClient();
    const rows = lista.map((c) => ({
      id: c.id,
      responsavel_nome: c.responsavelNome,
      responsavel_telefone: c.responsavelTelefone,
      responsavel_email: c.responsavelEmail,
      senha: c.senha,
      crianca_nome: c.criancaNome,
      crianca_idade: c.criancaIdade,
      categoria: c.categoria,
      status: c.status,
      ficha_completa: c.fichaCompleta ?? null,
      criado_em: c.criadoEm,
      aprovado_em: c.aprovadoEm ?? null,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from('fut_cadastros_responsaveis').upsert(rows, { onConflict: 'id' });
  } catch {
    // fallback silencioso para localStorage
  }
}

export async function fetchCadastrosFromSupabase(): Promise<CadastroResponsavel[] | null> {
  if (!isSupabaseConfigured() || typeof window === 'undefined') return null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('fut_cadastros_responsaveis')
      .select('*')
      .order('criado_em', { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data.map((row) => ({
      id: row.id,
      responsavelNome: row.responsavel_nome,
      responsavelTelefone: row.responsavel_telefone,
      responsavelEmail: row.responsavel_email,
      senha: row.senha,
      criancaNome: row.crianca_nome,
      criancaIdade: row.crianca_idade,
      categoria: row.categoria,
      status: row.status,
      criadoEm: row.criado_em,
      aprovadoEm: row.aprovado_em ?? undefined,
      fichaCompleta: row.ficha_completa ?? undefined,
    }));
  } catch {
    return null;
  }
}

export async function syncFaixasToSupabase(lista: ProgressoAtleta[]) {
  if (!isSupabaseConfigured() || typeof window === 'undefined') return;
  try {
    const supabase = createClient();
    const rows = lista.map((p) => ({
      student_id: p.studentId,
      student_name: p.studentName,
      categoria: p.categoria,
      pontos: p.pontos,
      faixa_id: p.faixaId,
      historico: p.historico,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from('fut_faixas_progresso').upsert(rows, { onConflict: 'student_id' });
  } catch {
    // fallback silencioso
  }
}

export async function syncTorneiosToSupabase(lista: Torneio[]) {
  if (!isSupabaseConfigured() || typeof window === 'undefined') return;
  try {
    const supabase = createClient();
    const rows = lista.map((t) => ({
      id: t.id,
      nome: t.nome,
      data_evento: t.inicio ?? null,
      payload: t,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from('fut_torneios').upsert(rows, { onConflict: 'id' });
  } catch {
    // fallback silencioso
  }
}

export async function syncGaleriaToSupabase(fotos: GaleriaFoto[]) {
  if (!isSupabaseConfigured() || typeof window === 'undefined') return;
  try {
    const supabase = createClient();
    const rows = fotos.map((f, idx) => ({
      id: f.id,
      src: f.src,
      alt: f.alt,
      titulo: f.titulo,
      desc_texto: f.desc,
      ordem: idx,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from('fut_galeria_fotos').upsert(rows, { onConflict: 'id' });
  } catch {
    // fallback silencioso
  }
}
