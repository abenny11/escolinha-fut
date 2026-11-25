'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { Award, Calendar, MapPin, Trophy } from 'lucide-react';
import {
  calcularArtilharia,
  calcularTabela,
  loadTorneiosStore,
  modalidadeNome,
  parsePremio,
  parseRegras,
  type TorneiosStore,
} from '@/lib/torneios';
import { TorneioJogos, TorneioTabela } from '@/components/torneios/TorneioChaveamento';

export default function TorneioPublicoPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params);
  const [store, setStore] = useState<TorneiosStore | null>(null);

  useEffect(() => {
    setStore(loadTorneiosStore());
  }, []);

  const torneio = useMemo(
    () => store?.torneios.find((t) => t.codigo.toUpperCase() === codigo.toUpperCase()) || null,
    [store, codigo],
  );

  if (!store) {
    return <div className="p-8 text-sm text-slate-400">Carregando torneio...</div>;
  }

  if (!torneio) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-2">
        <Trophy className="h-10 w-10 text-slate-500" />
        <h1 className="text-xl font-bold text-white">Torneio não encontrado</h1>
        <p className="text-sm text-slate-400">Verifique o código informado e tente novamente.</p>
      </div>
    );
  }

  const times = store.times.filter((t) => t.torneio_id === torneio.id);
  const jogos = store.jogos.filter((j) => j.torneio_id === torneio.id).sort((a, b) => a.rodada - b.rodada || a.ordem - b.ordem);
  const eventos = store.eventos.filter((e) => e.torneio_id === torneio.id);
  const tabela = torneio.formato === 'pontos' ? calcularTabela(times, jogos) : [];
  const artilharia = calcularArtilharia(eventos, times);
  const premios = parsePremio(torneio.premio).posicoes;
  const regras = parseRegras(torneio.regras);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
            {modalidadeNome(torneio.modalidade, torneio.modalidade_nome)} {torneio.categoria ? `· ${torneio.categoria}` : ''}
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-emerald-400" /> {torneio.nome}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            {torneio.inicio && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {new Date(`${torneio.inicio}T12:00`).toLocaleDateString('pt-BR')}
              </span>
            )}
            {torneio.local && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {torneio.local}
              </span>
            )}
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
          {torneio.status === 'inscricoes' ? 'Inscrições abertas' : torneio.status === 'andamento' ? 'Em andamento' : 'Encerrado'}
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-bold text-white">Jogos e Chaveamento</h2>
        <TorneioJogos jogos={jogos} times={times} mata={torneio.formato === 'mata-mata'} />
      </div>

      {tabela.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white">Classificação</h2>
          <TorneioTabela linhas={tabela} />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {artilharia.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h3 className="font-bold text-white text-base">Artilharia</h3>
            {artilharia.map((a, i) => (
              <div key={a.chave} className="flex justify-between text-sm border-b border-slate-800/70 pb-1 last:border-none">
                <span className="text-slate-200"><strong>{i + 1}º</strong> {a.nome} <span className="text-xs text-slate-400">({a.time_nome})</span></span>
                <span className="text-emerald-400 font-bold">{a.gols} gol(s)</span>
              </div>
            ))}
          </div>
        )}

        {(premios.length > 0 || regras.length > 0) && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h3 className="font-bold text-white text-base flex items-center gap-2"><Award className="h-4 w-4 text-emerald-400" /> Premiação e Regulamento</h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              {premios.map((p, i) => <p key={i}><strong className="text-white">{p.pos}:</strong> {p.descricao}</p>)}
              {regras.map((r, i) => <p key={i}><strong className="text-white">{r.titulo}:</strong> {r.valor}</p>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
