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

const STORAGE_KEY = 'escolinha_fut_torneios_v1';

export function buildSeedStore(): TorneiosStore {
  const torneioId = 'torn-copa-sub11';
  const torneio: Torneio = {
    id: torneioId,
    codigo: 'COPA11',
    nome: 'Copa Escolinha Sub-11',
    modalidade: 'futebol',
    categoria: 'Sub-11',
    formato: 'mata-mata',
    inicio: new Date().toISOString().slice(0, 10),
    local: 'Campo Principal',
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
    criado_em: new Date().toISOString(),
  };

  const times: TorneioTime[] = [
    { id: 'tm-1', torneio_id: torneioId, nome: 'Leões da Base', tecnico: 'Prof. Carlos Eduardo', pago: true, criado_em: new Date().toISOString() },
    { id: 'tm-2', torneio_id: torneioId, nome: 'Águias FC', tecnico: 'Prof. Marcos Silva', pago: true, criado_em: new Date().toISOString() },
    { id: 'tm-3', torneio_id: torneioId, nome: 'Furacão Academy', tecnico: 'Prof. Rafael Costa', pago: true, criado_em: new Date().toISOString() },
    { id: 'tm-4', torneio_id: torneioId, nome: 'Estrela Dalva', tecnico: 'Prof. Lucas Lima', pago: true, criado_em: new Date().toISOString() },
  ];

  const atletas: TorneioAtleta[] = mockStudents.slice(0, 12).map((st, idx) => ({
    id: `atl-seed-${idx + 1}`,
    torneio_id: torneioId,
    time_id: times[idx % times.length].id,
    student_id: st.id,
    nome: st.full_name,
    camisa: (idx % 11) + 1,
    posicao: st.position || 'Meia',
    titular: true,
  }));

  const jogos: TorneioJogo[] = [
    {
      id: 'jog-semi-1',
      torneio_id: torneioId,
      rodada: 1,
      ordem: 1,
      time_a: 'tm-1',
      time_b: 'tm-2',
      gols_a: 3,
      gols_b: 1,
      penaltis_a: null,
      penaltis_b: null,
      faltas_a: 2,
      faltas_b: 4,
      local: 'Campo 1',
      status: 'finalizado',
      ao_vivo_periodo: 2,
      ao_vivo_segundos_acumulados: 2400,
      ao_vivo_pausado: true,
    },
    {
      id: 'jog-semi-2',
      torneio_id: torneioId,
      rodada: 1,
      ordem: 2,
      time_a: 'tm-3',
      time_b: 'tm-4',
      gols_a: null,
      gols_b: null,
      penaltis_a: null,
      penaltis_b: null,
      faltas_a: 0,
      faltas_b: 0,
      local: 'Campo 1',
      status: 'agendado',
      ao_vivo_periodo: 1,
      ao_vivo_segundos_acumulados: 0,
      ao_vivo_pausado: true,
    },
    {
      id: 'jog-final',
      torneio_id: torneioId,
      rodada: 2,
      ordem: 1,
      time_a: 'tm-1',
      time_b: null,
      gols_a: null,
      gols_b: null,
      penaltis_a: null,
      penaltis_b: null,
      faltas_a: 0,
      faltas_b: 0,
      local: 'Campo Principal',
      status: 'agendado',
      ao_vivo_periodo: 1,
      ao_vivo_segundos_acumulados: 0,
      ao_vivo_pausado: true,
    },
  ];

  const eventos: TorneioEvento[] = [
    {
      id: 'ev-1',
      torneio_id: torneioId,
      jogo_id: 'jog-semi-1',
      time_id: 'tm-1',
      atleta_id: atletas[0]?.id,
      atleta_nome: atletas[0]?.nome || 'Atleta 1',
      tipo: 'gol',
      minuto: 8,
      periodo: 1,
      criado_em: new Date().toISOString(),
    },
    {
      id: 'ev-2',
      torneio_id: torneioId,
      jogo_id: 'jog-semi-1',
      time_id: 'tm-2',
      atleta_id: atletas[1]?.id,
      atleta_nome: atletas[1]?.nome || 'Atleta 2',
      tipo: 'cartao_amarelo',
      minuto: 14,
      periodo: 1,
      observacao: 'Falta tática no meio-campo',
      criado_em: new Date().toISOString(),
    },
  ];

  const sumulas: TorneioSumula[] = [
    {
      id: 'sum-1',
      torneio_id: torneioId,
      jogo_id: 'jog-semi-1',
      arbitro: 'Árbitro Ricardo Mendes',
      local: 'Campo 1',
      data_realizacao: new Date().toISOString().slice(0, 10),
      hora_inicio: '09:00',
      hora_termino: '09:45',
      escalacao_a: atletas.filter((a) => a.time_id === 'tm-1').map((a) => ({ atleta_id: a.id, nome: a.nome, camisa: a.camisa, posicao: a.posicao, titular: a.titular })),
      escalacao_b: atletas.filter((a) => a.time_id === 'tm-2').map((a) => ({ atleta_id: a.id, nome: a.nome, camisa: a.camisa, posicao: a.posicao, titular: a.titular })),
      ocorrencias: 'Partida disputada com fair play e ótima presença dos pais.',
      assinatura_arbitro: 'Ricardo Mendes',
      assinatura_tecnico_a: 'Prof. Carlos Eduardo',
      assinatura_tecnico_b: 'Prof. Marcos Silva',
      status: 'finalizada',
      finalizada_em: new Date().toISOString(),
    },
  ];

  return { torneios: [torneio], times, atletas, jogos, sumulas, eventos };
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
