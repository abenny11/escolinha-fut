import jsPDF from 'jspdf';
import type {
  EscalacaoItem,
  Torneio,
  TorneioAtleta,
  TorneioEvento,
  TorneioJogo,
  TorneioSumula,
  TorneioTime,
} from './torneios';

export interface SumulaPdfInput {
  escolaNome: string;
  torneio: Torneio;
  jogo: TorneioJogo;
  timeA?: TorneioTime | null;
  timeB?: TorneioTime | null;
  atletasA: TorneioAtleta[];
  atletasB: TorneioAtleta[];
  sumula?: Partial<TorneioSumula> | null;
  eventos: TorneioEvento[];
  emBranco?: boolean;
}

export function gerarSumulaPdf(input: SumulaPdfInput): jsPDF {
  const {
    escolaNome,
    torneio,
    jogo,
    timeA,
    timeB,
    atletasA,
    atletasB,
    sumula,
    eventos,
    emBranco = false,
  } = input;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const margin = 12;
  const contentW = W - margin * 2;
  let y = 12;

  const nomeA = timeA?.nome || 'Equipe A';
  const nomeB = timeB?.nome || 'Equipe B';

  const ensurePage = (needed = 16) => {
    if (y + needed > 282) {
      doc.addPage();
      y = 14;
    }
  };

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentW, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('SÚMULA OFICIAL DE PARTIDA', margin + 4, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    `${escolaNome || 'Escolinha de Futebol'} · ${torneio.nome}${torneio.categoria ? ` (${torneio.categoria})` : ''}`,
    margin + 4,
    y + 13,
  );
  doc.setFont('helvetica', 'bold');
  doc.text(`CÓD: ${torneio.codigo}`, W - margin - 4, y + 7, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Rodada ${jogo.rodada} · Jogo ${jogo.ordem}`, W - margin - 4, y + 13, { align: 'right' });
  y += 22;

  doc.setTextColor(15, 23, 42);
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentW, 18, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(nomeA, margin + 4, y + 11, { maxWidth: 68 });
  doc.text(nomeB, W - margin - 4, y + 11, { align: 'right', maxWidth: 68 });

  const placarTxt = emBranco
    ? '[   ]  x  [   ]'
    : `${jogo.gols_a ?? ' '}  x  ${jogo.gols_b ?? ' '}`;
  doc.setFontSize(15);
  doc.text(placarTxt, W / 2, y + 11, { align: 'center' });
  if (!emBranco && jogo.penaltis_a != null && jogo.penaltis_b != null) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`(Pênaltis: ${jogo.penaltis_a} x ${jogo.penaltis_b})`, W / 2, y + 16, { align: 'center' });
  }
  y += 22;

  const dataStr = emBranco
    ? '____/____/________'
    : sumula?.data_realizacao
      ? new Date(`${sumula.data_realizacao}T12:00`).toLocaleDateString('pt-BR')
      : jogo.quando
        ? new Date(jogo.quando).toLocaleDateString('pt-BR')
        : '____/____/________';
  const horaIni = emBranco ? '____:____' : sumula?.hora_inicio || '____:____';
  const horaFim = emBranco ? '____:____' : sumula?.hora_termino || '____:____';
  const localStr = emBranco
    ? '____________________________'
    : sumula?.local || jogo.local || torneio.local || '____________________________';

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const infoRows = [
    [`Data: ${dataStr}`, `Início: ${horaIni}   Término: ${horaFim}`, `Local: ${localStr}`],
    [
      `Árbitro: ${emBranco ? '______________________' : sumula?.arbitro || '______________________'}`,
      `Auxiliar 1: ${emBranco ? '__________________' : sumula?.auxiliar_1 || '__________________'}`,
      `Mesário: ${emBranco ? '__________________' : sumula?.mesario || '__________________'}`,
    ],
  ];
  for (const row of infoRows) {
    doc.rect(margin, y, contentW, 7);
    doc.text(row[0], margin + 2, y + 4.8);
    doc.text(row[1], margin + 65, y + 4.8);
    doc.text(row[2], margin + 128, y + 4.8);
    y += 7;
  }
  y += 4;

  const buildRoster = (saved: EscalacaoItem[] | undefined, fallback: TorneioAtleta[]): EscalacaoItem[] => {
    if (saved && saved.length > 0) return saved;
    return fallback.map((a) => ({
      atleta_id: a.id,
      nome: a.nome,
      camisa: a.camisa,
      posicao: a.posicao,
      titular: a.titular,
    }));
  };

  const escA = buildRoster(sumula?.escalacao_a, atletasA);
  const escB = buildRoster(sumula?.escalacao_b, atletasB);
  const maxRows = Math.max(escA.length, escB.length, emBranco ? 12 : 8);
  const colW = (contentW - 4) / 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setFillColor(226, 232, 240);
  doc.rect(margin, y, colW, 6.5, 'F');
  doc.rect(margin + colW + 4, y, colW, 6.5, 'F');
  doc.text(`ESCALAÇÃO — ${nomeA}`.slice(0, 38), margin + 2, y + 4.5);
  doc.text(`ESCALAÇÃO — ${nomeB}`.slice(0, 38), margin + colW + 6, y + 4.5);
  y += 6.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  for (let i = 0; i < maxRows; i++) {
    ensurePage(7);
    const a = escA[i];
    const b = escB[i];
    doc.rect(margin, y, colW, 5.5);
    doc.rect(margin + colW + 4, y, colW, 5.5);
    if (a) {
      const tag = a.titular ? 'T' : 'R';
      doc.text(`${a.camisa ?? '--'} | ${a.nome} (${tag})`.slice(0, 44), margin + 2, y + 3.9);
    } else if (emBranco) {
      doc.text('Nº ___  ___________________________________  ( )T ( )R', margin + 2, y + 3.9);
    }
    if (b) {
      const tag = b.titular ? 'T' : 'R';
      doc.text(`${b.camisa ?? '--'} | ${b.nome} (${tag})`.slice(0, 44), margin + colW + 6, y + 3.9);
    } else if (emBranco) {
      doc.text('Nº ___  ___________________________________  ( )T ( )R', margin + colW + 6, y + 3.9);
    }
    y += 5.5;
  }
  y += 4;

  ensurePage(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.rect(margin, y, contentW, 7);
  const faltasTxt = emBranco
    ? `FALTAS COMETIDAS — ${nomeA}: [   ]    |    ${nomeB}: [   ]`
    : `FALTAS COMETIDAS — ${nomeA}: ${jogo.faltas_a ?? 0}    |    ${nomeB}: ${jogo.faltas_b ?? 0}`;
  doc.text(faltasTxt, margin + 3, y + 4.8);
  y += 10;

  const sectionTitle = (title: string) => {
    ensurePage(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setFillColor(226, 232, 240);
    doc.rect(margin, y, contentW, 6, 'F');
    doc.text(title, margin + 2, y + 4.3);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
  };

  const teamLabel = (id: string | null) =>
    id === jogo.time_a ? nomeA : id === jogo.time_b ? nomeB : '—';

  const gols = eventos.filter((e) => e.tipo === 'gol' || e.tipo === 'gol_contra');
  sectionTitle('GOLS DA PARTIDA');
  const golsLinhas = emBranco ? Math.max(6, gols.length) : Math.max(1, gols.length);
  for (let i = 0; i < golsLinhas; i++) {
    ensurePage(6);
    doc.rect(margin, y, contentW, 5.5);
    const g = gols[i];
    if (g && !emBranco) {
      const tipo = g.tipo === 'gol_contra' ? ' (Gol contra)' : '';
      const assist = g.atleta_secundario_nome ? ` · Assist: ${g.atleta_secundario_nome}` : '';
      doc.text(
        `${g.minuto != null ? `${g.minuto}'` : '--'} | ${teamLabel(g.time_id)} | ${g.atleta_nome || 'Atleta'}${tipo}${assist}`,
        margin + 2,
        y + 3.9,
      );
    } else if (emBranco) {
      doc.text('Min: ___  |  Equipe: _____________________  |  Atleta: _________________________________', margin + 2, y + 3.9);
    } else {
      doc.text('Nenhum gol registrado.', margin + 2, y + 3.9);
    }
    y += 5.5;
  }
  y += 3;

  const cartoes = eventos.filter((e) => e.tipo === 'cartao_amarelo' || e.tipo === 'cartao_vermelho');
  sectionTitle('CARTÕES (AMARELO / VERMELHO)');
  const cartoesLinhas = emBranco ? Math.max(5, cartoes.length) : Math.max(1, cartoes.length);
  for (let i = 0; i < cartoesLinhas; i++) {
    ensurePage(6);
    doc.rect(margin, y, contentW, 5.5);
    const c = cartoes[i];
    if (c && !emBranco) {
      const cor = c.tipo === 'cartao_vermelho' ? 'VERMELHO' : 'AMARELO';
      const mot = c.observacao ? ` — ${c.observacao}` : '';
      doc.text(
        `${c.minuto != null ? `${c.minuto}'` : '--'} | [${cor}] | ${teamLabel(c.time_id)} | ${c.atleta_nome || 'Atleta'}${mot}`,
        margin + 2,
        y + 3.9,
      );
    } else if (emBranco) {
      doc.text('( ) CA  ( ) CV  |  Min: ___  |  Equipe: ________________  |  Atleta: ______________________', margin + 2, y + 3.9);
    } else {
      doc.text('Nenhum cartão aplicado.', margin + 2, y + 3.9);
    }
    y += 5.5;
  }
  y += 3;

  const subs = eventos.filter((e) => e.tipo === 'substituicao');
  sectionTitle('SUBSTITUIÇÕES');
  const subsLinhas = emBranco ? Math.max(4, subs.length) : Math.max(1, subs.length);
  for (let i = 0; i < subsLinhas; i++) {
    ensurePage(6);
    doc.rect(margin, y, contentW, 5.5);
    const s = subs[i];
    if (s && !emBranco) {
      doc.text(
        `${s.minuto != null ? `${s.minuto}'` : '--'} | ${teamLabel(s.time_id)} | Sai: ${s.atleta_nome || '—'} -> Entra: ${s.atleta_secundario_nome || '—'}`,
        margin + 2,
        y + 3.9,
      );
    } else if (emBranco) {
      doc.text('Min: ___  |  Equipe: ______________  |  Sai: ___________________  |  Entra: ___________________', margin + 2, y + 3.9);
    } else {
      doc.text('Nenhuma substituição registrada.', margin + 2, y + 3.9);
    }
    y += 5.5;
  }
  y += 3;

  sectionTitle('OCORRÊNCIAS E OBSERVAÇÕES DA ARBITRAGEM');
  const ocEventos = eventos
    .filter((e) => e.tipo === 'ocorrencia')
    .map((e) => `${e.minuto != null ? `[${e.minuto}'] ` : ''}${e.observacao || ''}`)
    .join('\n');
  const textoOc = emBranco ? '' : [sumula?.ocorrencias, ocEventos].filter(Boolean).join('\n').trim();

  ensurePage(24);
  doc.rect(margin, y, contentW, 20);
  if (textoOc) {
    const wrapped = doc.splitTextToSize(textoOc, contentW - 4);
    doc.text(wrapped.slice(0, 4), margin + 2, y + 4.5);
  }
  y += 24;

  ensurePage(22);
  const sigW = (contentW - 8) / 3;
  const sigs = [
    { label: 'Árbitro Principal', val: emBranco ? '' : sumula?.assinatura_arbitro || sumula?.arbitro || '' },
    { label: `Técnico / Capitão (${nomeA})`.slice(0, 26), val: emBranco ? '' : sumula?.assinatura_tecnico_a || '' },
    { label: `Técnico / Capitão (${nomeB})`.slice(0, 26), val: emBranco ? '' : sumula?.assinatura_tecnico_b || '' },
  ];
  sigs.forEach((s, idx) => {
    const sx = margin + idx * (sigW + 4);
    if (s.val) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text(s.val, sx + sigW / 2, y + 8, { align: 'center' });
    }
    doc.line(sx, y + 10, sx + sigW, y + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(s.label, sx + sigW / 2, y + 14, { align: 'center' });
  });

  return doc;
}
