'use client';

import { useEffect, useState } from 'react';
import { ArrowUpCircle, Award, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import {
  calcularFaixaPorPontos,
  FAIXAS_ESCOLINHA,
  loadProgressosFaixas,
  proximaFaixaDe,
  saveProgressosFaixas,
  type ProgressoAtleta,
} from '@/lib/faixas-evolucao';

export function EvolucaoFaixasPanel({ canEdit = false }: { canEdit?: boolean }) {
  const [lista, setLista] = useState<ProgressoAtleta[]>([]);
  const [selId, setSelId] = useState<string>('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const data = loadProgressosFaixas();
    setLista(data);
    if (data[0]) setSelId(data[0].studentId);
  }, []);

  const atleta = lista.find((x) => x.studentId === selId) || lista[0];
  if (!atleta) return null;

  const faixaAtual = FAIXAS_ESCOLINHA.find((f) => f.id === atleta.faixaId) || calcularFaixaPorPontos(atleta.pontos);
  const proxFaixa = proximaFaixaDe(faixaAtual.id);
  const pct = proxFaixa
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(((atleta.pontos - faixaAtual.minPontos) / (proxFaixa.minPontos - faixaAtual.minPontos)) * 100),
        ),
      )
    : 100;

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  function adicionarPontos(pts: number, motivo: string) {
    const next = lista.map((item) => {
      if (item.studentId !== atleta.studentId) return item;
      const novosPts = item.pontos + pts;
      const novaFaixa = calcularFaixaPorPontos(novosPts);
      return {
        ...item,
        pontos: novosPts,
        faixaId: novaFaixa.id,
        historico: [
          { data: new Date().toISOString().slice(0, 10), descricao: motivo, pontos: pts },
          ...item.historico,
        ],
      };
    });
    setLista(next);
    saveProgressosFaixas(next);
    notify(`+${pts} pts adicionados para ${atleta.studentName}!`);
  }

  function promoverFaixa() {
    if (!proxFaixa) return;
    const diff = Math.max(0, proxFaixa.minPontos - atleta.pontos);
    const next = lista.map((item) => {
      if (item.studentId !== atleta.studentId) return item;
      return {
        ...item,
        pontos: Math.max(item.pontos, proxFaixa.minPontos),
        faixaId: proxFaixa.id,
        historico: [
          {
            data: new Date().toISOString().slice(0, 10),
            descricao: `Promovido para ${proxFaixa.nome} (${proxFaixa.subtitulo})`,
            pontos: diff,
          },
          ...item.historico,
        ],
      };
    });
    setLista(next);
    saveProgressosFaixas(next);
    notify(`🎉 ${atleta.studentName} passou para ${proxFaixa.nome}!`);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-5">
      {toast && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-400">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Award className="size-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white">Evolução por Faixas Etárias &amp; Categorias</h2>
            <p className="text-xs text-slate-400">
              Acompanhe a progressão do atleta nas categorias do futebol (Sub-5/Sub-7 até Sub-15 e Avaliação Grêmio FBPA).
            </p>
          </div>
        </div>

        <select
          value={atleta.studentId}
          onChange={(e) => setSelId(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
        >
          {lista.map((a) => (
            <option key={a.studentId} value={a.studentId}>
              {a.studentName} ({a.pontos} pts)
            </option>
          ))}
        </select>
      </div>

      {/* Resumo da Faixa Atual */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span
              className="h-9 w-9 rounded-xl border-2 border-white/20 flex items-center justify-center font-black text-xs text-slate-950"
              style={{ backgroundColor: faixaAtual.corHex }}
            >
              {faixaAtual.ordem}ª
            </span>
            <div>
              <p className="font-bold text-sm text-white">
                {faixaAtual.nome} — <span className="text-emerald-400">{faixaAtual.subtitulo}</span>
              </p>
              <p className="text-xs text-slate-400">{faixaAtual.requisitos}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-white">{atleta.pontos} pts</span>
            <p className="text-[11px] text-slate-400">
              {proxFaixa ? `Faltam ${Math.max(0, proxFaixa.minPontos - atleta.pontos)} pts p/ ${proxFaixa.nome}` : 'Nível Máximo Atingido!'}
            </p>
          </div>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, backgroundColor: faixaAtual.corHex }}
          />
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => adicionarPontos(25, 'Presença e bom desempenho no treino')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500"
            >
              <Plus className="size-3.5" /> +25 pts (Treino)
            </button>
            <button
              type="button"
              onClick={() => adicionarPontos(50, 'Destaque em jogo / torneio')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500"
            >
              <Sparkles className="size-3.5 text-amber-400" /> +50 pts (Jogo)
            </button>
            {proxFaixa && (
              <button
                type="button"
                onClick={promoverFaixa}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:opacity-90 ml-auto"
              >
                <ArrowUpCircle className="size-3.5" /> Passar para {proxFaixa.nome}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Trilha Visual das 6 Faixas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {FAIXAS_ESCOLINHA.map((f) => {
          const conquistada = atleta.pontos >= f.minPontos || faixaAtual.ordem >= f.ordem;
          const atual = faixaAtual.id === f.id;
          return (
            <div
              key={f.id}
              className={`rounded-xl border p-2.5 text-xs space-y-1 transition ${
                atual
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : conquistada
                    ? 'border-slate-700 bg-slate-900/70'
                    : 'border-slate-800/60 bg-slate-950 opacity-55'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: f.corHex }} />
                {conquistada && <CheckCircle2 className="size-3.5 text-emerald-400" />}
              </div>
              <p className="font-bold text-white leading-tight">{f.nome}</p>
              <p className="text-[10px] text-slate-400">{f.subtitulo} · {f.minPontos} pts</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
