'use client';

import Link from 'next/link';
import { 
  Users, 
  CircleDollarSign, 
  AlertTriangle, 
  CalendarCheck, 
  UserPlus, 
  CheckCircle2, 
  ChevronRight,
  PhoneCall,
  Sparkles,
  Shirt,
  BarChart3,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { mockSessions, mockCharges } from '@/lib/mock-data';

export default function DashboardPage() {
  const pendingCharges = mockCharges.filter(c => c.status === 'overdue' || c.status === 'pending');

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
          <span className="text-xs font-medium text-slate-300">Plano Pro • 86/300 Alunos Ativos</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SPORTDESK: FLUXO DE GESTÃO EM 3 ETAPAS */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">SPORTDESK WORKFLOW</span>
            <h2 className="text-base font-bold text-white">Como Funciona a Gestão da sua Escola</h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:block">Operação 100% Centralizada</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Passo 1 */}
          <Link 
            href="/configuracoes"
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900/60 transition group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">Configure sua escola</h3>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Cadastre sua identidade, logotipo, unidades, modalidades, professores, planos e horários.
            </p>
            <span className="text-[11px] text-emerald-400 font-semibold mt-3 inline-block">
              Acessar configurações →
            </span>
          </Link>

          {/* Passo 2 */}
          <Link 
            href="/alunos"
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/60 transition group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-blue-500 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">Cadastre seus alunos</h3>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Organize alunos, responsáveis, matrículas e informações financeiras em uma única base.
            </p>
            <span className="text-[11px] text-blue-400 font-semibold mt-3 inline-block">
              Ver base de alunos →
            </span>
          </Link>

          {/* Passo 3 */}
          <Link 
            href="/indicadores"
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-purple-500/50 hover:bg-slate-900/60 transition group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-purple-500 text-slate-950 font-black text-xs flex items-center justify-center">3</span>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition">Centralize a operação</h3>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Use o Sportdesk no dia a dia para acompanhar presença, pagamentos, ocupação, comunicação e indicadores.
            </p>
            <span className="text-[11px] text-purple-400 font-semibold mt-3 inline-block">
              Ver indicadores executivos →
            </span>
          </Link>
        </div>
      </div>

      {/* Grid de 4 Cards de Métricas Principais (Conforme MVP) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Alunos Ativos */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Alunos Ativos</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">86</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              +4 este mês
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Capacidade geral: 95 vagas</p>
        </div>

        {/* Card 2: Recebido no Mês */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recebido no Mês</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CircleDollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">R$ 5.840</span>
            <span className="text-xs text-slate-400 font-medium">Outubro</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">48 mensalidades quitadas</p>
        </div>

        {/* Card 3: Em Atraso */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Em Atraso</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400">R$ 920</span>
            <span className="text-xs text-rose-400/80 font-medium">6 alunos</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Cobrança via WhatsApp disponível</p>
        </div>

        {/* Card 4: Presença Média */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Presença Média</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <CalendarCheck size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">82%</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              +3% vs set
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Baseado nos treinos dos últimos 30 dias</p>
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
            href="/rentabilidade"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
              <BarChart3 size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Rentabilidade</p>
              <p className="text-[11px] text-slate-400">DRE por horário</p>
            </div>
          </Link>

          <Link
            href="/indicadores"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Indicadores</p>
              <p className="text-[11px] text-slate-400">KPIs & crescimento</p>
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
