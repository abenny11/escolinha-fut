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
    id: 'sub7',
    nome: 'Sub-5 / Sub-7',
    subtitulo: '4 a 7 anos · Iniciação',
    corHex: '#38bdf8',
    minPontos: 0,
    requisitos: 'Coordenação motora, ludicidade, condução básica e primeiros jogos.',
  },
  {
    ordem: 2,
    id: 'sub9',
    nome: 'Sub-9',
    subtitulo: '8 e 9 anos · Pré-Mirim',
    corHex: '#0ea5e9',
    minPontos: 150,
    requisitos: 'Passe curto, domínio orientado, noções de espaço e frequência 75%+.',
  },
  {
    ordem: 3,
    id: 'sub11',
    nome: 'Sub-11',
    subtitulo: '10 e 11 anos · Mirim',
    corHex: '#0284c7',
    minPontos: 300,
    requisitos: 'Posicionamento tático, finalização, tomada de decisão e liga interna.',
  },
  {
    ordem: 4,
    id: 'sub13',
    nome: 'Sub-13',
    subtitulo: '12 e 13 anos · Infantil',
    corHex: '#0369a1',
    minPontos: 500,
    requisitos: 'Transição ofensiva/defensiva, torneios regionais e leitura de jogo.',
  },
  {
    ordem: 5,
    id: 'sub15',
    nome: 'Sub-15',
    subtitulo: '14 e 15 anos · Juvenil',
    corHex: '#f59e0b',
    minPontos: 750,
    requisitos: 'Alto rendimento formativo, intensidade competitiva e liderança em campo.',
  },
  {
    ordem: 6,
    id: 'base_gremio',
    nome: 'Avaliação Grêmio FBPA',
    subtitulo: 'Seleção / Porto Alegre',
    corHex: '#009fe3',
    minPontos: 1000,
    requisitos: 'Atleta destaque indicado para avaliações oficiais na matriz do Grêmio FBPA.',
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

const STORAGE_KEY = 'gremio_concordia_faixas_idade_v2';

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
    const pts = [180, 340, 520, 90, 780, 410, 220, 1020][idx % 8];
    return {
      studentId: s.id,
      studentName: s.full_name,
      categoria: calcularFaixaPorPontos(pts).nome,
      pontos: pts,
      faixaId: calcularFaixaPorPontos(pts).id,
      historico: [
        {
          data: new Date().toISOString().slice(0, 10),
          descricao: 'Avaliação inicial da categoria',
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
