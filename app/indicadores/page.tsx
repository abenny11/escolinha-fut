'use client';

import { 
  Users, 
  TrendingUp, 
  UserPlus, 
  UserMinus, 
  CircleDollarSign, 
  ArrowUpRight, 
  ShieldCheck, 
  Target, 
  Percent,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { mockManagementKPIs } from '@/lib/mock-data';

export default function IndicadoresGestaoPage() {
  const kpis = mockManagementKPIs;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Painel Executivo
            </span>
            <span className="text-xs text-slate-400">Sportdesk Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Indicadores de Gestão 📈
          </h1>
          <p className="text-sm text-slate-400">
            Acompanhe alunos ativos, retenção, novas matrículas, faturamento, despesas operacionais e margem de lucro.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-slate-300 self-start sm:self-auto">
          <Calendar size={14} className="text-emerald-400" />
          <span>Competência: <strong>Outubro / 2026</strong></span>
        </div>
      </div>

      {/* Grid 1: Crescimento & Retenção de Alunos */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Users size={14} className="text-emerald-400" /> Indicadores de Base & Alunos
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Alunos Ativos</span>
              <Users size={16} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white mt-1">{kpis.active_students}</p>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-semibold">
              <ArrowUpRight size={13} /> +10 alunos vs mês anterior
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Novas Matrículas</span>
              <UserPlus size={16} className="text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white mt-1">{kpis.new_enrollments_month}</p>
            <span className="text-[11px] text-blue-400 font-medium">Captação líquida no mês</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Cancelamentos (Evasão)</span>
              <UserMinus size={16} className="text-rose-400" />
            </div>
            <p className="text-3xl font-black text-rose-400 mt-1">{kpis.cancellations_month}</p>
            <span className="text-[11px] text-slate-400 font-medium">Mudança de cidade / horário</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Taxa de Churn (Evasão)</span>
              <Percent size={16} className="text-amber-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400 mt-1">{kpis.churn_rate}%</p>
            <span className="text-[11px] text-emerald-400 font-medium">Altíssima taxa de fidelização</span>
          </div>
        </div>
      </div>

      {/* Grid 2: Performance Financeira & Margens */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <CircleDollarSign size={14} className="text-emerald-400" /> Performance Financeira & Rentabilidade
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Faturamento Total</span>
              <CircleDollarSign size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">R$ {kpis.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <span className="text-[11px] text-emerald-400 font-medium">Mensalidades + Venda de Uniformes</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Despesas Operacionais</span>
              <Layers size={16} className="text-rose-400" />
            </div>
            <p className="text-2xl font-black text-rose-400 mt-1">R$ {kpis.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <span className="text-[11px] text-slate-400 font-medium">Professores, aluguel & bolas</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Resultado / Margem</span>
              <TrendingUp size={16} className="text-purple-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400 mt-1">{kpis.net_margin}%</p>
            <span className="text-[11px] text-purple-400 font-medium">Margem líquida esportiva</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Ticket Médio por Aluno</span>
              <Target size={16} className="text-teal-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">R$ {kpis.average_ticket.toFixed(2)}</p>
            <span className="text-[11px] text-slate-400 font-medium">Mensalidade média ponderada</span>
          </div>
        </div>
      </div>

      {/* Grid 3: Capacidade & Ocupação de Vagas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" /> Ocupação de Vagas nas Turmas
            </h3>
            <span className="text-xs font-bold text-emerald-400">{kpis.overall_occupancy}% ocupado</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>{kpis.active_students} vagas preenchidas</span>
              <span className="text-slate-400">Capacidade Total: {kpis.total_capacity} vagas</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                style={{ width: `${kpis.overall_occupancy}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Restam apenas <strong className="text-white">{kpis.total_capacity - kpis.active_students} vagas disponíveis</strong> somando todas as categorias (Sub-7, Sub-9, Sub-11, Sub-13 e Sub-15). As turmas de Sub-11 e Sub-7 já estão 100% preenchidas com fila de espera.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CircleDollarSign size={16} className="text-emerald-400" /> Saúde de Pagamentos & Inadimplência
            </h3>
            <span className="text-xs font-bold text-emerald-400">{kpis.default_rate}% inadimplência</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>95.2% em dia ou adiantado</span>
              <span className="text-rose-400">4.8% em atraso</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
              <div className="h-full bg-emerald-500" style={{ width: '95.2%' }} />
              <div className="h-full bg-rose-500" style={{ width: '4.8%' }} />
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            O envio automatizado de lembretes no WhatsApp e cobrança Pix via Sportdesk reduziu a taxa de inadimplência em mais de 60% comparado a carnês físicos.
          </p>
        </div>
      </div>
    </div>
  );
}
