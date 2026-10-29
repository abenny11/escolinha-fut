'use client';

import { useState } from 'react';
import { 
  CircleDollarSign, 
  Search, 
  PhoneCall, 
  X,
  BarChart3,
  Users,
  Layers,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
  Award,
  Clock
} from 'lucide-react';
import { mockCharges, mockClassProfitability } from '@/lib/mock-data';
import { Charge, ChargeStatus, PaymentMethod, ClassProfitability } from '@/lib/types';

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState<'mensalidades' | 'rentabilidade'>('mensalidades');
  const [charges, setCharges] = useState<Charge[]>(mockCharges);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Rentabilidade por Turma State
  const [classesData] = useState<ClassProfitability[]>(mockClassProfitability);
  const [selectedClass, setSelectedClass] = useState<ClassProfitability | null>(classesData[0]);

  // Totais Gerais de Rentabilidade
  const totalClassesRevenue = classesData.reduce((acc, c) => acc + c.monthly_revenue, 0);
  const totalClassesExpenses = classesData.reduce((acc, c) => acc + c.total_expenses, 0);
  const totalClassesNetProfit = totalClassesRevenue - totalClassesExpenses;
  const overallMargin = Math.round((totalClassesNetProfit / totalClassesRevenue) * 100);

  // Modal de Baixar Pagamento
  const [payingCharge, setPayingCharge] = useState<Charge | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  const filteredCharges = charges.filter(charge => {
    const matchesStatus = filterStatus === 'all' || charge.status === filterStatus;
    const matchesSearch = 
      charge.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.guardian_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenPayment = (charge: Charge) => {
    setPayingCharge(charge);
    setPaymentAmount((charge.final_amount - charge.paid_amount).toFixed(2));
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingCharge) return;

    const amountPaidNow = parseFloat(paymentAmount) || 0;
    if (amountPaidNow <= 0) {
      alert('Informe um valor de pagamento válido.');
      return;
    }

    const updated = charges.map(c => {
      if (c.id === payingCharge.id) {
        const newPaid = c.paid_amount + amountPaidNow;
        const newStatus: ChargeStatus = newPaid >= c.final_amount ? 'paid' : 'partial';
        return {
          ...c,
          paid_amount: newPaid,
          status: newStatus,
          notes: `Recebido R$ ${amountPaidNow.toFixed(2)} via ${paymentMethod.toUpperCase()}`
        };
      }
      return c;
    });

    setCharges(updated);
    setPayingCharge(null);
    alert('Pagamento registrado com sucesso!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              💵 Gestão Financeira Sportdesk
            </span>
            <span className="text-xs text-slate-400">Mensalidades & DRE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Financeiro & Rentabilidade 📊
          </h1>
          <p className="text-sm text-slate-400">
            Controle de mensalidades, cobranças no WhatsApp e análise de rentabilidade de cada horário e turma.
          </p>
        </div>
      </div>

      {/* Seletor de Abas: Mensalidades vs Rentabilidade por Turma */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('mensalidades')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'mensalidades' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <CircleDollarSign size={16} /> Mensalidades & Cobranças
        </button>
        <button
          onClick={() => setActiveTab('rentabilidade')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'rentabilidade' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 size={16} /> Rentabilidade por Turma (DRE)
        </button>
      </div>

      {/* ======================================================== */}
      {/* ABA 1: MENSALIDADES E COBRANÇAS */}
      {/* ======================================================== */}
      {activeTab === 'mensalidades' && (
        <div className="space-y-6">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Recebido (Mês)</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">R$ 5.840,00</p>
              <p className="text-xs text-slate-500 mt-1">48 mensalidades quitadas</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Em Aberto / A Vencer</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">R$ 2.450,00</p>
              <p className="text-xs text-slate-500 mt-1">18 cobranças dentro do prazo</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Inadimplência / Atraso</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-2">R$ 920,00</p>
              <p className="text-xs text-slate-500 mt-1">6 mensalidades vencidas</p>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por aluno ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todos os status</option>
                <option value="pending">A Vencer / Pendente</option>
                <option value="overdue">Vencida / Atrasada</option>
                <option value="paid">Paga / Quitada</option>
                <option value="partial">Parcialmente Paga</option>
              </select>
            </div>
          </div>

          {/* Tabela de Mensalidades */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4">Aluno / Turma</th>
                    <th className="py-3.5 px-4">Responsável</th>
                    <th className="py-3.5 px-4">Competência</th>
                    <th className="py-3.5 px-4">Vencimento</th>
                    <th className="py-3.5 px-4">Valor</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {filteredCharges.map((charge) => (
                    <tr key={charge.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-white">{charge.student_name}</p>
                        <p className="text-xs text-slate-500">{charge.class_name}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-slate-200">{charge.guardian_name}</p>
                        <p className="text-xs text-slate-500">{charge.guardian_phone}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {charge.competence}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {charge.due_date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white">R$ {charge.final_amount.toFixed(2)}</span>
                        {charge.paid_amount > 0 && (
                          <p className="text-[11px] text-emerald-400">Pago: R$ {charge.paid_amount.toFixed(2)}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {charge.status === 'paid' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Paga
                          </span>
                        )}
                        {charge.status === 'overdue' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Vencida
                          </span>
                        )}
                        {charge.status === 'pending' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Pendente
                          </span>
                        )}
                        {charge.status === 'partial' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Parcial
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {charge.status !== 'paid' && (
                            <>
                              <a
                                href={`https://wa.me/55${charge.guardian_phone}?text=Ol%C3%A1%20${encodeURIComponent(charge.guardian_name)},%20tudo%20bem?%20Segue%20o%20lembrete%20da%20mensalidade%20do(a)%20${encodeURIComponent(charge.student_name)}%20no%20valor%20de%20R$%20${charge.final_amount.toFixed(2)}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
                                title="Cobrar pelo WhatsApp"
                              >
                                <PhoneCall size={14} />
                              </a>
                              <button
                                onClick={() => handleOpenPayment(charge)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                              >
                                Receber
                              </button>
                            </>
                          )}
                          {charge.status === 'paid' && (
                            <span className="text-xs text-slate-500">Quitada</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 2: RENTABILIDADE POR TURMA */}
      {/* ======================================================== */}
      {activeTab === 'rentabilidade' && (
        <div className="space-y-6">
          {/* Cards de Métricas Consolidadas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Faturamento das Turmas</span>
                <CircleDollarSign size={16} className="text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1">R$ {totalClassesRevenue.toFixed(2)}</p>
              <span className="text-[11px] text-emerald-400 font-medium">86 mensalistas ativos</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Custos Operacionais</span>
                <Layers size={16} className="text-rose-400" />
              </div>
              <p className="text-2xl font-black text-rose-400 mt-1">R$ {totalClassesExpenses.toFixed(2)}</p>
              <span className="text-[11px] text-slate-400 font-medium">Professores + Quadras</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Lucro Líquido Operacional</span>
                <ArrowUpRight size={16} className="text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-400 mt-1">R$ {totalClassesNetProfit.toFixed(2)}</p>
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
                <span>Dica: Turmas com ocupação acima de 80% geram a maior margem operacional da escolinha.</span>
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
      )}

      {/* Modal de Baixa de Pagamento */}
      {payingCharge && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CircleDollarSign className="text-emerald-400" size={20} /> Registrar Pagamento
              </h2>
              <button 
                onClick={() => setPayingCharge(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4 mt-4">
              <div className="p-3 bg-slate-900 rounded-xl space-y-1">
                <p className="text-xs text-slate-400">Aluno: <span className="text-white font-semibold">{payingCharge.student_name}</span></p>
                <p className="text-xs text-slate-400">Responsável: <span className="text-white font-semibold">{payingCharge.guardian_name}</span></p>
                <p className="text-xs text-slate-400">Competência: <span className="text-white font-mono">{payingCharge.competence}</span></p>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Valor do Recebimento (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Forma de Pagamento *</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="pix">PIX (Chave ou QR Code)</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="debit_card">Cartão de Débito</option>
                  <option value="cash">Dinheiro em Espécie</option>
                  <option value="transfer">Transferência Bancária</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPayingCharge(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
                >
                  Confirmar Baixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
