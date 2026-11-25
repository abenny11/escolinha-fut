'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Copy,
  Edit,
  FileText,
  Plus,
  Search,
  ShieldAlert,
  Shuffle,
  Trash2,
  Trophy,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { mockStudents } from '@/lib/mock-data';
import { useDebounce } from '@/hooks/useDebounce';
import {
  avancarChaveMataMata,
  calcularArtilharia,
  calcularDisciplina,
  calcularTabela,
  CATEGORIAS_ESCOLINHA,
  CRITERIOS_LABEL,
  DEFAULT_TORNEIO_CONFIG,
  formatarRegrasTexto,
  gerarJogosTorneio,
  loadTorneiosStore,
  MODALIDADES,
  modalidadeNome,
  obterRegrasPadrao,
  parsePremio,
  parseRegras,
  POSICOES_ATLETA,
  saveTorneiosStore,
  ZERAR_CARTOES_LABEL,
  type CriterioDesempate,
  type ItemPremio,
  type ItemRegra,
  type Torneio,
  type TorneioAtleta,
  type TorneioConfig,
  type TorneioEvento,
  type TorneioJogo,
  type TorneiosStore,
  type TorneioSumula,
  type TorneioTime,
  type ZerarCartoesQuando,
} from '@/lib/torneios';
import { TorneioJogos, TorneioTabela } from '@/components/torneios/TorneioChaveamento';
import { PartidaAoVivoModal } from '@/components/torneios/PartidaAoVivoModal';
import { SumulaModal } from '@/components/torneios/SumulaModal';

const STATUS_LABEL: Record<string, string> = {
  inscricoes: 'Inscrições abertas',
  andamento: 'Em andamento',
  encerrado: 'Encerrado',
};

export default function TorneiosPage() {
  const [store, setStore] = useState<TorneiosStore | null>(null);
  const [busca, setBusca] = useState('');
  const buscaDebounced = useDebounce(busca, 200);
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [formTorneio, setFormTorneio] = useState<Partial<Torneio> | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    setStore(loadTorneiosStore());
  }, []);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const updateStore = (updater: (prev: TorneiosStore) => TorneiosStore) => {
    setStore((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveTorneiosStore(next);
      return next;
    });
  };

  const filtrados = useMemo(() => {
    if (!store) return [];
    const q = buscaDebounced.trim().toLowerCase();
    if (!q) return store.torneios;
    return store.torneios.filter(
      (t) =>
        t.nome.toLowerCase().includes(q) ||
        t.codigo.toLowerCase().includes(q) ||
        (t.categoria || '').toLowerCase().includes(q),
    );
  }, [store, buscaDebounced]);

  if (!store) {
    return <div className="p-8 text-sm text-slate-400">Carregando gestão de torneios...</div>;
  }

  const torneioAberto = abertoId ? store.torneios.find((t) => t.id === abertoId) : null;

  if (torneioAberto) {
    return (
      <>
        {toastMsg && (
          <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-xl">
            {toastMsg}
          </div>
        )}
        <TorneioPainel
          torneio={torneioAberto}
          store={store}
          updateStore={updateStore}
          notify={notify}
          onVoltar={() => setAbertoId(null)}
          onEditar={() => setFormTorneio(torneioAberto)}
        />
        {formTorneio && (
          <FormTorneioModal
            inicial={formTorneio}
            onClose={() => setFormTorneio(null)}
            onSave={(dados) => {
              updateStore((prev) => ({
                ...prev,
                torneios: prev.torneios.map((t) => (t.id === dados.id ? dados : t)),
              }));
              setFormTorneio(null);
              notify('Torneio atualizado!');
            }}
          />
        )}
      </>
    );
  }

  const jogosAgendados = store.jogos.filter((j) => j.status === 'agendado' || j.status === 'ao_vivo').length;
  const jogosFinalizados = store.jogos.filter((j) => j.status === 'finalizado' || j.status === 'wo').length;

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-xl">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-white">
            <Trophy className="h-6 w-6 text-emerald-400" /> Gestão de Torneios e Competições
          </h1>
          <p className="text-sm text-slate-400">
            Organize campeonatos do início ao fim: equipes, atletas da escola, chaveamento, marcação ao vivo e súmula oficial.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setFormTorneio({
              formato: 'mata-mata',
              modalidade: 'futebol',
              max_times: 8,
              duracao_tempo_min: 20,
              valor_inscricao: 0,
              status: 'inscricoes',
            })
          }
          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
        >
          <Plus className="h-4 w-4" /> Novo Torneio
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Torneios Cadastrados', val: store.torneios.length, icon: Trophy, color: 'text-emerald-400' },
          { label: 'Equipes / Atletas', val: `${store.times.length} / ${store.atletas.length}`, icon: Users, color: 'text-sky-400' },
          { label: 'Jogos (Agend. / Final.)', val: `${jogosAgendados} / ${jogosFinalizados}`, icon: Calendar, color: 'text-amber-400' },
          { label: 'Súmulas Registradas', val: store.sumulas.length, icon: FileText, color: 'text-purple-400' },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">{k.label}</p>
              <p className="text-2xl font-black text-white mt-0.5">{k.val}</p>
            </div>
            <k.icon className={`h-8 w-8 ${k.color} opacity-80`} />
          </div>
        ))}
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          placeholder="Buscar torneio por nome, código ou categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Lista de Torneios */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((t) => {
          const qtdTimes = store.times.filter((tm) => tm.torneio_id === t.id).length;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setAbertoId(t.id)}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left hover:border-emerald-500/60 transition space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-base text-white">{t.nome}</h3>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    t.status === 'andamento'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : t.status === 'inscricoes'
                        ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {STATUS_LABEL[t.status]}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {modalidadeNome(t.modalidade, t.modalidade_nome)} {t.categoria ? `· ${t.categoria}` : ''} · Cód:{' '}
                <span className="font-mono text-slate-200">{t.codigo}</span>
              </p>
              <div className="text-xs text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span>
                  {t.formato === 'mata-mata' ? 'Mata-mata' : 'Pontos corridos'} · {qtdTimes}/{t.max_times} equipes
                </span>
                {t.inicio && <span>{new Date(`${t.inicio}T12:00`).toLocaleDateString('pt-BR')}</span>}
              </div>
            </button>
          );
        })}
      </div>

      {formTorneio && (
        <FormTorneioModal
          inicial={formTorneio}
          onClose={() => setFormTorneio(null)}
          onSave={(dados) => {
            updateStore((prev) => ({
              ...prev,
              torneios: prev.torneios.some((t) => t.id === dados.id)
                ? prev.torneios.map((t) => (t.id === dados.id ? dados : t))
                : [dados, ...prev.torneios],
            }));
            setFormTorneio(null);
            notify('Torneio salvo!');
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// Modal Cadastro / Edição Torneio
// ============================================================

function FormTorneioModal({
  inicial,
  onClose,
  onSave,
}: {
  inicial: Partial<Torneio>;
  onClose: () => void;
  onSave: (t: Torneio) => void;
}) {
  const [nome, setNome] = useState(inicial.nome || '');
  const [modalidade, setModalidade] = useState(inicial.modalidade || 'futebol');
  const [modalidadeNomeTxt, setModalidadeNomeTxt] = useState(inicial.modalidade_nome || '');
  const [categoria, setCategoria] = useState(inicial.categoria || '');
  const [formato, setFormato] = useState<'mata-mata' | 'pontos'>(inicial.formato || 'mata-mata');
  const [inicio, setInicio] = useState(inicial.inicio || '');
  const [fim, setFim] = useState(inicial.fim || '');
  const [local, setLocal] = useState(inicial.local || '');
  const [maxTimes, setMaxTimes] = useState(String(inicial.max_times || 8));
  const [duracao, setDuracao] = useState(String(inicial.duracao_tempo_min || 20));
  const [valor, setValor] = useState(String(inicial.valor_inscricao ?? 0));
  const [status, setStatus] = useState(inicial.status || 'inscricoes');
  const [premios, setPremios] = useState<ItemPremio[]>(() => {
    const p = parsePremio(inicial.premio);
    return p.posicoes.length ? p.posicoes : [{ pos: 'Campeão', descricao: 'Troféu + Medalhas' }];
  });
  const [regras, setRegras] = useState<ItemRegra[]>(() => {
    const r = parseRegras(inicial.regras);
    return r.length ? r : obterRegrasPadrao(inicial.modalidade || 'futebol');
  });
  const [cfg, setCfg] = useState<TorneioConfig>(() => ({
    ...DEFAULT_TORNEIO_CONFIG,
    ...inicial.config,
  }));

  const inputCls = 'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none';

  function toggleCriterio(c: CriterioDesempate) {
    setCfg((prev) => {
      const exists = prev.criterios_desempate.includes(c);
      return {
        ...prev,
        criterios_desempate: exists
          ? prev.criterios_desempate.filter((x) => x !== c)
          : [...prev.criterios_desempate, c],
      };
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    onSave({
      id: inicial.id || `torn-${Math.random().toString(36).slice(2, 10)}`,
      codigo: inicial.codigo || Math.random().toString(36).slice(2, 8).toUpperCase(),
      nome: nome.trim(),
      modalidade,
      modalidade_nome: modalidade === 'outro' ? modalidadeNomeTxt.trim() || undefined : undefined,
      categoria: categoria || undefined,
      formato,
      inicio: inicio || undefined,
      fim: fim || undefined,
      local: local.trim() || undefined,
      max_times: Math.min(64, Math.max(2, Number(maxTimes) || 8)),
      duracao_tempo_min: Math.min(60, Math.max(5, Number(duracao) || 20)),
      valor_inscricao: Math.max(0, Number(valor) || 0),
      status: status as Torneio['status'],
      premio: JSON.stringify({ posicoes: premios.filter((p) => p.pos.trim() && p.descricao.trim()) }),
      regras: formatarRegrasTexto(regras) || undefined,
      config: cfg,
      criado_em: inicial.criado_em || new Date().toISOString(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold">{inicial.id ? 'Editar Torneio' : 'Novo Torneio'}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Nome do Torneio *</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Copa Escolinha 2026" className={inputCls} required />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Modalidade</label>
              <select
                value={modalidade}
                onChange={(e) => {
                  setModalidade(e.target.value);
                  if (!inicial.id) setRegras(obterRegrasPadrao(e.target.value));
                }}
                className={inputCls}
              >
                {MODALIDADES.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Categoria</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={inputCls}>
                <option value="">Opcional...</option>
                {CATEGORIAS_ESCOLINHA.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {modalidade === 'outro' && (
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Nome da Modalidade</label>
                <input value={modalidadeNomeTxt} onChange={(e) => setModalidadeNomeTxt(e.target.value)} className={inputCls} />
              </div>
            )}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Formato</label>
              <select value={formato} onChange={(e) => setFormato(e.target.value as 'mata-mata' | 'pontos')} className={inputCls}>
                <option value="mata-mata">Mata-mata (Chaveamento)</option>
                <option value="pontos">Todos contra todos (Pontos Corridos)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as Torneio['status'])} className={inputCls}>
                <option value="inscricoes">Inscrições abertas</option>
                <option value="andamento">Em andamento</option>
                <option value="encerrado">Encerrado</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Data de Início</label>
              <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Data de Término</label>
              <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Local / Sede</label>
              <input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Campo Principal" className={inputCls} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Máx. Equipes</label>
                <input type="number" min={2} max={64} value={maxTimes} onChange={(e) => setMaxTimes(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Tempo (min)</label>
                <input type="number" min={5} max={60} value={duracao} onChange={(e) => setDuracao(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Inscrição R$</label>
                <input type="number" min={0} step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Configurações Técnicas, Disciplina & Desempate */}
          <div className="space-y-3 rounded-xl border border-slate-800 p-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Configurações Técnicas, Disciplina &amp; Desempate
            </span>
            <div className="grid sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Amarelos p/ suspensão (0 = não)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={cfg.amarelos_suspensao}
                  onChange={(e) => setCfg((p) => ({ ...p, amarelos_suspensao: Math.max(0, Number(e.target.value)) }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Jogos suspensão (Vermelho)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={cfg.vermelho_jogos_suspensao}
                  onChange={(e) => setCfg((p) => ({ ...p, vermelho_jogos_suspensao: Math.max(1, Number(e.target.value)) }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Quando zera cartões?</label>
                <select
                  value={cfg.zerar_cartoes}
                  onChange={(e) => setCfg((p) => ({ ...p, zerar_cartoes: e.target.value as ZerarCartoesQuando }))}
                  className={inputCls}
                >
                  {(Object.keys(ZERAR_CARTOES_LABEL) as ZerarCartoesQuando[]).map((k) => (
                    <option key={k} value={k}>{ZERAR_CARTOES_LABEL[k]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Pts Vitória</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={cfg.pontos_vitoria}
                  onChange={(e) => setCfg((p) => ({ ...p, pontos_vitoria: Number(e.target.value) || 3 }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Pts Empate</label>
                <input
                  type="number"
                  min={0}
                  max={3}
                  value={cfg.pontos_empate}
                  onChange={(e) => setCfg((p) => ({ ...p, pontos_empate: Number(e.target.value) || 1 }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Faltas/tempo (0 = livre)</label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={cfg.limite_faltas_tempo}
                  onChange={(e) => setCfg((p) => ({ ...p, limite_faltas_tempo: Math.max(0, Number(e.target.value)) }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tolerância W.O. (min)</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={cfg.tolerancia_wo_min}
                  onChange={(e) => setCfg((p) => ({ ...p, tolerancia_wo_min: Math.max(0, Number(e.target.value)) }))}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cfg.ida_e_volta}
                  onChange={(e) => setCfg((p) => ({ ...p, ida_e_volta: e.target.checked }))}
                  className="accent-emerald-500"
                />
                Jogos Dentro e Fora de Casa (Turno e Returno / Ida e Volta)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cfg.gol_fora_desempate}
                  onChange={(e) => setCfg((p) => ({ ...p, gol_fora_desempate: e.target.checked }))}
                  className="accent-emerald-500"
                />
                Gol fora de casa como critério
              </label>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1.5">Critérios de Desempate Ativos (ordem de prioridade)</label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(CRITERIOS_LABEL) as CriterioDesempate[]).map((c) => {
                  const ativo = cfg.criterios_desempate.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCriterio(c)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition ${
                        ativo
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                          : 'border-slate-700 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {ativo ? `${cfg.criterios_desempate.indexOf(c) + 1}. ` : ''}{CRITERIOS_LABEL[c]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Premiação */}
          <div className="space-y-2 rounded-xl border border-slate-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Premiação</span>
              <button
                type="button"
                onClick={() => setPremios((p) => [...p, { pos: `${p.length + 1}º Lugar`, descricao: '' }])}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Colocação
              </button>
            </div>
            {premios.map((p, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  className={`${inputCls} w-36`}
                  value={p.pos}
                  onChange={(e) => setPremios((prev) => prev.map((x, i) => (i === idx ? { ...x, pos: e.target.value } : x)))}
                />
                <input
                  className={`${inputCls} flex-1`}
                  value={p.descricao}
                  onChange={(e) => setPremios((prev) => prev.map((x, i) => (i === idx ? { ...x, descricao: e.target.value } : x)))}
                />
                <button type="button" onClick={() => setPremios((prev) => prev.filter((_, i) => i !== idx))} className="p-2 text-slate-400 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Regulamento */}
          <div className="space-y-2 rounded-xl border border-slate-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Regulamento</span>
              <button type="button" onClick={() => setRegras(obterRegrasPadrao(modalidade))} className="text-xs text-slate-400 hover:text-white">
                Restaurar padrão
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {regras.map((r, idx) => (
                <div key={idx} className="grid sm:grid-cols-3 gap-2">
                  <input
                    value={r.titulo}
                    onChange={(e) => setRegras((prev) => prev.map((x, i) => (i === idx ? { ...x, titulo: e.target.value } : x)))}
                    className={inputCls}
                  />
                  <input
                    value={r.valor}
                    onChange={(e) => setRegras((prev) => prev.map((x, i) => (i === idx ? { ...x, valor: e.target.value } : x)))}
                    className={`${inputCls} sm:col-span-2`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300">
              Cancelar
            </button>
            <button type="submit" className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400">
              Salvar Torneio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Painel Completo do Torneio
// ============================================================

function TorneioPainel({
  torneio,
  store,
  updateStore,
  notify,
  onVoltar,
  onEditar,
}: {
  torneio: Torneio;
  store: TorneiosStore;
  updateStore: (fn: (prev: TorneiosStore) => TorneiosStore) => void;
  notify: (m: string) => void;
  onVoltar: () => void;
  onEditar: () => void;
}) {
  const [aba, setAba] = useState<'visao' | 'equipes' | 'jogos' | 'classificacao' | 'artilharia' | 'relatorios'>('jogos');

  const times = useMemo(() => store.times.filter((t) => t.torneio_id === torneio.id), [store.times, torneio.id]);
  const atletas = useMemo(() => store.atletas.filter((a) => a.torneio_id === torneio.id), [store.atletas, torneio.id]);
  const jogos = useMemo(
    () => store.jogos.filter((j) => j.torneio_id === torneio.id).sort((a, b) => a.rodada - b.rodada || a.ordem - b.ordem),
    [store.jogos, torneio.id],
  );
  const sumulas = useMemo(() => store.sumulas.filter((s) => s.torneio_id === torneio.id), [store.sumulas, torneio.id]);
  const eventos = useMemo(() => store.eventos.filter((e) => e.torneio_id === torneio.id), [store.eventos, torneio.id]);

  const tabela = useMemo(() => calcularTabela(times, jogos, torneio.config, eventos), [times, jogos, torneio.config, eventos]);
  const artilharia = useMemo(() => calcularArtilharia(eventos, times), [eventos, times]);
  const disciplina = useMemo(() => calcularDisciplina(eventos, times, torneio.config), [eventos, times, torneio.config]);
  const cfgAtiva = { ...DEFAULT_TORNEIO_CONFIG, ...torneio.config };

  // Forms equipes/atletas/jogos
  const [novoTimeNome, setNovoTimeNome] = useState('');
  const [novoTimeTec, setNovoTimeTec] = useState('');
  const [novoTimeTel, setNovoTimeTel] = useState('');
  const [timeAtletaModal, setTimeAtletaModal] = useState<TorneioTime | null>(null);
  const [alunoSelId, setAlunoSelId] = useState('');
  const [atletaNome, setAtletaNome] = useState('');
  const [atletaCamisa, setAtletaCamisa] = useState('');
  const [atletaPos, setAtletaPos] = useState('');

  const [manualJogoOpen, setManualJogoOpen] = useState(false);
  const [manualTimeA, setManualTimeA] = useState('');
  const [manualTimeB, setManualTimeB] = useState('');
  const [manualQuando, setManualQuando] = useState('');
  const [manualLocal, setManualLocal] = useState('');

  const [jogoAoVivoId, setJogoAoVivoId] = useState<string | null>(null);
  const [jogoSumulaId, setJogoSumulaId] = useState<string | null>(null);

  const jogoAoVivo = jogos.find((j) => j.id === jogoAoVivoId) || null;
  const jogoSumula = jogos.find((j) => j.id === jogoSumulaId) || null;

  const inputCls = 'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none';

  function adicionarTime(e: React.FormEvent) {
    e.preventDefault();
    if (!novoTimeNome.trim()) return;
    const novo: TorneioTime = {
      id: `tm-${Math.random().toString(36).slice(2, 10)}`,
      torneio_id: torneio.id,
      nome: novoTimeNome.trim(),
      tecnico: novoTimeTec.trim() || undefined,
      telefone: novoTimeTel.trim() || undefined,
      pago: true,
      criado_em: new Date().toISOString(),
    };
    updateStore((prev) => ({ ...prev, times: [...prev.times, novo] }));
    setNovoTimeNome('');
    setNovoTimeTec('');
    setNovoTimeTel('');
    notify('Equipe cadastrada!');
  }

  function adicionarAtleta(e: React.FormEvent) {
    e.preventDefault();
    if (!timeAtletaModal) return;
    const aluno = mockStudents.find((s) => s.id === alunoSelId);
    const nomeFinal = aluno?.full_name || atletaNome.trim();
    if (!nomeFinal) return;
    const novo: TorneioAtleta = {
      id: `atl-${Math.random().toString(36).slice(2, 10)}`,
      torneio_id: torneio.id,
      time_id: timeAtletaModal.id,
      student_id: aluno?.id,
      nome: nomeFinal,
      camisa: atletaCamisa ? Number(atletaCamisa) : undefined,
      posicao: atletaPos || aluno?.position || undefined,
      titular: true,
    };
    updateStore((prev) => ({ ...prev, atletas: [...prev.atletas, novo] }));
    setAlunoSelId('');
    setAtletaNome('');
    setAtletaCamisa('');
    notify('Atleta vinculado à equipe!');
  }

  function sortearJogos() {
    if (times.length < 2) return notify('Cadastre pelo menos 2 equipes para sortear.');
    const gerados = gerarJogosTorneio(torneio, times);
    updateStore((prev) => ({
      ...prev,
      torneios: prev.torneios.map((t) => (t.id === torneio.id ? { ...t, status: 'andamento' } : t)),
      jogos: [...prev.jogos.filter((j) => j.torneio_id !== torneio.id), ...gerados],
    }));
    notify(`${gerados.length} confronto(s) sorteado(s)!`);
  }

  function criarJogoManual(e: React.FormEvent) {
    e.preventDefault();
    if (!manualTimeA || !manualTimeB || manualTimeA === manualTimeB) return;
    const maxOrdem = jogos.filter((j) => j.rodada === 1).reduce((m, j) => Math.max(m, j.ordem), 0);
    const novo: TorneioJogo = {
      id: `jog-${Math.random().toString(36).slice(2, 10)}`,
      torneio_id: torneio.id,
      rodada: 1,
      ordem: maxOrdem + 1,
      time_a: manualTimeA,
      time_b: manualTimeB,
      gols_a: null,
      gols_b: null,
      penaltis_a: null,
      penaltis_b: null,
      faltas_a: 0,
      faltas_b: 0,
      quando: manualQuando ? new Date(manualQuando).toISOString() : undefined,
      local: manualLocal.trim() || torneio.local,
      status: 'agendado',
      ao_vivo_periodo: 1,
      ao_vivo_segundos_acumulados: 0,
      ao_vivo_pausado: true,
    };
    updateStore((prev) => ({ ...prev, jogos: [...prev.jogos, novo] }));
    setManualJogoOpen(false);
    setManualTimeA('');
    setManualTimeB('');
    notify('Confronto criado!');
  }

  function atualizarJogo(jogoId: string, patch: Partial<TorneioJogo>) {
    updateStore((prev) => {
      const updated = prev.jogos.map((j) => (j.id === jogoId ? { ...j, ...patch } : j));
      const doTorneio = avancarChaveMataMata(
        torneio,
        updated.filter((j) => j.torneio_id === torneio.id),
      );
      return {
        ...prev,
        jogos: [...updated.filter((j) => j.torneio_id !== torneio.id), ...doTorneio],
      };
    });
  }

  function adicionarEvento(ev: Omit<TorneioEvento, 'id' | 'criado_em'>) {
    const novo: TorneioEvento = {
      ...ev,
      id: `ev-${Math.random().toString(36).slice(2, 10)}`,
      criado_em: new Date().toISOString(),
    };
    updateStore((prev) => {
      const jogo = prev.jogos.find((j) => j.id === ev.jogo_id);
      let nextJogos = prev.jogos;
      if (jogo) {
        const isA = ev.time_id === jogo.time_a;
        const patch: Partial<TorneioJogo> = {};
        if (ev.tipo === 'gol') {
          if (isA) patch.gols_a = (jogo.gols_a ?? 0) + 1;
          else patch.gols_b = (jogo.gols_b ?? 0) + 1;
        } else if (ev.tipo === 'gol_contra') {
          if (isA) patch.gols_b = (jogo.gols_b ?? 0) + 1;
          else patch.gols_a = (jogo.gols_a ?? 0) + 1;
        } else if (ev.tipo === 'falta') {
          if (isA) patch.faltas_a = (jogo.faltas_a ?? 0) + 1;
          else patch.faltas_b = (jogo.faltas_b ?? 0) + 1;
        }
        if (Object.keys(patch).length > 0) {
          const updated = prev.jogos.map((j) => (j.id === jogo.id ? { ...j, ...patch } : j));
          const av = avancarChaveMataMata(torneio, updated.filter((j) => j.torneio_id === torneio.id));
          nextJogos = [...updated.filter((j) => j.torneio_id !== torneio.id), ...av];
        }
      }
      return { ...prev, eventos: [...prev.eventos, novo], jogos: nextJogos };
    });
    notify('Lance registrado ao vivo!');
  }

  function removerEvento(ev: TorneioEvento) {
    updateStore((prev) => {
      const jogo = prev.jogos.find((j) => j.id === ev.jogo_id);
      let nextJogos = prev.jogos;
      if (jogo) {
        const isA = ev.time_id === jogo.time_a;
        const patch: Partial<TorneioJogo> = {};
        if (ev.tipo === 'gol') {
          if (isA) patch.gols_a = Math.max(0, (jogo.gols_a ?? 0) - 1);
          else patch.gols_b = Math.max(0, (jogo.gols_b ?? 0) - 1);
        } else if (ev.tipo === 'gol_contra') {
          if (isA) patch.gols_b = Math.max(0, (jogo.gols_b ?? 0) - 1);
          else patch.gols_a = Math.max(0, (jogo.gols_a ?? 0) - 1);
        } else if (ev.tipo === 'falta') {
          if (isA) patch.faltas_a = Math.max(0, (jogo.faltas_a ?? 0) - 1);
          else patch.faltas_b = Math.max(0, (jogo.faltas_b ?? 0) - 1);
        }
        if (Object.keys(patch).length > 0) {
          const updated = prev.jogos.map((j) => (j.id === jogo.id ? { ...j, ...patch } : j));
          const av = avancarChaveMataMata(torneio, updated.filter((j) => j.torneio_id === torneio.id));
          nextJogos = [...updated.filter((j) => j.torneio_id !== torneio.id), ...av];
        }
      }
      return {
        ...prev,
        eventos: prev.eventos.filter((x) => x.id !== ev.id),
        jogos: nextJogos,
      };
    });
    notify('Evento desfeito.');
  }

  const linkPublico = typeof window !== 'undefined' ? `${window.location.origin}/torneios/${torneio.codigo}` : '';
  const totalGols = jogos.reduce((acc, j) => acc + (j.gols_a || 0) + (j.gols_b || 0), 0);
  const jogosFinalizados = jogos.filter((j) => j.status === 'finalizado' || j.gols_a != null).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onVoltar} className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">{torneio.nome}</h1>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                {STATUS_LABEL[torneio.status]}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {modalidadeNome(torneio.modalidade, torneio.modalidade_nome)}
              {torneio.categoria ? ` · ${torneio.categoria}` : ''} · {torneio.formato === 'mata-mata' ? 'Mata-mata' : 'Todos contra todos'} · Código{' '}
              <span className="font-mono text-slate-200">{torneio.codigo}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(linkPublico);
              notify('Link público copiado!');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-emerald-500/50"
          >
            <Copy className="h-3.5 w-3.5" /> Link Público
          </button>
          <button
            type="button"
            onClick={onEditar}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
          >
            <Edit className="h-3.5 w-3.5" /> Editar
          </button>
        </div>
      </div>

      {/* Abas */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2">
        {([
          ['visao', 'Visão Geral'],
          ['equipes', `Equipes & Atletas (${times.length})`],
          ['jogos', `Jogos & Chaveamento (${jogos.length})`],
          ['classificacao', 'Classificação'],
          ['artilharia', 'Artilharia & Disciplina'],
          ['relatorios', 'Relatórios'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setAba(id)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              aba === id ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {aba === 'visao' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <h3 className="text-sm font-bold text-white">Fluxo do Campeonato</h3>
            <div className="grid sm:grid-cols-5 gap-2 text-xs">
              {[
                { step: '1. Torneio', ok: true, desc: torneio.formato === 'mata-mata' ? 'Mata-mata' : 'Pontos corridos' },
                { step: '2. Equipes', ok: times.length >= 2, desc: `${times.length} equipe(s) · ${atletas.length} atleta(s)` },
                { step: '3. Jogos', ok: jogos.length > 0, desc: `${jogos.length} partida(s)` },
                { step: '4. Súmulas', ok: sumulas.some((s) => s.status === 'finalizada'), desc: `${sumulas.length} súmula(s)` },
                { step: '5. Conclusão', ok: torneio.status === 'encerrado', desc: STATUS_LABEL[torneio.status] },
              ].map((s) => (
                <div key={s.step} className={`rounded-xl border p-3 ${s.ok ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/40'}`}>
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{s.step}</span>
                    {s.ok && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-slate-400 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><Award className="h-4 w-4 text-emerald-400" /> Premiação</h3>
              {parsePremio(torneio.premio).posicoes.map((p, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-slate-800/70 pb-1 last:border-none">
                  <span className="font-medium text-slate-200">{p.pos}</span>
                  <span className="text-slate-400">{p.descricao}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><FileText className="h-4 w-4 text-emerald-400" /> Regulamento</h3>
              <div className="space-y-1.5 text-xs text-slate-300">
                {parseRegras(torneio.regras).map((r, i) => (
                  <p key={i}><strong className="text-white">{r.titulo}:</strong> {r.valor}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h3 className="text-sm font-bold text-white">Configurações Técnicas &amp; Disciplina</h3>
            <div className="grid sm:grid-cols-3 gap-2 text-xs text-slate-300">
              <p>Amarelos p/ suspensão: <strong className="text-white">{cfgAtiva.amarelos_suspensao || 'Não suspende'}</strong></p>
              <p>Vermelho: <strong className="text-white">{cfgAtiva.vermelho_jogos_suspensao} jogo(s) de suspensão</strong></p>
              <p>Zera cartões: <strong className="text-white">{ZERAR_CARTOES_LABEL[cfgAtiva.zerar_cartoes]}</strong></p>
              <p>Confrontos: <strong className="text-white">{cfgAtiva.ida_e_volta ? 'Dentro e Fora de Casa (Ida e Volta)' : 'Jogo Único / Turno Único'}</strong></p>
              <p>Pontuação: <strong className="text-white">{cfgAtiva.pontos_vitoria} vitória / {cfgAtiva.pontos_empate} empate</strong></p>
              <p>Tolerância W.O.: <strong className="text-white">{cfgAtiva.tolerancia_wo_min} min</strong></p>
            </div>
            <p className="text-xs text-slate-400">
              Critérios de desempate: <strong className="text-slate-200">{cfgAtiva.criterios_desempate.map((c) => CRITERIOS_LABEL[c]).join(' → ')}</strong>
            </p>
          </div>
        </div>
      )}

      {aba === 'equipes' && (
        <div className="space-y-4">
          <form onSubmit={adicionarTime} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 grid sm:grid-cols-4 gap-2">
            <input placeholder="Nome da equipe *" value={novoTimeNome} onChange={(e) => setNovoTimeNome(e.target.value)} className={inputCls} required />
            <input placeholder="Técnico / Responsável" value={novoTimeTec} onChange={(e) => setNovoTimeTec(e.target.value)} className={inputCls} />
            <input placeholder="Telefone / WhatsApp" value={novoTimeTel} onChange={(e) => setNovoTimeTel(e.target.value)} className={inputCls} />
            <button type="submit" className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 flex items-center justify-center gap-1">
              <Plus className="h-4 w-4" /> Adicionar Equipe
            </button>
          </form>

          <div className="grid sm:grid-cols-2 gap-4">
            {times.map((t) => {
              const listaAtl = atletas.filter((a) => a.time_id === t.id);
              return (
                <div key={t.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white">{t.nome}</h4>
                      <p className="text-xs text-slate-400">{t.tecnico ? `Téc: ${t.tecnico}` : 'Sem técnico'} · {listaAtl.length} atleta(s)</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setTimeAtletaModal(t)}
                        className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500/50"
                      >
                        <UserPlus className="h-3.5 w-3.5" /> Atleta
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStore((prev) => ({ ...prev, times: prev.times.filter((x) => x.id !== t.id) }))}
                        className="p-1.5 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    {listaAtl.length === 0 ? (
                      <p className="text-slate-500">Nenhum atleta vinculado.</p>
                    ) : (
                      listaAtl.map((a) => (
                        <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/50 px-2.5 py-1.5">
                          <span className="text-slate-200">
                            {a.camisa != null ? <strong className="text-emerald-400">#{a.camisa} </strong> : ''}
                            {a.nome}
                            {a.posicao ? <span className="text-slate-400"> · {a.posicao}</span> : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateStore((prev) => ({ ...prev, atletas: prev.atletas.filter((x) => x.id !== a.id) }))}
                            className="text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {aba === 'jogos' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-400">
              Use <strong>Ao Vivo</strong> para iniciar o cronômetro e marcar gols/faltas/cartões em tempo real, ou <strong>Súmula</strong> para PDF e OCR.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setManualJogoOpen(true)}
                className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
              >
                <Plus className="h-4 w-4" /> Jogo Manual
              </button>
              <button
                type="button"
                onClick={sortearJogos}
                className="flex items-center gap-1 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                <Shuffle className="h-4 w-4" /> {jogos.length > 0 ? 'Re-sortear Confrontos' : 'Sortear Confrontos'}
              </button>
            </div>
          </div>

          <TorneioJogos
            jogos={jogos}
            times={times}
            mata={torneio.formato === 'mata-mata'}
            sumulas={sumulas}
            onPlacar={(j, patch) =>
              atualizarJogo(j.id, {
                ...patch,
                status: patch.gols_a != null && patch.gols_b != null ? 'finalizado' : j.status,
              })
            }
            onAoVivo={(j) => setJogoAoVivoId(j.id)}
            onSumula={(j) => setJogoSumulaId(j.id)}
          />
        </div>
      )}

      {aba === 'classificacao' && <TorneioTabela linhas={tabela} />}

      {aba === 'artilharia' && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-400" /> Artilharia</h3>
            {artilharia.length === 0 ? (
              <p className="text-xs text-slate-500">Nenhum gol registrado ainda.</p>
            ) : (
              <div className="space-y-1.5 text-sm">
                {artilharia.map((a, i) => (
                  <div key={a.chave} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">
                    <div>
                      <span className="font-bold text-emerald-400 mr-2">{i + 1}º</span>
                      <span className="font-medium text-white">{a.nome}</span>
                      <span className="text-xs text-slate-400 ml-1.5">({a.time_nome})</span>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400">{a.gols} gol(s)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-400" /> Histórico Disciplinar</h3>
            {disciplina.length === 0 ? (
              <p className="text-xs text-slate-500">Nenhum cartão ou falta individual registrada.</p>
            ) : (
              <div className="space-y-1.5 text-sm">
                {disciplina.map((d) => (
                  <div key={d.chave} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">
                    <div>
                      <span className="font-medium text-white">{d.nome}</span>
                      <span className="text-xs text-slate-400 ml-1.5">({d.time_nome})</span>
                      {d.motivo_suspensao && (
                        <span className="block text-[11px] text-red-400">{d.motivo_suspensao}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      {d.amarelos > 0 && <span className="rounded bg-amber-400 px-1.5 py-0.5 font-bold text-slate-950">{d.amarelos} CA</span>}
                      {d.vermelhos > 0 && <span className="rounded bg-red-600 px-1.5 py-0.5 font-bold text-white">{d.vermelhos} CV</span>}
                      {d.faltas > 0 && <span className="rounded border border-slate-700 px-1.5 py-0.5 text-slate-300">{d.faltas} F</span>}
                      {d.suspenso && <span className="rounded bg-red-500/20 border border-red-500/40 px-2 py-0.5 font-bold text-red-400">Suspenso</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {aba === 'relatorios' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total de Gols', val: totalGols },
              { label: 'Média Gols / Jogo', val: jogosFinalizados ? (totalGols / jogosFinalizados).toFixed(2) : '0.00' },
              { label: 'Cartões Aplicados', val: eventos.filter((e) => e.tipo === 'cartao_amarelo' || e.tipo === 'cartao_vermelho').length },
              { label: 'Súmulas Finalizadas', val: `${sumulas.filter((s) => s.status === 'finalizada').length} / ${jogos.length}` },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="text-2xl font-black text-white mt-0.5">{s.val}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1.5 text-sm text-slate-300">
            <h3 className="font-bold text-white flex items-center gap-2 mb-2"><BarChart3 className="h-4 w-4 text-emerald-400" /> Resumo Técnico</h3>
            <p>Equipes inscritas: <strong className="text-white">{times.length}</strong></p>
            <p>Atletas vinculados: <strong className="text-white">{atletas.length}</strong></p>
            <p>Faltas registradas: <strong className="text-white">{jogos.reduce((s, j) => s + (j.faltas_a || 0) + (j.faltas_b || 0), 0)}</strong></p>
            {tabela[0] && <p>Melhor campanha: <strong className="text-emerald-400">{tabela[0].nome}</strong> ({tabela[0].pontos} pts, saldo {tabela[0].saldo})</p>}
            {artilharia[0] && <p>Artilheiro: <strong className="text-amber-400">{artilharia[0].nome}</strong> ({artilharia[0].gols} gols)</p>}
          </div>
        </div>
      )}

      {/* Modal Vincular Atleta */}
      {timeAtletaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Adicionar Atleta — {timeAtletaModal.nome}</h3>
              <button type="button" onClick={() => setTimeAtletaModal(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <form onSubmit={adicionarAtleta} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Aluno da Escolinha (opcional)</label>
                <select value={alunoSelId} onChange={(e) => setAlunoSelId(e.target.value)} className={inputCls}>
                  <option value="">Selecionar aluno matriculado...</option>
                  {mockStudents.map((al) => (
                    <option key={al.id} value={al.id}>{al.full_name} ({al.position})</option>
                  ))}
                </select>
              </div>
              {!alunoSelId && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Ou digite o nome do atleta</label>
                  <input value={atletaNome} onChange={(e) => setAtletaNome(e.target.value)} placeholder="Nome completo" className={inputCls} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nº Camisa</label>
                  <input type="number" min={1} max={99} value={atletaCamisa} onChange={(e) => setAtletaCamisa(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Posição</label>
                  <select value={atletaPos} onChange={(e) => setAtletaPos(e.target.value)} className={inputCls}>
                    <option value="">Posição...</option>
                    {POSICOES_ATLETA.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setTimeAtletaModal(null)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold">Fechar</button>
                <button type="submit" className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950">Vincular</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Jogo Manual */}
      {manualJogoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Adicionar Confronto Manual</h3>
              <button type="button" onClick={() => setManualJogoOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <form onSubmit={criarJogoManual} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Equipe A</label>
                <select value={manualTimeA} onChange={(e) => setManualTimeA(e.target.value)} className={inputCls} required>
                  <option value="">Selecione...</option>
                  {times.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Equipe B</label>
                <select value={manualTimeB} onChange={(e) => setManualTimeB(e.target.value)} className={inputCls} required>
                  <option value="">Selecione...</option>
                  {times.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Data e Hora</label>
                  <input type="datetime-local" value={manualQuando} onChange={(e) => setManualQuando(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Local / Campo</label>
                  <input value={manualLocal} onChange={(e) => setManualLocal(e.target.value)} placeholder="Campo 1" className={inputCls} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setManualJogoOpen(false)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold">Cancelar</button>
                <button type="submit" className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950">Criar Partida</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Marcação Ao Vivo */}
      {jogoAoVivo && (
        <PartidaAoVivoModal
          torneio={torneio}
          jogo={jogoAoVivo}
          timeA={times.find((t) => t.id === jogoAoVivo.time_a)}
          timeB={times.find((t) => t.id === jogoAoVivo.time_b)}
          atletasA={atletas.filter((a) => a.time_id === jogoAoVivo.time_a)}
          atletasB={atletas.filter((a) => a.time_id === jogoAoVivo.time_b)}
          eventos={eventos}
          onClose={() => setJogoAoVivoId(null)}
          onUpdateJogo={(patch) => atualizarJogo(jogoAoVivo.id, patch)}
          onAddEvento={adicionarEvento}
          onRemoveEvento={removerEvento}
          onAbrirSumula={() => setJogoSumulaId(jogoAoVivo.id)}
        />
      )}

      {/* Modal Súmula Oficial */}
      {jogoSumula && (
        <SumulaModal
          escolaNome="Sportdesk Escolinha"
          torneio={torneio}
          jogo={jogoSumula}
          timeA={times.find((t) => t.id === jogoSumula.time_a)}
          timeB={times.find((t) => t.id === jogoSumula.time_b)}
          atletasA={atletas.filter((a) => a.time_id === jogoSumula.time_a)}
          atletasB={atletas.filter((a) => a.time_id === jogoSumula.time_b)}
          sumula={sumulas.find((s) => s.jogo_id === jogoSumula.id)}
          eventos={eventos}
          onClose={() => setJogoSumulaId(null)}
          onSave={(sumulaData, jogoPatch, ocrEventos) => {
            atualizarJogo(jogoSumula.id, jogoPatch);
            updateStore((prev) => {
              const existing = prev.sumulas.find((s) => s.jogo_id === jogoSumula.id);
              const nextSumula: TorneioSumula = {
                ...sumulaData,
                id: existing?.id || `sum-${Math.random().toString(36).slice(2, 10)}`,
              };
              const nextSumulas = existing
                ? prev.sumulas.map((s) => (s.jogo_id === jogoSumula.id ? nextSumula : s))
                : [...prev.sumulas, nextSumula];
              const extraEventos: TorneioEvento[] = (ocrEventos || []).map((ev) => ({
                id: `ev-${Math.random().toString(36).slice(2, 10)}`,
                torneio_id: torneio.id,
                jogo_id: jogoSumula.id,
                time_id: ev.lado === 'a' ? jogoSumula.time_a : ev.lado === 'b' ? jogoSumula.time_b : null,
                atleta_nome: ev.atleta_nome,
                tipo: ev.tipo,
                minuto: ev.minuto,
                periodo: 1,
                observacao: 'Importado via OCR',
                criado_em: new Date().toISOString(),
              }));
              return { ...prev, sumulas: nextSumulas, eventos: [...prev.eventos, ...extraEventos] };
            });
            notify(sumulaData.status === 'finalizada' ? 'Súmula oficial finalizada!' : 'Súmula salva!');
          }}
        />
      )}
    </div>
  );
}
