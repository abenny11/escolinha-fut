'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  FileText,
  Pause,
  Play,
  Plus,
  Radio,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';
import type {
  TipoEvento,
  Torneio,
  TorneioAtleta,
  TorneioEvento,
  TorneioJogo,
  TorneioTime,
} from '@/lib/torneios';

interface Props {
  torneio: Torneio;
  jogo: TorneioJogo;
  timeA?: TorneioTime | null;
  timeB?: TorneioTime | null;
  atletasA: TorneioAtleta[];
  atletasB: TorneioAtleta[];
  eventos: TorneioEvento[];
  onClose: () => void;
  onUpdateJogo: (patch: Partial<TorneioJogo>) => void;
  onAddEvento: (ev: Omit<TorneioEvento, 'id' | 'criado_em'>) => void;
  onRemoveEvento: (ev: TorneioEvento) => void;
  onAbrirSumula: () => void;
}

type AcaoRapida = { lado: 'a' | 'b'; tipo: TipoEvento } | null;

const PERIODO_LABEL: Record<number, string> = {
  1: '1º Tempo',
  2: '2º Tempo',
  3: 'Prorrogação',
};

export function PartidaAoVivoModal({
  torneio,
  jogo,
  timeA,
  timeB,
  atletasA,
  atletasB,
  eventos,
  onClose,
  onUpdateJogo,
  onAddEvento,
  onRemoveEvento,
  onAbrirSumula,
}: Props) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [acao, setAcao] = useState<AcaoRapida>(null);
  const [atletaId, setAtletaId] = useState('');
  const [atletaNomeManual, setAtletaNomeManual] = useState('');
  const [atletaSecId, setAtletaSecId] = useState('');
  const [minutoInput, setMinutoInput] = useState('');
  const [obsInput, setObsInput] = useState('');

  useEffect(() => {
    if (jogo.ao_vivo_pausado) return;
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [jogo.ao_vivo_pausado]);

  const segundosTotais = useMemo(() => {
    let sec = jogo.ao_vivo_segundos_acumulados || 0;
    if (!jogo.ao_vivo_pausado && jogo.ao_vivo_inicio) {
      sec += Math.max(0, Math.floor((nowMs - new Date(jogo.ao_vivo_inicio).getTime()) / 1000));
    }
    return sec;
  }, [jogo.ao_vivo_segundos_acumulados, jogo.ao_vivo_pausado, jogo.ao_vivo_inicio, nowMs]);

  const minutoAtual = Math.floor(segundosTotais / 60) + 1;
  const mm = String(Math.floor(segundosTotais / 60)).padStart(2, '0');
  const ss = String(segundosTotais % 60).padStart(2, '0');

  const eventosJogo = useMemo(
    () =>
      eventos
        .filter((e) => e.jogo_id === jogo.id)
        .sort((a, b) => (b.minuto ?? 0) - (a.minuto ?? 0) || b.criado_em.localeCompare(a.criado_em)),
    [eventos, jogo.id],
  );

  function toggleCronometro() {
    if (jogo.ao_vivo_pausado) {
      onUpdateJogo({
        status: 'ao_vivo',
        ao_vivo_pausado: false,
        ao_vivo_inicio: new Date().toISOString(),
        gols_a: jogo.gols_a ?? 0,
        gols_b: jogo.gols_b ?? 0,
      });
    } else {
      onUpdateJogo({
        ao_vivo_pausado: true,
        ao_vivo_segundos_acumulados: segundosTotais,
        ao_vivo_inicio: null,
      });
    }
  }

  function mudarPeriodo(novoPeriodo: number, isIntervalo = false) {
    onUpdateJogo({
      status: isIntervalo ? 'intervalo' : 'ao_vivo',
      ao_vivo_periodo: novoPeriodo,
      ao_vivo_pausado: isIntervalo,
      ao_vivo_segundos_acumulados: isIntervalo
        ? segundosTotais
        : novoPeriodo === 2
          ? (torneio.duracao_tempo_min || 20) * 60
          : segundosTotais,
      ao_vivo_inicio: isIntervalo ? null : new Date().toISOString(),
    });
  }

  function zerarCronometro() {
    onUpdateJogo({
      ao_vivo_pausado: true,
      ao_vivo_segundos_acumulados: 0,
      ao_vivo_inicio: null,
      ao_vivo_periodo: 1,
    });
  }

  function abrirAcao(lado: 'a' | 'b', tipo: TipoEvento) {
    setAcao({ lado, tipo });
    setAtletaId('');
    setAtletaNomeManual('');
    setAtletaSecId('');
    setMinutoInput(String(minutoAtual));
    setObsInput('');
  }

  function confirmarLance() {
    if (!acao) return;
    const listaAtletas = acao.lado === 'a' ? atletasA : atletasB;
    const timeId = acao.lado === 'a' ? jogo.time_a : jogo.time_b;
    const atletaObj = listaAtletas.find((a) => a.id === atletaId);
    const atletaSecObj = listaAtletas.find((a) => a.id === atletaSecId);
    const nomeAtleta = atletaObj?.nome || atletaNomeManual.trim() || undefined;

    if (acao.tipo === 'ocorrencia' && !obsInput.trim()) return;

    const minVal = minutoInput ? Math.max(0, Number(minutoInput)) : minutoAtual;
    onAddEvento({
      torneio_id: torneio.id,
      jogo_id: jogo.id,
      time_id: timeId,
      atleta_id: atletaObj?.id,
      atleta_nome: nomeAtleta,
      atleta_secundario_id: atletaSecObj?.id,
      atleta_secundario_nome: atletaSecObj?.nome,
      tipo: acao.tipo,
      minuto: minVal,
      periodo: jogo.ao_vivo_periodo || 1,
      observacao: obsInput.trim() || undefined,
    });
    setAcao(null);
  }

  function encerrarPartida() {
    onUpdateJogo({
      status: 'finalizado',
      ao_vivo_pausado: true,
      ao_vivo_segundos_acumulados: segundosTotais,
      ao_vivo_inicio: null,
      gols_a: jogo.gols_a ?? 0,
      gols_b: jogo.gols_b ?? 0,
    });
  }

  const nomeTime = (id: string | null) =>
    id === jogo.time_a ? timeA?.nome || 'Equipe A' : id === jogo.time_b ? timeB?.nome || 'Equipe B' : '—';

  const labelTipo = (t: TipoEvento) => {
    switch (t) {
      case 'gol':
        return 'GOL';
      case 'gol_contra':
        return 'GOL CONTRA';
      case 'cartao_amarelo':
        return 'Cartão Amarelo';
      case 'cartao_vermelho':
        return 'Cartão Vermelho';
      case 'falta':
        return 'Falta';
      case 'substituicao':
        return 'Substituição';
      case 'ocorrencia':
        return 'Ocorrência';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-2xl space-y-4">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className={`h-5 w-5 ${jogo.status === 'ao_vivo' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
            <h2 className="text-lg font-bold">Marcação Ao Vivo · Rodada {jogo.rodada}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onAbrirSumula();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/50"
            >
              <FileText className="h-4 w-4" /> Ver Súmula
            </button>
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Placar e Cronômetro */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-2xl font-bold tracking-wider">{mm}:{ss}</span>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                {PERIODO_LABEL[jogo.ao_vivo_periodo || 1] || `${jogo.ao_vivo_periodo}º Tempo`} ({minutoAtual}&apos;)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={toggleCronometro}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold ${
                  jogo.ao_vivo_pausado ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                }`}
              >
                {jogo.ao_vivo_pausado ? <><Play className="h-3.5 w-3.5" /> Iniciar</> : <><Pause className="h-3.5 w-3.5" /> Pausar</>}
              </button>
              <button type="button" onClick={() => mudarPeriodo(1, true)} className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-700">
                Intervalo
              </button>
              <button type="button" onClick={() => mudarPeriodo(2, false)} className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-700">
                2º Tempo
              </button>
              <button type="button" onClick={zerarCronometro} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800" title="Zerar cronômetro">
                <RotateCcw className="h-4 w-4" />
              </button>
              {jogo.status !== 'finalizado' && (
                <button type="button" onClick={encerrarPartida} className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Encerrar Jogo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 items-center text-center gap-2 py-2">
            <div>
              <p className="font-bold text-base sm:text-lg truncate">{timeA?.nome || 'Equipe A'}</p>
              <p className="text-xs text-slate-400">Faltas: {jogo.faltas_a ?? 0}</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl sm:text-5xl font-black tabular-nums text-white">{jogo.gols_a ?? 0}</span>
              <span className="text-xl text-slate-500">×</span>
              <span className="text-4xl sm:text-5xl font-black tabular-nums text-white">{jogo.gols_b ?? 0}</span>
            </div>
            <div>
              <p className="font-bold text-base sm:text-lg truncate">{timeB?.nome || 'Equipe B'}</p>
              <p className="text-xs text-slate-400">Faltas: {jogo.faltas_b ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Botões Rápidos */}
        <div className="grid sm:grid-cols-2 gap-3">
          {(['a', 'b'] as const).map((lado) => {
            const t = lado === 'a' ? timeA : timeB;
            return (
              <div key={lado} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 space-y-2">
                <p className="font-semibold text-sm text-slate-200 truncate">{t?.nome || (lado === 'a' ? 'Equipe A' : 'Equipe B')}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => abrirAcao(lado, 'gol')} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500">
                    <Trophy className="h-4 w-4" /> + Gol
                  </button>
                  <button type="button" onClick={() => abrirAcao(lado, 'cartao_amarelo')} className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20">
                    <AlertTriangle className="h-4 w-4" /> + Amarelo
                  </button>
                  <button type="button" onClick={() => abrirAcao(lado, 'cartao_vermelho')} className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20">
                    <ShieldAlert className="h-4 w-4" /> + Vermelho
                  </button>
                  <button type="button" onClick={() => abrirAcao(lado, 'falta')} className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700">
                    <Plus className="h-4 w-4" /> + Falta
                  </button>
                  <button type="button" onClick={() => abrirAcao(lado, 'substituicao')} className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700">
                    <ArrowLeftRight className="h-4 w-4" /> Substituição
                  </button>
                  <button type="button" onClick={() => abrirAcao(lado, 'gol_contra')} className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700">
                    <Plus className="h-4 w-4" /> Gol Contra
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={() => abrirAcao('a', 'ocorrencia')} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400">
            <FileText className="h-4 w-4" /> Registrar Ocorrência / Observação
          </button>
        </div>

        {/* Formulário Contextual */}
        {acao && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm text-emerald-400">
                {labelTipo(acao.tipo)} — {acao.lado === 'a' ? timeA?.nome : timeB?.nome}
              </p>
              <button type="button" onClick={() => setAcao(null)} className="text-xs text-slate-400 hover:text-white">
                Cancelar
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {acao.tipo !== 'ocorrencia' && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">{acao.tipo === 'substituicao' ? 'Atleta que SAI' : 'Atleta'}</label>
                  <select
                    value={atletaId}
                    onChange={(e) => setAtletaId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                  >
                    <option value="">Selecionar atleta...</option>
                    {(acao.lado === 'a' ? atletasA : atletasB).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.camisa != null ? `#${a.camisa} ` : ''}{a.nome}
                      </option>
                    ))}
                  </select>
                  {!atletaId && (
                    <input
                      placeholder="Ou digite o nome"
                      value={atletaNomeManual}
                      onChange={(e) => setAtletaNomeManual(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-white"
                    />
                  )}
                </div>
              )}

              {(acao.tipo === 'gol' || acao.tipo === 'substituicao') && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">
                    {acao.tipo === 'substituicao' ? 'Atleta que ENTRA' : 'Assistência (opcional)'}
                  </label>
                  <select
                    value={atletaSecId}
                    onChange={(e) => setAtletaSecId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                  >
                    <option value="">Selecionar atleta...</option>
                    {(acao.lado === 'a' ? atletasA : atletasB).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.camisa != null ? `#${a.camisa} ` : ''}{a.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-slate-400 block">Minuto</label>
                <input
                  type="number"
                  min={0}
                  max={150}
                  value={minutoInput}
                  onChange={(e) => setMinutoInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 block">
                {acao.tipo === 'ocorrencia' ? 'Descrição da Ocorrência *' : 'Observação / Motivo (opcional)'}
              </label>
              <input
                placeholder={acao.tipo === 'ocorrencia' ? 'Descreva o ocorrido...' : 'Ex: Falta tática, reclamação...'}
                value={obsInput}
                onChange={(e) => setObsInput(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={confirmarLance}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                Confirmar Lance
              </button>
            </div>
          </div>
        )}

        {/* Linha do Tempo */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-200">Linha do Tempo da Partida ({eventosJogo.length})</p>
          {eventosJogo.length === 0 ? (
            <p className="rounded-xl border border-slate-800 p-4 text-center text-xs text-slate-500">
              Nenhum evento registrado ainda. Inicie o cronômetro e use os botões acima para marcar ao vivo.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {eventosJogo.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="rounded border border-slate-700 px-1.5 py-0.5 font-mono text-xs text-slate-300">
                      {ev.minuto != null ? `${ev.minuto}'` : '--'}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                        ev.tipo === 'gol'
                          ? 'bg-emerald-600 text-white'
                          : ev.tipo === 'cartao_amarelo'
                            ? 'bg-amber-400 text-slate-950'
                            : ev.tipo === 'cartao_vermelho'
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-700 text-slate-100'
                      }`}
                    >
                      {labelTipo(ev.tipo)}
                    </span>
                    <span className="truncate font-medium text-slate-100">
                      {ev.tipo === 'substituicao'
                        ? `${ev.atleta_nome || '—'} → ${ev.atleta_secundario_nome || '—'}`
                        : ev.tipo === 'ocorrencia'
                          ? ev.observacao
                          : ev.atleta_nome || nomeTime(ev.time_id)}
                    </span>
                    <span className="text-xs text-slate-400 truncate hidden sm:inline">({nomeTime(ev.time_id)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveEvento(ev)}
                    className="rounded p-1 text-slate-400 hover:text-red-400"
                    title="Desfazer evento"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
