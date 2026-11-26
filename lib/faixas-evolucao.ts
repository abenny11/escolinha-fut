import { mockStudents } from './mock-data';

export interface FaixaNivel {
  ordem: number;
  id: string;
  nome: string;
  subtitulo: string;
  corHex: string;
  minPontos: number;
  requisitos: string;
}

export const FAIXAS_ESCOLINHA: FaixaNivel[] = [
  {
    ordem: 1,
    id: 'branca',
    nome: 'Faixa Branca',
    subtitulo: 'Iniciante',
    corHex: '#e2e8f0',
    minPontos: 0,
    requisitos: 'Primeiros passos, coordenação motora e integração com a turma.',
  },
  {
    ordem: 2,
    id: 'azul_celeste',
    nome: 'Faixa Azul Celeste',
    subtitulo: 'Base Tricolor',
    corHex: '#38bdf8',
    minPontos: 150,
    requisitos: 'Domínio básico de bola, passe curto e frequência acima de 75%.',
  },
  {
    ordem: 3,
    id: 'azul_marinho',
    nome: 'Faixa Azul Marinho',
    subtitulo: 'Em Formação',
    corHex: '#0284c7',
    minPontos: 300,
    requisitos: 'Condução em velocidade, posicionamento tático e trabalho em equipe.',
  },
  {
    ordem: 4,
    id: 'prata',
    nome: 'Faixa Prata',
    subtitulo: 'Destaque da Turma',
    corHex: '#94a3b8',
    minPontos: 500,
    requisitos: 'Participação em liga interna/amistosos, fair play e leitura de jogo.',
  },
  {
    ordem: 5,
    id: 'ouro',
    nome: 'Faixa Ouro',
    subtitulo: 'Capitão / Referência',
    corHex: '#f59e0b',
    minPontos: 750,
    requisitos: 'Liderança positiva, técnica apurada e assiduidade exemplar.',
  },
  {
    ordem: 6,
    id: 'tricolor',
    nome: 'Faixa Preta & Tricolor',
    subtitulo: 'Craque Grêmio Concórdia',
    corHex: '#009fe3',
    minPontos: 1000,
    requisitos: 'Nível máximo da escolinha: apto para avaliações oficiais do Grêmio FBPA.',
  },
];

export interface ProgressoAtleta {
  studentId: string;
  studentName: string;
  categoria: string;
  pontos: number;
  faixaId: string;
  historico: Array<{ data: string; descricao: string; pontos: number }>;
}

const STORAGE_KEY = 'gremio_concordia_faixas_v1';

export function calcularFaixaPorPontos(pontos: number): FaixaNivel {
  let atual = FAIXAS_ESCOLINHA[0];
  for (const f of FAIXAS_ESCOLINHA) {
    if (pontos >= f.minPontos) atual = f;
  }
  return atual;
}

export function proximaFaixaDe(faixaId: string): FaixaNivel | null {
  const idx = FAIXAS_ESCOLINHA.findIndex((f) => f.id === faixaId);
  if (idx < 0 || idx >= FAIXAS_ESCOLINHA.length - 1) return null;
  return FAIXAS_ESCOLINHA[idx + 1];
}

export function loadProgressosFaixas(): ProgressoAtleta[] {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
  }
  const seed: ProgressoAtleta[] = mockStudents.slice(0, 8).map((s, idx) => {
    const pts = s.total_points || [180, 340, 520, 90, 780, 410, 220, 1020][idx % 8];
    return {
      studentId: s.id,
      studentName: s.full_name,
      categoria: s.current_class?.name || 'Sub-11',
      pontos: pts,
      faixaId: calcularFaixaPorPontos(pts).id,
      historico: [
        {
          data: new Date().toISOString().slice(0, 10),
          descricao: 'Avaliação inicial da temporada',
          pontos: pts,
        },
      ],
    };
  });
  saveProgressosFaixas(seed);
  return seed;
}

export function saveProgressosFaixas(lista: ProgressoAtleta[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch {
    // ignore
  }
}
