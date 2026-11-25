'use client';

import { useState } from 'react';
import { Calendar, FileText, Radio } from 'lucide-react';
import {
  fase,
  vencedorDoJogo,
  type TabelaLinha,
  type TorneioJogo,
  type TorneioSumula,
  type TorneioTime,
} from '@/lib/torneios';

interface JogoCardProps {
  j: TorneioJogo;
  nome: (id: string | null) => string;
  mata: boolean;
  sumula?: TorneioSumula;
  onPlacar?: (j: TorneioJogo, patch: Partial<TorneioJogo>) => void;
  onAoVivo?: (j: TorneioJogo) => void;
  onSumula?: (j: TorneioJogo) => void;
}

function JogoCard({ j, nome, mata, sumula, onPlacar, onAoVivo, onSumula }: JogoCardProps) {
  const [ga, setGa] = useState(j.gols_a?.toString() ?? '');
  const [gb, setGb] = useState(j.gols_b?.toString() ?? '');
  const [pa, setPa] = useState(j.penaltis_a?.toString() ?? '');
  const [pb, setPb] = useState(j.penaltis_b?.toString() ?? '');

  const wo = mata && j.rodada === 1 && (!j.time_a || !j.time_b);
  const pronto = !!j.time_a && !!j.time_b;
  const vencedor = vencedorDoJogo(j);
  const n = (v: string) => (v === '' ? null : Math.max(0, Number(v)));

  const salvar = () =>
    onPlacar?.(j, {
      gols_a: n(ga),
      gols_b: n(gb),
      penaltis_a: n(pa),
      penaltis_b: n(pb),
    });

  const empate = mata && ga !== '' && ga === gb;
  const caixa =
    'h-8 w-10 rounded-lg border border-slate-700 bg-slate-900 text-center text-sm font-bold text-white focus:border-emerald-500 focus:outline-none';

  const linha = (id: string | null, gols: number | null, pen: number | null, lado: 'a' | 'b') => (
    <div className={`flex items-center gap-2 ${vencedor && vencedor === id ? 'font-bold text-emerald-400' : 'text-slate-200'}`}>
      <span className={`min-w-0 flex-1 truncate ${!id ? 'text-slate-500' : ''}`}>
        {id ? nome(id) : wo ? '—' : 'A definir'}
      </span>
      {onPlacar && pronto ? (
        <>
          <input
            inputMode="numeric"
            value={lado === 'a' ? ga : gb}
            onChange={(e) => (lado === 'a' ? setGa : setGb)(e.target.value.replace(/\D/g, ''))}
            onBlur={salvar}
            className={caixa}
            aria-label={`Gols ${nome(id)}`}
          />
          {empate && (
            <input
              inputMode="numeric"
              value={lado === 'a' ? pa : pb}
              onChange={(e) => (lado === 'a' ? setPa : setPb)(e.target.value.replace(/\D/g, ''))}
              onBlur={salvar}
              placeholder="pên"
              className={`${caixa} w-11 text-xs`}
              aria-label={`Pênaltis ${nome(id)}`}
            />
          )}
        </>
      ) : (
        <span className="w-10 text-right tabular-nums">
          {gols ?? ''}
          {pen != null && gols === (lado === 'a' ? j.gols_b : j.gols_a) ? (
            <small className="text-slate-400"> ({pen})</small>
          ) : null}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm shadow-sm">
      <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400">
        <span className="flex items-center gap-1 truncate">
          <Calendar className="h-3 w-3 shrink-0" />
          {j.quando
            ? new Date(j.quando).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
            : `Jogo ${j.ordem}`}
          {j.local ? ` · ${j.local}` : ''}
        </span>
        {j.status === 'ao_vivo' && (
          <span className="rounded-full bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 text-[10px] font-bold animate-pulse">
            AO VIVO
          </span>
        )}
        {j.status === 'finalizado' && (
          <span className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold">
            Finalizado
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {linha(j.time_a, j.gols_a, j.penaltis_a, 'a')}
        {linha(j.time_b, j.gols_b, j.penaltis_b, 'b')}
      </div>

      {wo && <p className="text-xs text-slate-500">Passou direto (sem adversário)</p>}

      {pronto && (onAoVivo || onSumula) && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
          {onAoVivo && (
            <button
              type="button"
              onClick={() => onAoVivo(j)}
              className={`flex-1 flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition ${
                j.status === 'ao_vivo'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-emerald-500/50 hover:text-emerald-400'
              }`}
            >
              <Radio className="h-3.5 w-3.5" /> Ao Vivo
            </button>
          )}
          {onSumula && (
            <button
              type="button"
              onClick={() => onSumula(j)}
              className={`flex-1 flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition ${
                sumula?.status === 'finalizada'
                  ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30'
                  : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-slate-500'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              {sumula?.status === 'finalizada' ? 'Súmula ✓' : 'Súmula'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function TorneioJogos({
  jogos,
  times,
  mata,
  sumulas = [],
  onPlacar,
  onAoVivo,
  onSumula,
}: {
  jogos: TorneioJogo[];
  times: TorneioTime[];
  mata: boolean;
  sumulas?: TorneioSumula[];
  onPlacar?: (j: TorneioJogo, patch: Partial<TorneioJogo>) => void;
  onAoVivo?: (j: TorneioJogo) => void;
  onSumula?: (j: TorneioJogo) => void;
}) {
  const nome = (id: string | null) => times.find((t) => t.id === id)?.nome ?? '—';
  const rodadas = [...new Set(jogos.map((j) => j.rodada))].sort((a, b) => a - b);
  const total = rodadas.length;

  if (!jogos.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center text-sm text-slate-400">
        Os confrontos aparecerão aqui após o sorteio ou criação manual dos jogos.
      </div>
    );
  }

  return (
    <div className={mata ? 'flex gap-4 overflow-x-auto pb-2' : 'space-y-4'}>
      {rodadas.map((r) => (
        <div key={r} className={mata ? 'flex w-64 shrink-0 flex-col justify-around gap-3' : 'space-y-2'}>
          <p className="text-sm font-bold text-slate-200">{mata ? fase(r, total) : `${r}ª rodada`}</p>
          <div className={mata ? 'flex flex-1 flex-col justify-around gap-3' : 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3'}>
            {jogos
              .filter((j) => j.rodada === r)
              .map((j) => (
                <JogoCard
                  key={`${j.id}-${j.time_a}-${j.time_b}-${j.gols_a}-${j.gols_b}-${j.status}`}
                  j={j}
                  nome={nome}
                  mata={mata}
                  sumula={sumulas.find((s) => s.jogo_id === j.id)}
                  onPlacar={onPlacar}
                  onAoVivo={onAoVivo}
                  onSumula={onSumula}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const COLUNAS: [string, string][] = [
  ['P', 'Pontos (vitória 3, empate 1)'],
  ['J', 'Jogos'],
  ['V', 'Vitórias'],
  ['E', 'Empates'],
  ['D', 'Derrotas'],
  ['GP', 'Gols pró'],
  ['GC', 'Gols contra'],
  ['SG', 'Saldo de gols'],
];

export function TorneioTabela({ linhas }: { linhas: TabelaLinha[] }) {
  if (!linhas.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center text-sm text-slate-400">
        Nenhuma equipe inscrita ainda para exibir a classificação.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
      <table className="w-full min-w-[460px] text-sm">
        <thead className="bg-slate-900/80 text-xs text-slate-400">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Equipe</th>
            {COLUNAS.map(([sigla, title]) => (
              <th key={sigla} className="p-3 text-center" title={title}>
                {sigla}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={l.id} className="border-t border-slate-800/80 text-center tabular-nums hover:bg-slate-900/40">
              <td className="p-3 text-left font-bold text-emerald-400">{i + 1}º</td>
              <td className="p-3 text-left font-medium text-slate-100">{l.nome}</td>
              <td className="p-3 font-bold text-white">{l.pontos}</td>
              <td className="p-3 text-slate-300">{l.jogos}</td>
              <td className="p-3 text-slate-300">{l.vitorias}</td>
              <td className="p-3 text-slate-300">{l.empates}</td>
              <td className="p-3 text-slate-300">{l.derrotas}</td>
              <td className="p-3 text-slate-300">{l.gols_pro}</td>
              <td className="p-3 text-slate-300">{l.gols_contra}</td>
              <td className="p-3 text-slate-300">{l.saldo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
