import { mockStudents } from './mock-data';

export type FormatoTorneio = 'mata-mata' | 'pontos';
export type StatusTorneio = 'inscricoes' | 'andamento' | 'encerrado';
export type StatusJogo = 'agendado' | 'ao_vivo' | 'intervalo' | 'finalizado' | 'wo';
export type TipoEvento =
  | 'gol'
  | 'gol_contra'
  | 'cartao_amarelo'
  | 'cartao_vermelho'
  | 'falta'
  | 'substituicao'
  | 'ocorrencia';

export interface Torneio {
  id: string;
  codigo: string;
  nome: string;
  modalidade: string;
  modalidade_nome?: string;
  categoria?: string;
  formato: FormatoTorneio;
  inicio?: string;
  fim?: string;
  local?: string;
  valor_inscricao: number;
  max_times: number;
  duracao_tempo_min: number;
  status: StatusTorneio;
  premio?: string;
  regras?: string;
  criado_em: string;
}

export interface TorneioTime {
  id: string;
  torneio_id: string;
  nome: string;
  tecnico?: string;
  telefone?: string;
  cor_uniforme?: string;
  pago: boolean;
  criado_em: string;
}

export interface TorneioAtleta {
  id: string;
  torneio_id: string;
  time_id: string;
  student_id?: string;
  nome: string;
  camisa?: number;
  posicao?: string;
  titular: boolean;
}

export interface TorneioJogo {
  id: string;
  torneio_id: string;
  rodada: number;
  ordem: number;
  time_a: string | null;
  time_b: string | null;
  gols_a: number | null;
  gols_b: number | null;
  penaltis_a: number | null;
  penaltis_b: number | null;
  faltas_a: number;
  faltas_b: number;
  quando?: string;
  local?: string;
  status: StatusJogo;
  ao_vivo_inicio?: string | null;
  ao_vivo_periodo: number;
  ao_vivo_segundos_acumulados: number;
  ao_vivo_pausado: boolean;
}

export interface EscalacaoItem {
  atleta_id?: string;
  nome: string;
  camisa?: number;
  posicao?: string;
  titular: boolean;
}

export interface TorneioSumula {
  id: string;
  torneio_id: string;
  jogo_id: string;
  arbitro?: string;
  auxiliar_1?: string;
  auxiliar_2?: string;
  mesario?: string;
  local?: string;
  data_realizacao?: string;
  hora_inicio?: string;
  hora_termino?: string;
  escalacao_a: EscalacaoItem[];
  escalacao_b: EscalacaoItem[];
  ocorrencias?: string;
  assinatura_arbitro?: string;
  assinatura_tecnico_a?: string;
  assinatura_tecnico_b?: string;
  ocr_texto_bruto?: string;
  status: 'rascunho' | 'finalizada';
  finalizada_em?: string;
}

export interface TorneioEvento {
  id: string;
  torneio_id: string;
  jogo_id: string;
  time_id: string | null;
  atleta_id?: string;
  atleta_nome?: string;
  atleta_secundario_id?: string;
  atleta_secundario_nome?: string;
  tipo: TipoEvento;
  minuto: number | null;
  periodo: number;
  observacao?: string;
  criado_em: string;
}

export interface TorneiosStore {
  torneios: Torneio[];
  times: TorneioTime[];
  atletas: TorneioAtleta[];
  jogos: TorneioJogo[];
  sumulas: TorneioSumula[];
  eventos: TorneioEvento[];
}

export interface TabelaLinha {
  id: string;
  nome: string;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  gols_pro: number;
  gols_contra: number;
  saldo: number;
  pontos: number;
}

export interface ArtilheiroLinha {
  chave: string;
  nome: string;
  time_nome: string;
  gols: number;
  assistencias: number;
}

export interface DisciplinaLinha {
  chave: string;
  nome: string;
  time_nome: string;
  amarelos: number;
  vermelhos: number;
  faltas: number;
  suspenso: boolean;
}

// ============================================================
// Regras, Premiação e Modalidades (padrão Arenax1)
// ============================================================

export type ItemPremio = { pos: string; descricao: string };
export type EstruturaPremio = { posicoes: ItemPremio[]; obs?: string };

export function parsePremio(premio?: string | null): EstruturaPremio {
  if (!premio?.trim()) return { posicoes: [] };
  try {
    const parsed = JSON.parse(premio);
    if (parsed && Array.isArray(parsed.posicoes)) return parsed;
  } catch {
    // fallback texto simples
  }
  return { posicoes: [{ pos: 'Campeão', descricao: premio.trim() }] };
}

export type ItemRegra = { titulo: string; valor: string };
export const CAMPOS_REGRAS_PADRAO = [
  {
    titulo: 'Duração da partida',
    sugestoes: {
      futebol: '2 tempos de 20 minutos (intervalo de 5 min)',
      futsal: '2 tempos de 15 minutos corridos (intervalo de 5 min)',
      society: '2 tempos de 20 minutos (intervalo de 5 min)',
      campo: '2 tempos de 30 minutos (intervalo de 10 min)',
      outro: 'Conforme cronograma da organização',
    } as Record<string, string>,
  },
  {
    titulo: 'Composição da equipe',
    sugestoes: {
      futebol: '7 jogadores titulares e até 5 reservas',
      futsal: '5 jogadores titulares e até 7 reservas',
      society: '7 jogadores titulares e até 5 reservas',
      campo: '11 jogadores titulares e até 7 reservas',
      outro: 'Equipes com atletas vinculados à escolinha',
    } as Record<string, string>,
  },
  {
    titulo: 'Critério de desempate',
    sugestoes: {
      futebol: 'Pênaltis diretos (3 cobranças alternadas)',
      futsal: 'Pênaltis diretos (3 cobranças); limite de 5 faltas por tempo',
      society: 'Shoot-out ou pênaltis diretos (3 cobranças alternadas)',
      campo: 'Pênaltis diretos (5 cobranças alternadas)',
      outro: 'Confronto direto ou decisão por pênaltis',
    } as Record<string, string>,
  },
  {
    titulo: 'Tolerância de atraso (W.O.)',
    sugestoes: {
      futebol: '10 minutos de tolerância após chamada oficial',
      futsal: '10 minutos de tolerância após chamada oficial',
      society: '10 minutos de tolerância após chamada oficial',
      campo: '15 minutos de tolerância após chamada oficial',
      outro: '10 minutos de tolerância oficial',
    } as Record<string, string>,
  },
  {
    titulo: 'Uniforme e equipamentos',
    sugestoes: {
      futebol: 'Camisas numeradas, meião e caneleira obrigatória',
      futsal: 'Tênis solado liso, meião e caneleira obrigatória',
      society: 'Chuteira society, meião e caneleira obrigatória',
      campo: 'Chuteira de campo, meião e caneleira obrigatória',
      outro: 'Equipamentos conforme regulamento da modalidade',
    } as Record<string, string>,
  },
  {
    titulo: 'Disciplina e faltas',
    sugestoes: {
      futebol: 'Dois cartões amarelos ou vermelho direto = 1 jogo de suspensão automática',
      futsal: 'Dois cartões amarelos ou vermelho direto = 1 jogo de suspensão; 6ª falta = tiro livre direto',
      society: 'Dois cartões amarelos ou vermelho direto = 1 jogo de suspensão automática',
      campo: 'Dois cartões amarelos ou vermelho direto = 1 jogo de suspensão automática',
      outro: 'Respeito aos adversários, arbitragem e comissão técnica',
    } as Record<string, string>,
  },
];

export function obterRegrasPadrao(modalidadeId = 'futebol'): ItemRegra[] {
  return CAMPOS_REGRAS_PADRAO.map((c) => ({
    titulo: c.titulo,
    valor: c.sugestoes[modalidadeId] || c.sugestoes.futebol,
  }));
}

export function formatarRegrasTexto(regras: ItemRegra[]): string {
  return regras
    .filter((r) => r.titulo.trim() && r.valor.trim())
    .map((r) => `- **${r.titulo.trim()}:** ${r.valor.trim()}`)
    .join('\n');
}

export function parseRegras(texto?: string | null): ItemRegra[] {
  if (!texto?.trim()) return [];
  return texto
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = l.match(/^(?:-\s*)?(?:\*\*)?([^:*]+)(?:\*\*)?\s*:\s*(.+)$/);
      if (m) return { titulo: m[1].trim(), valor: m[2].trim() };
      return { titulo: 'Regra', valor: l.replace(/^- /, '').trim() };
    });
}

export const MODALIDADES = [
  { id: 'futebol', nome: 'Futebol & Society' },
  { id: 'futsal', nome: 'Futsal' },
  { id: 'society', nome: 'Futebol Society (Fut7)' },
  { id: 'campo', nome: 'Futebol de Campo' },
  { id: 'outro', nome: 'Outra Modalidade' },
];

export const CATEGORIAS_ESCOLINHA = [
  'Sub-7',
  'Sub-9',
  'Sub-11',
  'Sub-13',
  'Sub-15',
  'Sub-17',
  'Sub-20',
  'Feminino',
  'Livre / Adulto',
];

export const POSICOES_ATLETA = [
  'Goleiro',
  'Zagueiro / Fixo',
  'Lateral / Ala',
  'Volante',
  'Meia',
  'Atacante / Pivô',
];

export function modalidadeNome(id?: string, custom?: string): string {
  if (id === 'outro' && custom?.trim()) return custom.trim();
  return MODALIDADES.find((m) => m.id === id)?.nome || 'Futebol & Society';
}

export function fase(rodada: number, total: number): string {
  const faltam = total - rodada;
  return faltam === 0
    ? 'Final'
    : faltam === 1
      ? 'Semifinal'
      : faltam === 2
        ? 'Quartas de final'
        : faltam === 3
          ? 'Oitavas de final'
          : `${rodada}ª rodada`;
}

export function vencedorDoJogo(j: TorneioJogo): string | null {
  if (j.time_a && !j.time_b && j.rodada === 1) return j.time_a;
  if (j.time_b && !j.time_a && j.rodada === 1) return j.time_b;
  if (j.gols_a == null || j.gols_b == null) return null;
  if (j.gols_a > j.gols_b) return j.time_a;
  if (j.gols_b > j.gols_a) return j.time_b;
  if ((j.penaltis_a ?? 0) > (j.penaltis_b ?? 0)) return j.time_a;
  if ((j.penaltis_b ?? 0) > (j.penaltis_a ?? 0)) return j.time_b;
  return null;
}

// ============================================================
// Sorteio e Avanço Automático (lógica exata do Arenax1)
// ============================================================

export function gerarJogosTorneio(torneio: Torneio, times: TorneioTime[]): TorneioJogo[] {
  const ids = [...times.map((t) => t.id)].sort(() => Math.random() - 0.5);
  const n = ids.length;
  if (n < 2) return [];

  const jogos: TorneioJogo[] = [];
  const mkId = () => `jog-${Math.random().toString(36).slice(2, 10)}`;

  if (torneio.formato === 'mata-mata') {
    let tam = 2;
    while (tam < n) tam *= 2;
    const rodadas = Math.round(Math.log2(tam));

    for (let r = rodadas; r >= 2; r--) {
      const qtd = tam / Math.pow(2, r);
      for (let g = 1; g <= qtd; g++) {
        jogos.push({
          id: mkId(),
          torneio_id: torneio.id,
          rodada: r,
          ordem: g,
          time_a: null,
          time_b: null,
          gols_a: null,
          gols_b: null,
          penaltis_a: null,
          penaltis_b: null,
          faltas_a: 0,
          faltas_b: 0,
          local: torneio.local,
          status: 'agendado',
          ao_vivo_periodo: 1,
          ao_vivo_segundos_acumulados: 0,
          ao_vivo_pausado: true,
        });
      }
    }

    for (let i = 1; i <= tam / 2; i++) {
      const ta = ids[i - 1] ?? null;
      const tb = i + tam / 2 <= n ? ids[i - 1 + tam / 2] : null;
      jogos.push({
        id: mkId(),
        torneio_id: torneio.id,
        rodada: 1,
        ordem: i,
        time_a: ta,
        time_b: tb,
        gols_a: null,
        gols_b: null,
        penaltis_a: null,
        penaltis_b: null,
        faltas_a: 0,
        faltas_b: 0,
        local: torneio.local,
        status: ta && !tb ? 'wo' : 'agendado',
        ao_vivo_periodo: 1,
        ao_vivo_segundos_acumulados: 0,
        ao_vivo_pausado: true,
      });
    }
    return avancarChaveMataMata(torneio, jogos);
  }

  // Todos contra todos (método do círculo)
  const lista: (string | null)[] = [...ids];
  if (n % 2 === 1) lista.push(null);
  const k = lista.length;
  for (let r = 1; r <= k - 1; r++) {
    for (let i = 0; i < k / 2; i++) {
      const a = lista[i];
      const b = lista[k - 1 - i];
      if (a && b) {
        jogos.push({
          id: mkId(),
          torneio_id: torneio.id,
          rodada: r,
          ordem: i + 1,
          time_a: a,
          time_b: b,
          gols_a: null,
          gols_b: null,
          penaltis_a: null,
          penaltis_b: null,
          faltas_a: 0,
          faltas_b: 0,
          local: torneio.local,
          status: 'agendado',
          ao_vivo_periodo: 1,
          ao_vivo_segundos_acumulados: 0,
          ao_vivo_pausado: true,
        });
      }
    }
    // gira mantendo o primeiro fixo
    const last = lista[k - 1];
    for (let idx = k - 1; idx >= 2; idx--) {
      lista[idx] = lista[idx - 1];
    }
    lista[1] = last;
  }
  return jogos;
}

export function avancarChaveMataMata(torneio: Torneio, jogos: TorneioJogo[]): TorneioJogo[] {
  if (torneio.formato !== 'mata-mata') return jogos;
  const copia = jogos.map((j) => ({ ...j }));
  const rodadas = [...new Set(copia.filter((j) => j.torneio_id === torneio.id).map((j) => j.rodada))].sort(
    (a, b) => a - b,
  );
  for (const r of rodadas) {
    const daRodada = copia.filter((j) => j.torneio_id === torneio.id && j.rodada === r);
    for (const j of daRodada) {
      const v = vencedorDoJogo(j);
      const proxOrdem = j.ordem % 2 === 1 ? (j.ordem + 1) / 2 : j.ordem / 2;
      const prox = copia.find(
        (x) => x.torneio_id === torneio.id && x.rodada === j.rodada + 1 && x.ordem === proxOrdem,
      );
      if (prox) {
        if (j.ordem % 2 === 1) prox.time_a = v;
        else prox.time_b = v;
      }
    }
  }
  return copia;
}

// ============================================================
// Classificação, Artilharia e Disciplina
// ============================================================

export function calcularTabela(times: TorneioTime[], jogos: TorneioJogo[]): TabelaLinha[] {
  const map = new Map<string, TabelaLinha>();
  for (const t of times) {
    map.set(t.id, {
      id: t.id,
      nome: t.nome,
      jogos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      gols_pro: 0,
      gols_contra: 0,
      saldo: 0,
      pontos: 0,
    });
  }
  for (const j of jogos) {
    if (!j.time_a || !j.time_b || j.gols_a == null || j.gols_b == null) continue;
    const a = map.get(j.time_a);
    const b = map.get(j.time_b);
    if (!a || !b) continue;
    a.jogos += 1;
    b.jogos += 1;
    a.gols_pro += j.gols_a;
    a.gols_contra += j.gols_b;
    b.gols_pro += j.gols_b;
    b.gols_contra += j.gols_a;
    if (j.gols_a > j.gols_b) {
      a.vitorias += 1;
      a.pontos += 3;
      b.derrotas += 1;
    } else if (j.gols_b > j.gols_a) {
      b.vitorias += 1;
      b.pontos += 3;
      a.derrotas += 1;
    } else {
      a.empates += 1;
      b.empates += 1;
      a.pontos += 1;
      b.pontos += 1;
    }
  }
  return Array.from(map.values())
    .map((l) => ({ ...l, saldo: l.gols_pro - l.gols_contra }))
    .sort(
      (x, y) =>
        y.pontos - x.pontos ||
        y.vitorias - x.vitorias ||
        y.saldo - x.saldo ||
        y.gols_pro - x.gols_pro ||
        x.nome.localeCompare(y.nome),
    );
}

export function calcularArtilharia(eventos: TorneioEvento[], times: TorneioTime[]): ArtilheiroLinha[] {
  const timeMap = new Map(times.map((t) => [t.id, t.nome]));
  const map = new Map<string, ArtilheiroLinha>();
  const ensure = (id: string | undefined, nome: string | undefined, timeId: string | null) => {
    const label = (nome || 'Atleta').trim();
    const chave = id ? `id:${id}` : `nome:${timeId || ''}:${label.toLowerCase()}`;
    if (!map.has(chave)) {
      map.set(chave, {
        chave,
        nome: label,
        time_nome: (timeId && timeMap.get(timeId)) || '—',
        gols: 0,
        assistencias: 0,
      });
    }
    return map.get(chave)!;
  };
  for (const e of eventos) {
    if (e.tipo === 'gol') {
      ensure(e.atleta_id, e.atleta_nome, e.time_id).gols += 1;
      if (e.atleta_secundario_id || e.atleta_secundario_nome) {
        ensure(e.atleta_secundario_id, e.atleta_secundario_nome, e.time_id).assistencias += 1;
      }
    }
  }
  return Array.from(map.values())
    .filter((a) => a.gols > 0 || a.assistencias > 0)
    .sort((a, b) => b.gols - a.gols || b.assistencias - a.assistencias || a.nome.localeCompare(b.nome));
}

export function calcularDisciplina(eventos: TorneioEvento[], times: TorneioTime[]): DisciplinaLinha[] {
  const timeMap = new Map(times.map((t) => [t.id, t.nome]));
  const map = new Map<string, DisciplinaLinha>();
  for (const e of eventos) {
    if (e.tipo !== 'cartao_amarelo' && e.tipo !== 'cartao_vermelho' && e.tipo !== 'falta') continue;
    const label = (e.atleta_nome || '').trim();
    if (!label && !e.atleta_id) continue;
    const chave = e.atleta_id ? `id:${e.atleta_id}` : `nome:${e.time_id || ''}:${label.toLowerCase()}`;
    if (!map.has(chave)) {
      map.set(chave, {
        chave,
        nome: label || 'Atleta',
        time_nome: (e.time_id && timeMap.get(e.time_id)) || '—',
        amarelos: 0,
        vermelhos: 0,
        faltas: 0,
        suspenso: false,
      });
    }
    const item = map.get(chave)!;
    if (e.tipo === 'cartao_amarelo') item.amarelos += 1;
    if (e.tipo === 'cartao_vermelho') item.vermelhos += 1;
    if (e.tipo === 'falta') item.faltas += 1;
    item.suspenso = item.vermelhos > 0 || item.amarelos >= 2;
  }
  return Array.from(map.values()).sort(
    (a, b) => b.vermelhos - a.vermelhos || b.amarelos - a.amarelos || b.faltas - a.faltas,
  );
}

// ============================================================
// OCR Parser para Súmula Impressa Fotografada
// ============================================================

export interface OcrSumulaResultado {
  gols_a?: number;
  gols_b?: number;
  arbitro?: string;
  local?: string;
  ocorrencias?: string;
  eventosDetectados: Array<{
    tipo: 'gol' | 'cartao_amarelo' | 'cartao_vermelho';
    atleta_nome: string;
    minuto: number | null;
    lado: 'a' | 'b' | null;
  }>;
  rawText: string;
}

export function parseSumulaOcr(rawText: string, nomeTimeA = '', nomeTimeB = ''): OcrSumulaResultado {
  const texto = rawText.replace(/\r/g, '');
  const linhas = texto.split('\n').map((l) => l.trim()).filter(Boolean);

  let gols_a: number | undefined;
  let gols_b: number | undefined;
  const placarMatch =
    texto.match(/placar(?:\s+final)?[:\s]*(\d{1,2})\s*[xX×-]\s*(\d{1,2})/i) ||
    texto.match(/\b(\d{1,2})\s*[xX×]\s*(\d{1,2})\b/);
  if (placarMatch) {
    gols_a = Number(placarMatch[1]);
    gols_b = Number(placarMatch[2]);
  }

  let arbitro: string | undefined;
  for (const l of linhas) {
    const m = l.match(/(?:árbitro|arbitro|juiz)(?:\s+principal)?[:\s-]+(.{3,50})/i);
    if (m) {
      arbitro = m[1].replace(/[|_]+/g, '').trim();
      break;
    }
  }

  let local: string | undefined;
  for (const l of linhas) {
    const m = l.match(/(?:local|campo|quadra|estádio|estadio)[:\s-]+(.{3,50})/i);
    if (m) {
      local = m[1].replace(/[|_]+/g, '').trim();
      break;
    }
  }

  const eventosDetectados: OcrSumulaResultado['eventosDetectados'] = [];
  const normA = nomeTimeA.toLowerCase();
  const normB = nomeTimeB.toLowerCase();

  for (const l of linhas) {
    const low = l.toLowerCase();
    const minMatch = l.match(/(\d{1,2})\s*(?:min|'|º)/i);
    const minuto = minMatch ? Number(minMatch[1]) : null;
    const lado: 'a' | 'b' | null = normA && low.includes(normA) ? 'a' : normB && low.includes(normB) ? 'b' : null;
    const cleanName = (s: string) =>
      s
        .replace(/(\d{1,2})\s*(?:min|'|º)/gi, '')
        .replace(/(?:gol|amarelo|vermelho|ca|cv|cartão|cartao)[:\s-]*/gi, '')
        .replace(/[|_•]+/g, ' ')
        .trim();

    if (/\bgol\b/i.test(l) && !/gols?\s*(pró|contra|a|b)/i.test(l)) {
      const nome = cleanName(l);
      if (nome.length >= 2) eventosDetectados.push({ tipo: 'gol', atleta_nome: nome.slice(0, 40), minuto, lado });
    } else if (/(?:cart[aã]o\s*)?amarelo|\bCA\b/i.test(l)) {
      const nome = cleanName(l);
      if (nome.length >= 2) eventosDetectados.push({ tipo: 'cartao_amarelo', atleta_nome: nome.slice(0, 40), minuto, lado });
    } else if (/(?:cart[aã]o\s*)?vermelho|\bCV\b/i.test(l)) {
      const nome = cleanName(l);
      if (nome.length >= 2) eventosDetectados.push({ tipo: 'cartao_vermelho', atleta_nome: nome.slice(0, 40), minuto, lado });
    }
  }

  let ocorrencias: string | undefined;
  const idxOc = linhas.findIndex((l) => /ocorr[êe]ncias|observa[çc][õo]es/i.test(l));
  if (idxOc >= 0) {
    ocorrencias = linhas.slice(idxOc, idxOc + 4).join('\n').replace(/ocorr[êe]ncias[:\s-]*/i, '').trim() || undefined;
  }

  return { gols_a, gols_b, arbitro, local, ocorrencias, eventosDetectados, rawText };
}

// ============================================================
// Store LocalStorage + Seed Inicial com Alunos da Escolinha
// ============================================================

const STORAGE_KEY = 'escolinha_fut_torneios_v2';

export function buildSeedStore(): TorneiosStore {
  const agora = new Date().toISOString();
  const hoje = agora.slice(0, 10);

  // =========================================================================
  // 1. CAMPEONATO INFANTIL EM ANDAMENTO (8 equipes: Quartas -> Semi -> Final)
  // =========================================================================
  const tAndamentoId = 'torn-copa-sub11';
  const tAndamento: Torneio = {
    id: tAndamentoId,
    codigo: 'COPA11',
    nome: 'Copa Escolinha Infantil Sub-11',
    modalidade: 'futebol',
    categoria: 'Sub-11',
    formato: 'mata-mata',
    inicio: hoje,
    local: 'Campo Principal — São Cristóvão',
    valor_inscricao: 0,
    max_times: 8,
    duracao_tempo_min: 20,
    status: 'andamento',
    premio: JSON.stringify({
      posicoes: [
        { pos: 'Campeão', descricao: 'Troféu + Medalhas de Ouro' },
        { pos: 'Vice-Campeão', descricao: 'Medalhas de Prata' },
        { pos: 'Artilheiro', descricao: 'Troféu Chuteira de Ouro' },
      ],
    }),
    regras: formatarRegrasTexto(obterRegrasPadrao('futebol')),
    criado_em: agora,
  };

  const timesAndamento: TorneioTime[] = [
    { id: 'tm-a1', torneio_id: tAndamentoId, nome: 'Grêmio Base Sub-11', tecnico: 'Prof. Carlos Eduardo', pago: true, criado_em: agora },
    { id: 'tm-a2', torneio_id: tAndamentoId, nome: 'Tigres do Sul', tecnico: 'Prof. Marcos Silva', pago: true, criado_em: agora },
    { id: 'tm-a3', torneio_id: tAndamentoId, nome: 'Atlético Concórdia', tecnico: 'Prof. Rafael Costa', pago: true, criado_em: agora },
    { id: 'tm-a4', torneio_id: tAndamentoId, nome: 'Raio Tricolor', tecnico: 'Prof. Lucas Lima', pago: true, criado_em: agora },
    { id: 'tm-a5', torneio_id: tAndamentoId, nome: 'Falcões FC', tecnico: 'Prof. Bruno Rocha', pago: true, criado_em: agora },
    { id: 'tm-a6', torneio_id: tAndamentoId, nome: 'Guerreiros da Bola', tecnico: 'Prof. Tiago Souza', pago: true, criado_em: agora },
    { id: 'tm-a7', torneio_id: tAndamentoId, nome: 'Vila Nova Sub-11', tecnico: 'Prof. André Alves', pago: true, criado_em: agora },
    { id: 'tm-a8', torneio_id: tAndamentoId, nome: 'Estrela Dalva', tecnico: 'Prof. Felipe Dias', pago: true, criado_em: agora },
  ];

  const atletasAndamento: TorneioAtleta[] = timesAndamento.flatMap((tm, tIdx) => {
    const baseNames = [
      mockStudents[tIdx % mockStudents.length]?.full_name || `Lucas ${tIdx + 1}`,
      mockStudents[(tIdx + 3) % mockStudents.length]?.full_name || `Pedro ${tIdx + 1}`,
      mockStudents[(tIdx + 6) % mockStudents.length]?.full_name || `Gabriel ${tIdx + 1}`,
      mockStudents[(tIdx + 9) % mockStudents.length]?.full_name || `Matheus ${tIdx + 1}`,
    ];
    return baseNames.map((nome, aIdx) => ({
      id: `atl-a-${tIdx}-${aIdx}`,
      torneio_id: tAndamentoId,
      time_id: tm.id,
      student_id: mockStudents[(tIdx + aIdx) % mockStudents.length]?.id,
      nome,
      camisa: [1, 5, 10, 9][aIdx],
      posicao: ['Goleiro', 'Zagueiro / Fixo', 'Meia', 'Atacante / Pivô'][aIdx],
      titular: true,
    }));
  });

  const jogosAndamento: TorneioJogo[] = [
    // Quartas de Final (finalizadas)
    { id: 'ja-q1', torneio_id: tAndamentoId, rodada: 1, ordem: 1, time_a: 'tm-a1', time_b: 'tm-a2', gols_a: 3, gols_b: 1, penaltis_a: null, penaltis_b: null, faltas_a: 2, faltas_b: 4, local: 'Campo 1', status: 'finalizado', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 2400, ao_vivo_pausado: true },
    { id: 'ja-q2', torneio_id: tAndamentoId, rodada: 1, ordem: 2, time_a: 'tm-a3', time_b: 'tm-a4', gols_a: 2, gols_b: 2, penaltis_a: 4, penaltis_b: 3, faltas_a: 3, faltas_b: 3, local: 'Campo 2', status: 'finalizado', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 2400, ao_vivo_pausado: true },
    { id: 'ja-q3', torneio_id: tAndamentoId, rodada: 1, ordem: 3, time_a: 'tm-a5', time_b: 'tm-a6', gols_a: 4, gols_b: 0, penaltis_a: null, penaltis_b: null, faltas_a: 1, faltas_b: 5, local: 'Campo 1', status: 'finalizado', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 2400, ao_vivo_pausado: true },
    { id: 'ja-q4', torneio_id: tAndamentoId, rodada: 1, ordem: 4, time_a: 'tm-a7', time_b: 'tm-a8', gols_a: 1, gols_b: 2, penaltis_a: null, penaltis_b: null, faltas_a: 4, faltas_b: 2, local: 'Campo 2', status: 'finalizado', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 2400, ao_vivo_pausado: true },
    // Semifinais (1 ao vivo, 1 agendada)
    { id: 'ja-s1', torneio_id: tAndamentoId, rodada: 2, ordem: 1, time_a: 'tm-a1', time_b: 'tm-a3', gols_a: 2, gols_b: 1, penaltis_a: null, penaltis_b: null, faltas_a: 3, faltas_b: 2, local: 'Campo Principal', status: 'ao_vivo', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 1680, ao_vivo_pausado: true },
    { id: 'ja-s2', torneio_id: tAndamentoId, rodada: 2, ordem: 2, time_a: 'tm-a5', time_b: 'tm-a8', gols_a: null, gols_b: null, penaltis_a: null, penaltis_b: null, faltas_a: 0, faltas_b: 0, local: 'Campo Principal', status: 'agendado', ao_vivo_periodo: 1, ao_vivo_segundos_acumulados: 0, ao_vivo_pausado: true },
    // Final (aguardando)
    { id: 'ja-f1', torneio_id: tAndamentoId, rodada: 3, ordem: 1, time_a: null, time_b: null, gols_a: null, gols_b: null, penaltis_a: null, penaltis_b: null, faltas_a: 0, faltas_b: 0, local: 'Campo Principal', status: 'agendado', ao_vivo_periodo: 1, ao_vivo_segundos_acumulados: 0, ao_vivo_pausado: true },
  ];

  // =========================================================================
  // 2. CAMPEONATO INFANTIL JÁ ENCERRADO (8 equipes, chave completa até o campeão)
  // =========================================================================
  const tEncerradoId = 'torn-copa-sub9-enc';
  const tEncerrado: Torneio = {
    id: tEncerradoId,
    codigo: 'SUB9ENC',
    nome: '1ª Copa Grêmio Concórdia Sub-9',
    modalidade: 'futsal',
    categoria: 'Sub-9',
    formato: 'mata-mata',
    inicio: '2026-10-12',
    fim: '2026-10-20',
    local: 'Quadra Coberta — São Cristóvão',
    valor_inscricao: 0,
    max_times: 8,
    duracao_tempo_min: 15,
    status: 'encerrado',
    premio: JSON.stringify({
      posicoes: [
        { pos: 'Campeão', descricao: 'Troféu + Medalhas de Ouro (Grêmio Tricolor Sub-9)' },
        { pos: 'Vice-Campeão', descricao: 'Medalhas de Prata (Águias do Oeste)' },
        { pos: '3º Lugar', descricao: 'Medalhas de Bronze (São Cristóvão FC)' },
      ],
    }),
    regras: formatarRegrasTexto(obterRegrasPadrao('futsal')),
    criado_em: '2026-10-10T10:00:00.000Z',
  };

  const timesEncerrado: TorneioTime[] = [
    { id: 'tm-e1', torneio_id: tEncerradoId, nome: 'Grêmio Tricolor Sub-9', tecnico: 'Prof. Carlos Eduardo', pago: true, criado_em: agora },
    { id: 'tm-e2', torneio_id: tEncerradoId, nome: 'Leões de Concórdia', tecnico: 'Prof. Marcos Silva', pago: true, criado_em: agora },
    { id: 'tm-e3', torneio_id: tEncerradoId, nome: 'São Cristóvão FC', tecnico: 'Prof. Rafael Costa', pago: true, criado_em: agora },
    { id: 'tm-e4', torneio_id: tEncerradoId, nome: 'Furacão da Serra', tecnico: 'Prof. Lucas Lima', pago: true, criado_em: agora },
    { id: 'tm-e5', torneio_id: tEncerradoId, nome: 'Águias do Oeste', tecnico: 'Prof. Bruno Rocha', pago: true, criado_em: agora },
    { id: 'tm-e6', torneio_id: tEncerradoId, nome: 'Estrela Azul', tecnico: 'Prof. Tiago Souza', pago: true, criado_em: agora },
    { id: 'tm-e7', torneio_id: tEncerradoId, nome: 'União Infantil', tecnico: 'Prof. André Alves', pago: true, criado_em: agora },
    { id: 'tm-e8', torneio_id: tEncerradoId, nome: 'Craques do Futuro', tecnico: 'Prof. Felipe Dias', pago: true, criado_em: agora },
  ];

  const atletasEncerrado: TorneioAtleta[] = timesEncerrado.flatMap((tm, tIdx) =>
    ['Enzo', 'Arthur', 'Davi', 'Bernardo'].map((pre, aIdx) => ({
      id: `atl-e-${tIdx}-${aIdx}`,
      torneio_id: tEncerradoId,
      time_id: tm.id,
      nome: `${pre} ${['Silva', 'Souza', 'Oliveira', 'Santos'][aIdx]}`,
      camisa: [1, 4, 8, 9][aIdx],
      posicao: ['Goleiro', 'Zagueiro / Fixo', 'Lateral / Ala', 'Atacante / Pivô'][aIdx],
      titular: true,
    })),
  );

  const jogosEncerrado: TorneioJogo[] = [
    // Quartas de Final
    { id: 'je-q1', torneio_id: tEncerradoId, rodada: 1, ordem: 1, time_a: 'tm-e1', time_b: 'tm-e2', gols_a: 4, gols_b: 1, penaltis_a: null, penaltis_b: null, faltas_a: 2, faltas_b: 3, local: 'Quadra 1', status: 'finalizado', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 1800, ao_vivo_pausado: true },
    { id: 'je-q2', torneio_id: tEncerradoId, rodada: 1, ordem: 2, time_a: 'tm-e3', time_b: 'tm-e4', gols_a: 3, gols_b: 2, penaltis_a: null, penaltis_b: null, faltas_a: 3, faltas_b: 4, local: 'Quadra 1', status: 'finalizado', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 1800, ao_vivo_pausado: true },
    { id: 'je-q3', torneio_id: tEncerradoId, rodada: 1, ordem: 3, time_a: 'tm-e5', time_b: 'tm-e6', gols_a: 2, gols_b: 0, penaltis_a: null, penaltis_b: null, faltas_a: 1, faltas_b: 2, local: 'Quadra 1', status: 'finalizado', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 1800, ao_vivo_pausado: true },
    { id: 'je-q4', torneio_id: tEncerradoId, rodada: 1, ordem: 4, time_a: 'tm-e7', time_b: 'tm-e8', gols_a: 1, gols_b: 1, penaltis_a: 2, penaltis_b: 3, faltas_a: 4, faltas_b: 3, local: 'Quadra 1', status: 'finalizado', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 1800, ao_vivo_pausado: true },
    // Semifinais
    { id: 'je-s1', torneio_id: tEncerradoId, rodada: 2, ordem: 1, time_a: 'tm-e1', time_b: 'tm-e3', gols_a: 2, gols_b: 1, penaltis_a: null, penaltis_b: null, faltas_a: 2, faltas_b: 3, local: 'Quadra 1', status: 'finalizado', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 1800, ao_vivo_pausado: true },
    { id: 'je-s2', torneio_id: tEncerradoId, rodada: 2, ordem: 2, time_a: 'tm-e5', time_b: 'tm-e8', gols_a: 3, gols_b: 1, penaltis_a: null, penaltis_b: null, faltas_a: 3, faltas_b: 4, local: 'Quadra 1', status: 'finalizado', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 1800, ao_vivo_pausado: true },
    // Final (Campeão: Grêmio Tricolor Sub-9)
    { id: 'je-f1', torneio_id: tEncerradoId, rodada: 3, ordem: 1, time_a: 'tm-e1', time_b: 'tm-e5', gols_a: 3, gols_b: 1, penaltis_a: null, penaltis_b: null, faltas_a: 2, faltas_b: 3, local: 'Quadra Principal', status: 'finalizado', ao_vivo_periodo: 2, ao_vivo_segundos_acumulados: 1800, ao_vivo_pausado: true },
  ];

  const eventos: TorneioEvento[] = [
    // Eventos do torneio em andamento
    { id: 'ev-a1', torneio_id: tAndamentoId, jogo_id: 'ja-q1', time_id: 'tm-a1', atleta_id: atletasAndamento[3]?.id, atleta_nome: atletasAndamento[3]?.nome, tipo: 'gol', minuto: 6, periodo: 1, criado_em: agora },
    { id: 'ev-a2', torneio_id: tAndamentoId, jogo_id: 'ja-q1', time_id: 'tm-a1', atleta_id: atletasAndamento[2]?.id, atleta_nome: atletasAndamento[2]?.nome, tipo: 'gol', minuto: 18, periodo: 1, criado_em: agora },
    { id: 'ev-a3', torneio_id: tAndamentoId, jogo_id: 'ja-s1', time_id: 'tm-a1', atleta_id: atletasAndamento[3]?.id, atleta_nome: atletasAndamento[3]?.nome, tipo: 'gol', minuto: 11, periodo: 1, criado_em: agora },
    { id: 'ev-a4', torneio_id: tAndamentoId, jogo_id: 'ja-s1', time_id: 'tm-a3', atleta_id: atletasAndamento[11]?.id, atleta_nome: atletasAndamento[11]?.nome, tipo: 'cartao_amarelo', minuto: 24, periodo: 2, observacao: 'Falta tática', criado_em: agora },
    // Eventos do torneio encerrado
    { id: 'ev-e1', torneio_id: tEncerradoId, jogo_id: 'je-f1', time_id: 'tm-e1', atleta_id: atletasEncerrado[3]?.id, atleta_nome: atletasEncerrado[3]?.nome, tipo: 'gol', minuto: 5, periodo: 1, criado_em: agora },
    { id: 'ev-e2', torneio_id: tEncerradoId, jogo_id: 'je-f1', time_id: 'tm-e1', atleta_id: atletasEncerrado[3]?.id, atleta_nome: atletasEncerrado[3]?.nome, tipo: 'gol', minuto: 14, periodo: 1, criado_em: agora },
    { id: 'ev-e3', torneio_id: tEncerradoId, jogo_id: 'je-f1', time_id: 'tm-e5', atleta_id: atletasEncerrado[19]?.id, atleta_nome: atletasEncerrado[19]?.nome, tipo: 'gol', minuto: 21, periodo: 2, criado_em: agora },
    { id: 'ev-e4', torneio_id: tEncerradoId, jogo_id: 'je-f1', time_id: 'tm-e1', atleta_id: atletasEncerrado[2]?.id, atleta_nome: atletasEncerrado[2]?.nome, tipo: 'gol', minuto: 28, periodo: 2, criado_em: agora },
    { id: 'ev-e5', torneio_id: tEncerradoId, jogo_id: 'je-s1', time_id: 'tm-e3', atleta_id: atletasEncerrado[11]?.id, atleta_nome: atletasEncerrado[11]?.nome, tipo: 'cartao_amarelo', minuto: 19, periodo: 2, observacao: 'Reclamação', criado_em: agora },
  ];

  const sumulas: TorneioSumula[] = [
    {
      id: 'sum-a1',
      torneio_id: tAndamentoId,
      jogo_id: 'ja-q1',
      arbitro: 'Árbitro Ricardo Mendes',
      local: 'Campo 1',
      data_realizacao: hoje,
      hora_inicio: '09:00',
      hora_termino: '09:45',
      escalacao_a: atletasAndamento.filter((a) => a.time_id === 'tm-a1').map((a) => ({ atleta_id: a.id, nome: a.nome, camisa: a.camisa, posicao: a.posicao, titular: a.titular })),
      escalacao_b: atletasAndamento.filter((a) => a.time_id === 'tm-a2').map((a) => ({ atleta_id: a.id, nome: a.nome, camisa: a.camisa, posicao: a.posicao, titular: a.titular })),
      ocorrencias: 'Partida disputada com fair play e ótima presença das famílias.',
      assinatura_arbitro: 'Ricardo Mendes',
      assinatura_tecnico_a: 'Prof. Carlos Eduardo',
      assinatura_tecnico_b: 'Prof. Marcos Silva',
      status: 'finalizada',
      finalizada_em: agora,
    },
    {
      id: 'sum-e-final',
      torneio_id: tEncerradoId,
      jogo_id: 'je-f1',
      arbitro: 'Árbitro Rodrigo Ferreira',
      mesario: 'Ana Paula',
      local: 'Quadra Principal',
      data_realizacao: '2026-10-20',
      hora_inicio: '16:00',
      hora_termino: '16:40',
      escalacao_a: atletasEncerrado.filter((a) => a.time_id === 'tm-e1').map((a) => ({ atleta_id: a.id, nome: a.nome, camisa: a.camisa, posicao: a.posicao, titular: a.titular })),
      escalacao_b: atletasEncerrado.filter((a) => a.time_id === 'tm-e5').map((a) => ({ atleta_id: a.id, nome: a.nome, camisa: a.camisa, posicao: a.posicao, titular: a.titular })),
      ocorrencias: 'Grande final da 1ª Copa Sub-9. Entrega de troféus e medalhas após o apito final.',
      assinatura_arbitro: 'Rodrigo Ferreira',
      assinatura_tecnico_a: 'Prof. Carlos Eduardo',
      assinatura_tecnico_b: 'Prof. Bruno Rocha',
      status: 'finalizada',
      finalizada_em: '2026-10-20T16:45:00.000Z',
    },
  ];

  return {
    torneios: [tAndamento, tEncerrado],
    times: [...timesAndamento, ...timesEncerrado],
    atletas: [...atletasAndamento, ...atletasEncerrado],
    jogos: [...jogosAndamento, ...jogosEncerrado],
    sumulas,
    eventos,
  };
}

export function loadTorneiosStore(): TorneiosStore {
  if (typeof window === 'undefined') return buildSeedStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TorneiosStore;
  } catch {
    // ignore
  }
  const seed = buildSeedStore();
  saveTorneiosStore(seed);
  return seed;
}

export function saveTorneiosStore(store: TorneiosStore) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}
