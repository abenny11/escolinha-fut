import { syncGaleriaToSupabase } from './supabase/sync';

export interface GaleriaFoto {
  id: string;
  src: string;
  alt: string;
  titulo: string;
  desc: string;
}

export const DEFAULT_GALERIA_FOTOS: GaleriaFoto[] = [
  {
    id: 'foto-1',
    src: '/galeria/gremio-1.jpg',
    alt: 'Atletas da Escola de Futebol Grêmio Concórdia em avaliação oficial',
    titulo: 'Avaliações e Integração com a Base do Grêmio',
    desc: 'Atletas de Concórdia vivenciando a metodologia oficial do Grêmio Foot-Ball Porto Alegrense.',
  },
  {
    id: 'foto-2',
    src: '/galeria/gremio-2.jpg',
    alt: 'Campo de futebol preparado para treinos e competições da escolinha',
    titulo: 'Treinos 3x por Semana (4 a 15 anos)',
    desc: 'Turmas organizadas do Sub-5 ao Sub-15 no Bairro São Cristóvão, próximo ao SENAI.',
  },
  {
    id: 'foto-3',
    src: '/galeria/gremio-3.jpg',
    alt: 'Formação técnica e fundamentos de futebol para categorias de base',
    titulo: 'Formação Técnica, Tática e Valores',
    desc: 'Desenvolvimento completo do atleta: passe, domínio, finalização, respeito e trabalho em equipe.',
  },
  {
    id: 'foto-4',
    src: '/galeria/gremio-4.jpg',
    alt: 'Disputa de partida em torneio infantil e liga interna',
    titulo: 'Liga Interna, Torneios e Amistosos',
    desc: 'Competições internas e regionais ao longo de todo o ano com súmula oficial e premiação.',
  },
  {
    id: 'foto-5',
    src: '/galeria/gremio-5.jpg',
    alt: 'Treinamento em grupo das categorias infantis no gramado',
    titulo: 'Trabalho em Equipe e Espírito Coletivo',
    desc: 'Atividades práticas em grupo que fortalecem a união, comunicação e leitura de jogo.',
  },
  {
    id: 'foto-6',
    src: '/galeria/gremio-6.jpg',
    alt: 'Bola rolando em campeonato de futebol society em Concórdia',
    titulo: 'Campeonatos de Futebol Society',
    desc: 'Participação ativa em torneios regionais e desafios entre escolinhas de Santa Catarina.',
  },
  {
    id: 'foto-7',
    src: '/galeria/gremio-7.jpg',
    alt: 'Jovem atleta em preparação física e técnica na escolinha',
    titulo: 'Evolução Individual do Atleta',
    desc: 'Acompanhamento de frequência, fundamentos técnicos e comportamento dentro de campo.',
  },
  {
    id: 'foto-8',
    src: '/galeria/gremio-8.jpg',
    alt: 'Treino de finalização e chute a gol nas categorias de base',
    titulo: 'Treino Experimental Gratuito',
    desc: 'Agende uma aula experimental pelo WhatsApp (49) 98896-8754 e venha conhecer nossa metodologia.',
  },
];

const GALERIA_KEY = 'gremio_concordia_galeria_v2';

export function loadGaleriaFotos(): GaleriaFoto[] {
  if (typeof window === 'undefined') return DEFAULT_GALERIA_FOTOS;
  try {
    const raw = localStorage.getItem(GALERIA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_GALERIA_FOTOS;
}

export function saveGaleriaFotos(fotos: GaleriaFoto[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GALERIA_KEY, JSON.stringify(fotos));
  } catch {
    // ignore
  }
  void syncGaleriaToSupabase(fotos);
}

export async function comprimirImagemGaleria(file: File, maxW = 1100, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(String(reader.result));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
