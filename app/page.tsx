'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CircleDollarSign, 
  CalendarCheck, 
  UserPlus, 
  CheckCircle2, 
  ChevronRight, 
  PhoneCall, 
  Sparkles, 
  Shirt, 
  BarChart3, 
  MessageSquare, 
  TrendingUp,
  UserMinus,
  Percent,
  Target,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Check,
  X
} from 'lucide-react';
import { mockSessions, mockCharges, mockManagementKPIs, mockStudents } from '@/lib/mock-data';

export default function DashboardPage() {
  const pendingCharges = mockCharges.filter(c => c.status === 'overdue' || c.status === 'pending');
  const kpis = mockManagementKPIs;

  // Estado do Sportdesk Workflow (Onboarding das 3 Etapas)
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Passo 1: Verifica se a escola já possui dados essenciais configurados
    try {
      const isConfigured = localStorage.getItem('escolinha_school_configured') === 'true';
      const savedSettings = localStorage.getItem('escolinha_pro_settings');
      if (isConfigured || savedSettings) {
        setStep1Done(true);
      }
    } catch {
      // fallback
    }

    // Passo 2: Alunos cadastrados (base ativa com alunos)
    if (mockStudents && mockStudents.length > 0) {
      setStep2Done(true);
    }

    // Passo 3: Operação centralizada (presenças, sessões ou financeiro ativos)
    if (mockSessions && mockSessions.length > 0) {
      setStep3Done(true);
    }

    try {
      const dismissed = localStorage.getItem('sportdesk_workflow_dismissed') === 'true';
      if (dismissed) {
        setIsDismissed(true);
      }
    } catch {
      // fallback
    }
  }, []);

  // Quando completar os 3 passos, o banner some da tela para desocupar espaço de trabalho
  const allStepsCompleted = step1Done && step2Done && step3Done;
  const showWorkflowBanner = !isDismissed && !allStepsCompleted;

  const handleDismissWorkflow = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('sportdesk_workflow_dismissed', 'true');
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Boas-vindas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              ⚽ Sportdesk Gestão
            </span>
            <span className="text-xs text-slate-400">Temporada 2026 Ativa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Visão Geral da Escola 🏆
          </h1>
          <p className="text-sm text-slate-400">
            Resumo em tempo real de matrículas, treinos, chamadas, financeiro e indicadores.
          </p>
        </div>

        {/* Status Operacional */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3.5 py-1.5 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">86 Alunos Ativos • 90.5% de Ocupação</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SPORTDESK: FLUXO DE GESTÃO EM 3 ETAPAS (ONBOARDING) */}
      {/* Some da tela automaticamente quando os 3 passos estiverem concluídos */}
      {/* ======================================================== */}
      {showWorkflowBanner && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">SPORTDESK WORKFLOW</span>
              <h2 className="text-base font-bold text-white">Como Funciona a Gestão da sua Escola</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:block">Operação 100% Centralizada</span>
              <button
                type="button"
                onClick={handleDismissWorkflow}
                title="Dispensar guia de implantação"
                className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Passo 1 */}
            <Link 
              href="/configuracoes"
              className={`p-4 rounded-xl border transition group relative ${
                step1Done 
                  ? 'bg-slate-950/90 border-emerald-500/40 hover:border-emerald-500' 
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center ${
                    step1Done ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                  }`}>
                    {step1Done ? <Check size={14} strokeWidth={3} /> : '1'}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                    Configure sua escola
                  </h3>
                </div>
                {step1Done && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    ✓ Concluído
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Cadastre sua identidade, logotipo, unidades, modalidades, professores, planos e horários.
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold mt-3 inline-block">
                {step1Done ? 'Revisar configurações →' : 'Acessar configurações →'}
              </span>
            </Link>

            {/* Passo 2 */}
            <Link 
              href="/alunos"
              className={`p-4 rounded-xl border transition group relative ${
                step2Done 
                  ? 'bg-slate-950/90 border-emerald-500/40 hover:border-emerald-500' 
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center ${
                    step2Done ? 'bg-emerald-500 text-slate-950' : 'bg-blue-500 text-slate-950'
                  }`}>
                    {step2Done ? <Check size={14} strokeWidth={3} /> : '2'}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                    Cadastre seus alunos
                  </h3>
                </div>
                {step2Done && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    ✓ Concluído
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Organize alunos, responsáveis, matrículas e informações financeiras em uma única base.
              </p>
              <span className="text-[11px] text-blue-400 font-semibold mt-3 inline-block">
                {step2Done ? 'Gerenciar base de alunos →' : 'Cadastrar primeiros alunos →'}
              </span>
            </Link>

            {/* Passo 3 */}
            <a 
              href="#indicadores"
              className={`p-4 rounded-xl border transition group cursor-pointer relative ${
                step3Done 
                  ? 'bg-slate-950/90 border-emerald-500/40 hover:border-emerald-500' 
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-purple-500/50 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center ${
                    step3Done ? 'bg-emerald-500 text-slate-950' : 'bg-purple-500 text-slate-950'
                  }`}>
                    {step3Done ? <Check size={14} strokeWidth={3} /> : '3'}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition">
                    Centralize a operação
                  </h3>
                </div>
                {step3Done && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    ✓ Concluído
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Use o Sportdesk no dia a dia para acompanhar presença, pagamentos, ocupação, comunicação e indicadores.
              </p>
              <span className="text-[11px] text-purple-400 font-semibold mt-3 inline-block">
                Ver indicadores abaixo ↓
              </span>
            </a>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INDICADORES DE GESTÃO EXECUTIVA (SPORTDESK KPIS) */}
      {/* ======================================================== */}
      <div id="indicadores" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Indicadores de Gestão Executiva</h2>
          </div>
          <span className="text-xs text-slate-400">Outubro / 2026 • Visão Geral Consolidada</span>
        </div>

        {/* Linha 1: Alunos, Retenção & Churn */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Alunos Ativos</span>
              <Users size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">{kpis.active_students}</p>
            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-emerald-400 font-semibold">
              <ArrowUpRight size={12} /> +10 alunos vs mês anterior
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Novas Matrículas</span>
              <UserPlus size={16} className="text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">{kpis.new_enrollments_month}</p>
            <span className="text-[11px] text-blue-400 font-medium">Entradas no mês</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Cancelamentos</span>
              <UserMinus size={16} className="text-rose-400" />
            </div>
            <p className="text-2xl font-black text-rose-400 mt-1">{kpis.cancellations_month}</p>
            <span className="text-[11px] text-slate-500 font-medium">Evasão controlada</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Taxa de Churn (Evasão)</span>
              <Percent size={16} className="text-amber-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400 mt-1">{kpis.churn_rate}%</p>
            <span className="text-[11px] text-emerald-400 font-medium">Altíssima retenção</span>
          </div>
        </div>

        {/* Linha 2: Faturamento, Despesas, Margem & Ticket Médio */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Faturamento Total</span>
              <CircleDollarSign size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">R$ {kpis.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <span className="text-[11px] text-emerald-400 font-medium">Mensalidades + Uniformes</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Despesas Operacionais</span>
              <Layers size={16} className="text-rose-400" />
            </div>
            <p className="text-2xl font-black text-rose-400 mt-1">R$ {kpis.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <span className="text-[11px] text-slate-500 font-medium">Professores e quadras</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Margem Líquida</span>
              <TrendingUp size={16} className="text-purple-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400 mt-1">{kpis.net_margin}%</p>
            <span className="text-[11px] text-purple-400 font-medium">Lucro operacional</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Ticket Médio / Aluno</span>
              <Target size={16} className="text-teal-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">R$ {kpis.average_ticket.toFixed(2)}</p>
            <span className="text-[11px] text-slate-400 font-medium">Média ponderada</span>
          </div>
        </div>

        {/* Linha 3: Ocupação de Vagas e Inadimplência */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400" /> Ocupação de Vagas ({kpis.overall_occupancy}%)
              </span>
              <span className="text-slate-400">{kpis.active_students}/{kpis.total_capacity} alunos</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                style={{ width: `${kpis.overall_occupancy}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Apenas <strong className="text-white">{kpis.total_capacity - kpis.active_students} vagas livres</strong>. As turmas Sub-11 e Sub-7 já estão 100% lotadas.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CircleDollarSign size={15} className="text-emerald-400" /> Inadimplência Controlada ({kpis.default_rate}%)
              </span>
              <span className="text-emerald-400 font-bold">95.2% em dia</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex">
              <div className="h-full bg-emerald-500" style={{ width: '95.2%' }} />
              <div className="h-full bg-rose-500" style={{ width: '4.8%' }} />
            </div>
            <p className="text-[11px] text-slate-400">
              Cobranças via WhatsApp e Pix reduziram a inadimplência para menos de 5%.
            </p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas Sportdesk */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Ações Rápidas Sportdesk</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/alunos"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
              <UserPlus size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Novo Aluno</p>
              <p className="text-[11px] text-slate-400">Cadastrar e matricular</p>
            </div>
          </Link>

          <Link
            href="/chamada"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition">
              <CalendarCheck size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Fazer Chamada</p>
              <p className="text-[11px] text-slate-400">Lista do treino de hoje</p>
            </div>
          </Link>

          <Link
            href="/experimentais"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Experimental</p>
              <p className="text-[11px] text-slate-400">Agendar e converter</p>
            </div>
          </Link>

          <Link
            href="/uniformes"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/80 transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-105 transition">
              <Shirt size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Uniformes</p>
              <p className="text-[11px] text-slate-400">Estoque & vendas</p>
            </div>
          </Link>

          <Link
            href="/financeiro"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
              <CircleDollarSign size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Financeiro</p>
              <p className="text-[11px] text-slate-400">Mensalidades & Pix</p>
            </div>
          </Link>

          <Link
            href="/financeiro"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
              <BarChart3 size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Rentabilidade</p>
              <p className="text-[11px] text-slate-400">Ver DRE no Financeiro</p>
            </div>
          </Link>

          <Link
            href="/desenvolvimento"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Desenvolvimento</p>
              <p className="text-[11px] text-slate-400">7 dimensões do atleta</p>
            </div>
          </Link>

          <Link
            href="/comunicacao"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/80 transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-105 transition">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Comunicação</p>
              <p className="text-[11px] text-slate-400">Mural & WhatsApp</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Grid de 2 Colunas: Treinos de Hoje e Alertas Financeiros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Treinos / Treinos de Hoje */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Treinos do Dia</h2>
              <p className="text-xs text-slate-400">Agenda e status da chamada</p>
            </div>
            <Link href="/turmas" className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1">
              Ver grade completa <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {mockSessions.slice(0, 3).map((session) => (
              <div 
                key={session.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-slate-200">{session.starts_at}</span>
                    <span className="text-[10px] text-slate-500">{session.location}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{session.class_name}</h3>
                    <p className="text-xs text-slate-400">{session.coach_name} • {session.modality_name}</p>
                  </div>
                </div>

                <div>
                  {session.attendance_completed ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 size={12} /> Chamada Feita
                    </span>
                  ) : (
                    <Link
                      href={`/chamada?sessao=${session.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
                    >
                      Realizar Chamada
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pendências Financeiras e Alertas de Mensalidade */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Pendências Financeiras</h2>
              <p className="text-xs text-slate-400">Cobranças vencidas ou próximas do vencimento</p>
            </div>
            <Link href="/financeiro" className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1">
              Ver financeiro <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {pendingCharges.map((charge) => (
              <div 
                key={charge.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{charge.student_name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      charge.status === 'overdue' 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {charge.status === 'overdue' ? 'Vencida' : 'Pendente'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Resp: {charge.guardian_name} • Vencimento: {charge.due_date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-200">
                    R$ {charge.final_amount.toFixed(2)}
                  </span>
                  <a
                    href={`https://wa.me/55${charge.guardian_phone}?text=Ol%C3%A1%20${encodeURIComponent(charge.guardian_name)},%20lembrete%20da%20mensalidade%20do(a)%20${encodeURIComponent(charge.student_name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
                    title="Cobrar via WhatsApp"
                  >
                    <PhoneCall size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
