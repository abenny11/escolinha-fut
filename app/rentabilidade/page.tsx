'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  CircleDollarSign, 
  Users, 
  Award, 
  Layers, 
  ArrowUpRight, 
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { mockClassProfitability } from '@/lib/mock-data';
import { ClassProfitability } from '@/lib/types';

export default function RentabilidadeTurmasPage() {
  const [classesData] = useState<ClassProfitability[]>(mockClassProfitability);
  const [selectedClass, setSelectedClass] = useState<ClassProfitability | null>(classesData[0]);

  // Totais Gerais
  const totalRevenue = classesData.reduce((acc, c) => acc + c.monthly_revenue, 0);
  const totalExpenses = classesData.reduce((acc, c) => acc + c.total_expenses, 0);
  const totalNetProfit = totalRevenue - totalExpenses;
  const overallMargin = Math.round((totalNetProfit / totalRevenue) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={12} /> Gestão Financeira por Horário
            </span>
            <span className="text-xs text-slate-400">Sportdesk DRE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Rentabilidade por Turma 📊
          </h1>
          <p className="text-sm text-slate-400">
            Analise receita de mensalidades, custos com professores e quadra, e o resultado financeiro de cada horário.
          </p>
        </div>
      </div>

      {/* Cards de Métricas Consolidadas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Faturamento das Turmas</span>
            <CircleDollarSign size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">R$ {totalRevenue.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-400 font-medium">86 mensalistas ativos</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Custos Operacionais</span>
            <Layers size={16} className="text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400 mt-1">R$ {totalExpenses.toFixed(2)}</p>
          <span className="text-[11px] text-slate-400 font-medium">Professores + Quadras</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Lucro Líquido Operacional</span>
            <ArrowUpRight size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-1">R$ {totalNetProfit.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-400 font-medium">Resultado mensal positivo</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Margem Média</span>
            <Award size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 mt-1">{overallMargin}%</p>
          <span className="text-[11px] text-amber-400 font-medium">Excelente eficiência</span>
        </div>
      </div>

      {/* Grid: Tabela de Turmas + Painel de Detalhes / Simulação */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela Principal de Rentabilidade */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-emerald-400" /> Comparativo Financeiro por Horário
            </h3>
            <span className="text-xs text-slate-400">Clique na turma para abrir o DRE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Turma & Categoria</th>
                  <th className="py-3 px-4">Ocupação</th>
                  <th className="py-3 px-4">Receita</th>
                  <th className="py-3 px-4">Custos</th>
                  <th className="py-3 px-4">Lucro Líquido</th>
                  <th className="py-3 px-4">Margem</th>
                  <th className="py-3 px-4 text-right">DRE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {classesData.map((c) => {
                  const isSelected = selectedClass?.class_id === c.class_id;
                  return (
                    <tr 
                      key={c.class_id}
                      onClick={() => setSelectedClass(c)}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-emerald-500/10' : 'hover:bg-slate-900/40'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{c.class_name}</p>
                        <p className="text-[11px] text-slate-400">{c.coach_name} • {c.modality_name}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-200">{c.enrolled_count}/{c.capacity}</span>
                          <span className="text-[10px] text-slate-400">({c.occupancy_rate}%)</span>
                        </div>
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              c.occupancy_rate >= 90 ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${c.occupancy_rate}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        R$ {c.monthly_revenue.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-rose-400">
                        R$ {c.total_expenses.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-400">
                        R$ {c.net_profit.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          c.margin_percentage >= 40 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {c.margin_percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <ChevronRight size={14} className={`inline ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-900/40 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Dica do Gestor: Turmas com ocupação acima de 80% geram a maior margem operacional do clube.</span>
          </div>
        </div>

        {/* Detalhe da Turma Selecionada / DRE Individual */}
        {selectedClass && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                DRE ESPECÍFICO DO HORÁRIO
              </span>
              <h3 className="text-lg font-black text-white">{selectedClass.class_name}</h3>
              <p className="text-xs text-slate-400">{selectedClass.modality_name} • {selectedClass.coach_name}</p>
            </div>

            {/* Decomposição Financeira */}
            <div className="space-y-2.5 p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Users size={14} className="text-emerald-400" /> (+) Receita de Mensalidades
                </span>
                <span className="font-bold text-emerald-400">R$ {selectedClass.monthly_revenue.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 pl-4">(-) Custo Professor / Treinador</span>
                <span className="text-rose-400">- R$ {selectedClass.coach_cost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400 pl-4">(-) Custo Quadra / Manutenção</span>
                <span className="text-rose-400">- R$ {selectedClass.court_cost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pt-2 font-black text-sm">
                <span className="text-white">(=) Lucro Líquido do Horário</span>
                <span className="text-emerald-400">R$ {selectedClass.net_profit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Margem de Contribuição</span>
                <span className="font-bold text-amber-400">{selectedClass.margin_percentage}%</span>
              </div>
            </div>

            {/* Simulação de Crescimento de Alunos */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                <Sparkles size={14} /> Simulação de Ocupação
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vagas restantes: <strong className="text-white">{selectedClass.capacity - selectedClass.enrolled_count} vagas</strong>.
                {selectedClass.capacity - selectedClass.enrolled_count > 0 ? (
                  <span>
                    {' '}Preenchendo essas vagas, o lucro deste horário salta para{' '}
                    <strong className="text-emerald-400">
                      R$ {(selectedClass.net_profit + (selectedClass.capacity - selectedClass.enrolled_count) * 140).toFixed(2)}/mês
                    </strong>.
                  </span>
                ) : (
                  <span> Turma com capacidade máxima! Considere abrir um horário extra com o professor.</span>
                )}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock size={14} />
                <span>Status da Turma:</span>
              </div>
              <span className="font-bold text-emerald-400 uppercase text-[11px]">
                {selectedClass.status === 'altamente_lucrativa' ? '✓ Altamente Lucrativa' : '✓ Equilibrada'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
