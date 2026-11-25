'use client';

import { useMemo, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  FileDown,
  FileText,
  Loader2,
  Printer,
  Save,
  Sparkles,
  X,
} from 'lucide-react';
import { ocrFile } from '@/lib/ocr-client';
import { gerarSumulaPdf } from '@/lib/sumula-pdf';
import {
  parseSumulaOcr,
  type EscalacaoItem,
  type OcrSumulaResultado,
  type Torneio,
  type TorneioAtleta,
  type TorneioEvento,
  type TorneioJogo,
  type TorneioSumula,
  type TorneioTime,
} from '@/lib/torneios';

interface Props {
  escolaNome: string;
  torneio: Torneio;
  jogo: TorneioJogo;
  timeA?: TorneioTime | null;
  timeB?: TorneioTime | null;
  atletasA: TorneioAtleta[];
  atletasB: TorneioAtleta[];
  sumula?: TorneioSumula | null;
  eventos: TorneioEvento[];
  onClose: () => void;
  onSave: (
    sumulaData: Omit<TorneioSumula, 'id'>,
    jogoPatch: Partial<TorneioJogo>,
    ocrEventos?: OcrSumulaResultado['eventosDetectados'],
  ) => void;
}

export function SumulaModal({
  escolaNome,
  torneio,
  jogo,
  timeA,
  timeB,
  atletasA,
  atletasB,
  sumula,
  eventos,
  onClose,
  onSave,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [aba, setAba] = useState<'dados' | 'escalacao' | 'eventos' | 'ocr'>('dados');

  const [arbitro, setArbitro] = useState(sumula?.arbitro || '');
  const [auxiliar1, setAuxiliar1] = useState(sumula?.auxiliar_1 || '');
  const [auxiliar2, setAuxiliar2] = useState(sumula?.auxiliar_2 || '');
  const [mesario, setMesario] = useState(sumula?.mesario || '');
  const [local, setLocal] = useState(sumula?.local || jogo.local || torneio.local || '');
  const [dataRealizacao, setDataRealizacao] = useState(
    sumula?.data_realizacao || (jogo.quando ? jogo.quando.slice(0, 10) : new Date().toISOString().slice(0, 10)),
  );
  const [horaInicio, setHoraInicio] = useState(sumula?.hora_inicio || (jogo.quando ? jogo.quando.slice(11, 16) : ''));
  const [horaTermino, setHoraTermino] = useState(sumula?.hora_termino || '');
  const [golsA, setGolsA] = useState(jogo.gols_a != null ? String(jogo.gols_a) : '');
  const [golsB, setGolsB] = useState(jogo.gols_b != null ? String(jogo.gols_b) : '');
  const [penA, setPenA] = useState(jogo.penaltis_a != null ? String(jogo.penaltis_a) : '');
  const [penB, setPenB] = useState(jogo.penaltis_b != null ? String(jogo.penaltis_b) : '');
  const [faltasA, setFaltasA] = useState(String(jogo.faltas_a ?? 0));
  const [faltasB, setFaltasB] = useState(String(jogo.faltas_b ?? 0));
  const [ocorrencias, setOcorrencias] = useState(sumula?.ocorrencias || '');
  const [assArbitro, setAssArbitro] = useState(sumula?.assinatura_arbitro || '');
  const [assTecA, setAssTecA] = useState(sumula?.assinatura_tecnico_a || timeA?.tecnico || '');
  const [assTecB, setAssTecB] = useState(sumula?.assinatura_tecnico_b || timeB?.tecnico || '');

  const mapAtletas = (saved: EscalacaoItem[] | undefined, list: TorneioAtleta[]): EscalacaoItem[] => {
    if (saved && saved.length > 0) return saved;
    return list.map((a) => ({
      atleta_id: a.id,
      nome: a.nome,
      camisa: a.camisa,
      posicao: a.posicao,
      titular: a.titular,
    }));
  };
  const [escA, setEscA] = useState<EscalacaoItem[]>(() => mapAtletas(sumula?.escalacao_a, atletasA));
  const [escB, setEscB] = useState<EscalacaoItem[]>(() => mapAtletas(sumula?.escalacao_b, atletasB));

  const [lendoOcr, setLendoOcr] = useState(false);
  const [ocrErro, setOcrErro] = useState('');
  const [ocrResultado, setOcrResultado] = useState<OcrSumulaResultado | null>(null);
  const [ocrAplicarEventos, setOcrAplicarEventos] = useState<OcrSumulaResultado['eventosDetectados']>([]);

  const eventosJogo = useMemo(
    () => eventos.filter((e) => e.jogo_id === jogo.id).sort((a, b) => (a.minuto ?? 0) - (b.minuto ?? 0)),
    [eventos, jogo.id],
  );

  function salvar(finalizar: boolean) {
    const numOrNull = (v: string) => (v.trim() === '' ? null : Math.max(0, Number(v)));
    const jogoPatch: Partial<TorneioJogo> = {
      gols_a: numOrNull(golsA),
      gols_b: numOrNull(golsB),
      penaltis_a: numOrNull(penA),
      penaltis_b: numOrNull(penB),
      faltas_a: Math.max(0, Number(faltasA) || 0),
      faltas_b: Math.max(0, Number(faltasB) || 0),
      local: local.trim() || undefined,
    };
    if (finalizar) {
      jogoPatch.status = 'finalizado';
      jogoPatch.ao_vivo_pausado = true;
    }

    onSave(
      {
        torneio_id: torneio.id,
        jogo_id: jogo.id,
        arbitro: arbitro.trim() || undefined,
        auxiliar_1: auxiliar1.trim() || undefined,
        auxiliar_2: auxiliar2.trim() || undefined,
        mesario: mesario.trim() || undefined,
        local: local.trim() || undefined,
        data_realizacao: dataRealizacao || undefined,
        hora_inicio: horaInicio.trim() || undefined,
        hora_termino: horaTermino.trim() || undefined,
        escalacao_a: escA,
        escalacao_b: escB,
        ocorrencias: ocorrencias.trim() || undefined,
        assinatura_arbitro: assArbitro.trim() || undefined,
        assinatura_tecnico_a: assTecA.trim() || undefined,
        assinatura_tecnico_b: assTecB.trim() || undefined,
        ocr_texto_bruto: ocrResultado?.rawText || sumula?.ocr_texto_bruto,
        status: finalizar ? 'finalizada' : sumula?.status || 'rascunho',
        finalizada_em: finalizar ? new Date().toISOString() : sumula?.finalizada_em,
      },
      jogoPatch,
      ocrAplicarEventos.length > 0 ? ocrAplicarEventos : undefined,
    );
    if (finalizar) onClose();
  }

  function baixarPdf(emBranco: boolean) {
    const doc = gerarSumulaPdf({
      escolaNome,
      torneio,
      jogo: {
        ...jogo,
        gols_a: golsA === '' ? null : Number(golsA),
        gols_b: golsB === '' ? null : Number(golsB),
        penaltis_a: penA === '' ? null : Number(penA),
        penaltis_b: penB === '' ? null : Number(penB),
        faltas_a: Number(faltasA) || 0,
        faltas_b: Number(faltasB) || 0,
      },
      timeA,
      timeB,
      atletasA,
      atletasB,
      sumula: {
        arbitro,
        auxiliar_1: auxiliar1,
        auxiliar_2: auxiliar2,
        mesario,
        local,
        data_realizacao: dataRealizacao,
        hora_inicio: horaInicio,
        hora_termino: horaTermino,
        escalacao_a: escA,
        escalacao_b: escB,
        ocorrencias,
        assinatura_arbitro: assArbitro,
        assinatura_tecnico_a: assTecA,
        assinatura_tecnico_b: assTecB,
      },
      eventos: eventosJogo,
      emBranco,
    });
    doc.save(`sumula-${torneio.codigo}-r${jogo.rodada}-j${jogo.ordem}-${emBranco ? 'em-branco' : 'oficial'}.pdf`);
  }

  async function processarFotoOcr(file: File) {
    setLendoOcr(true);
    setOcrErro('');
    try {
      const { text } = await ocrFile(file);
      const parsed = parseSumulaOcr(text, timeA?.nome || '', timeB?.nome || '');
      setOcrResultado(parsed);
    } catch (e: unknown) {
      setOcrErro(e instanceof Error ? e.message : 'Erro ao processar OCR da imagem.');
    } finally {
      setLendoOcr(false);
    }
  }

  function aplicarOcr() {
    if (!ocrResultado) return;
    if (ocrResultado.gols_a != null) setGolsA(String(ocrResultado.gols_a));
    if (ocrResultado.gols_b != null) setGolsB(String(ocrResultado.gols_b));
    if (ocrResultado.arbitro) setArbitro(ocrResultado.arbitro);
    if (ocrResultado.local) setLocal(ocrResultado.local);
    if (ocrResultado.ocorrencias) {
      setOcorrencias((prev) => (prev ? `${prev}\n${ocrResultado.ocorrencias}` : ocrResultado.ocorrencias || ''));
    }
    if (ocrResultado.eventosDetectados.length > 0) {
      setOcrAplicarEventos(ocrResultado.eventosDetectados);
    }
    setAba('dados');
  }

  const toggleTitular = (lado: 'a' | 'b', idx: number) => {
    const setter = lado === 'a' ? setEscA : setEscB;
    setter((prev) => prev.map((item, i) => (i === idx ? { ...item, titular: !item.titular } : item)));
  };

  const inputCls = 'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-2xl space-y-4">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold">
              Súmula Oficial — {timeA?.nome || 'Equipe A'} × {timeB?.nome || 'Equipe B'}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => baixarPdf(true)}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold hover:border-slate-500"
            >
              <Printer className="h-3.5 w-3.5" /> PDF em Branco
            </button>
            <button
              type="button"
              onClick={() => baixarPdf(false)}
              className="flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
            >
              <FileDown className="h-3.5 w-3.5" /> Baixar PDF
            </button>
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Abas */}
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-900 p-1 text-xs font-semibold">
          {([
            ['dados', 'Dados & Placar'],
            ['escalacao', 'Escalação'],
            ['eventos', `Eventos (${eventosJogo.length})`],
            ['ocr', 'Foto + OCR'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setAba(id)}
              className={`rounded-lg py-2 transition ${aba === id ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {aba === 'dados' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Gols {timeA?.nome || 'A'}</label>
                <input type="number" min={0} value={golsA} onChange={(e) => setGolsA(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Gols {timeB?.nome || 'B'}</label>
                <input type="number" min={0} value={golsB} onChange={(e) => setGolsB(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Faltas {timeA?.nome || 'A'}</label>
                <input type="number" min={0} value={faltasA} onChange={(e) => setFaltasA(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Faltas {timeB?.nome || 'B'}</label>
                <input type="number" min={0} value={faltasB} onChange={(e) => setFaltasB(e.target.value)} className={inputCls} />
              </div>
              {torneio.formato === 'mata-mata' && golsA !== '' && golsA === golsB && (
                <>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Pênaltis {timeA?.nome || 'A'}</label>
                    <input type="number" min={0} value={penA} onChange={(e) => setPenA(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Pênaltis {timeB?.nome || 'B'}</label>
                    <input type="number" min={0} value={penB} onChange={(e) => setPenB(e.target.value)} className={inputCls} />
                  </div>
                </>
              )}
            </div>

            <div className="grid sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Data</label>
                <input type="date" value={dataRealizacao} onChange={(e) => setDataRealizacao(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Hora Início</label>
                <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Hora Término</label>
                <input type="time" value={horaTermino} onChange={(e) => setHoraTermino(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Local / Campo</label>
                <input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Campo 1" className={inputCls} />
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Árbitro Principal</label>
                <input value={arbitro} onChange={(e) => setArbitro(e.target.value)} placeholder="Nome do árbitro" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Auxiliar 1</label>
                <input value={auxiliar1} onChange={(e) => setAuxiliar1(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Auxiliar 2</label>
                <input value={auxiliar2} onChange={(e) => setAuxiliar2(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Mesário / Anotador</label>
                <input value={mesario} onChange={(e) => setMesario(e.target.value)} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Ocorrências e Observações Oficiais</label>
              <textarea
                rows={3}
                value={ocorrencias}
                onChange={(e) => setOcorrencias(e.target.value)}
                placeholder="Relato disciplinar, atrasos, condições do campo..."
                className={inputCls}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Assinatura do Árbitro</label>
                <input value={assArbitro} onChange={(e) => setAssArbitro(e.target.value)} placeholder="Nome completo" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Assinatura ({timeA?.nome || 'A'})</label>
                <input value={assTecA} onChange={(e) => setAssTecA(e.target.value)} placeholder="Técnico ou capitão" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Assinatura ({timeB?.nome || 'B'})</label>
                <input value={assTecB} onChange={(e) => setAssTecB(e.target.value)} placeholder="Técnico ou capitão" className={inputCls} />
              </div>
            </div>
          </div>
        )}

        {aba === 'escalacao' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {([
              { titulo: timeA?.nome || 'Equipe A', lista: escA, lado: 'a' as const },
              { titulo: timeB?.nome || 'Equipe B', lista: escB, lado: 'b' as const },
            ]).map((grupo) => (
              <div key={grupo.lado} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 space-y-2">
                <p className="font-semibold text-sm">{grupo.titulo}</p>
                {grupo.lista.length === 0 ? (
                  <p className="text-xs text-slate-500">Nenhum atleta cadastrado nesta equipe.</p>
                ) : (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto">
                    {grupo.lista.map((a, idx) => (
                      <label
                        key={idx}
                        className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm cursor-pointer hover:border-slate-700"
                      >
                        <span className="truncate">
                          {a.camisa != null ? `#${a.camisa} ` : ''}{a.nome}
                          {a.posicao ? <span className="text-xs text-slate-400"> · {a.posicao}</span> : ''}
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0 text-xs">
                          <input type="checkbox" checked={a.titular} onChange={() => toggleTitular(grupo.lado, idx)} className="accent-emerald-500" />
                          {a.titular ? 'Titular' : 'Reserva'}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {aba === 'eventos' && (
          <div className="space-y-2">
            {eventosJogo.length === 0 ? (
              <p className="rounded-xl border border-slate-800 p-6 text-center text-sm text-slate-400">
                Nenhum evento lançado. Use o modo &quot;Ao Vivo&quot; para registrar gols, cartões, faltas e substituições.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {eventosJogo.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-slate-700 px-1.5 py-0.5 font-mono text-xs">{ev.minuto != null ? `${ev.minuto}'` : '--'}</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-semibold">{ev.tipo.replace('_', ' ').toUpperCase()}</span>
                      <span className="font-medium">
                        {ev.tipo === 'substituicao'
                          ? `${ev.atleta_nome || '—'} → ${ev.atleta_secundario_nome || '—'}`
                          : ev.atleta_nome || ev.observacao || '—'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {ev.time_id === jogo.time_a ? timeA?.nome : ev.time_id === jogo.time_b ? timeB?.nome : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {aba === 'ocr' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-6 text-center space-y-3">
              <Camera className="h-10 w-10 mx-auto text-emerald-400" />
              <div>
                <p className="font-semibold">Digitalizar Súmula Impressa por Foto (OCR)</p>
                <p className="text-xs text-slate-400">
                  Tire foto ou envie imagem (JPG/PNG) da súmula preenchida à mão/impressa. O OCR extrai placar, árbitro, gols e cartões.
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,application/pdf"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) processarFotoOcr(f);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={lendoOcr}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
              >
                {lendoOcr ? <><Loader2 className="h-4 w-4 animate-spin" /> Lendo súmula...</> : <><Camera className="h-4 w-4" /> Tirar Foto / Enviar Imagem</>}
              </button>
              {ocrErro && <p className="text-xs text-red-400">{ocrErro}</p>}
            </div>

            {ocrResultado && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm flex items-center gap-1.5 text-emerald-400">
                    <Sparkles className="h-4 w-4" /> Dados Extraídos pelo OCR
                  </p>
                  <button type="button" onClick={aplicarOcr} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400">
                    Aplicar na Súmula
                  </button>
                </div>
                <div className="grid sm:grid-cols-3 gap-2 text-sm">
                  <div className="rounded-lg border border-slate-800 bg-slate-900 p-2">
                    <span className="text-xs text-slate-400 block">Placar detectado</span>
                    <strong>
                      {ocrResultado.gols_a != null && ocrResultado.gols_b != null
                        ? `${ocrResultado.gols_a} × ${ocrResultado.gols_b}`
                        : 'Não identificado'}
                    </strong>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900 p-2">
                    <span className="text-xs text-slate-400 block">Árbitro</span>
                    <strong>{ocrResultado.arbitro || 'Não identificado'}</strong>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900 p-2">
                    <span className="text-xs text-slate-400 block">Eventos detectados</span>
                    <strong>{ocrResultado.eventosDetectados.length} lance(s)</strong>
                  </div>
                </div>
                <textarea rows={4} value={ocrResultado.rawText} readOnly className={`${inputCls} font-mono text-xs`} />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => salvar(false)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold hover:bg-slate-800"
          >
            <Save className="h-4 w-4" /> Salvar Rascunho
          </button>
          <button
            type="button"
            onClick={() => salvar(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
          >
            <CheckCircle2 className="h-4 w-4" /> Finalizar Súmula Oficial
          </button>
        </div>
      </div>
    </div>
  );
}
