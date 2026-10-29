'use client';

import { useState } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Phone, 
  Plus, 
  Search, 
  UserCheck, 
  TrendingUp,
  X,
  Clock,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { mockTrialBookings, mockClasses } from '@/lib/mock-data';
import { TrialBooking, TrialStatus } from '@/lib/types';

export default function AulasExperimentaisPage() {
  const [trials, setTrials] = useState<TrialBooking[]>(mockTrialBookings);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState<TrialBooking | null>(null);

  // Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newAge, setNewAge] = useState(8);
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [newClassId, setNewClassId] = useState(mockClasses[0]?.id || '');
  const [newDate, setNewDate] = useState('2026-11-05');
  const [newTime, setNewTime] = useState('15:30');

  // Métricas
  const totalTrials = trials.length;
  const attendedCount = trials.filter(t => t.status === 'compareceu' || t.status === 'matriculado').length;
  const convertedCount = trials.filter(t => t.status === 'matriculado').length;
  const conversionRate = totalTrials > 0 ? Math.round((convertedCount / totalTrials) * 100) : 0;
  const scheduledCount = trials.filter(t => t.status === 'agendada').length;

  const handleCreateTrial = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = mockClasses.find(c => c.id === newClassId);
    const newTrial: TrialBooking = {
      id: `trial-${Date.now()}`,
      student_name: newStudentName,
      age: Number(newAge),
      guardian_name: newGuardianName,
      guardian_phone: newGuardianPhone,
      modality_name: targetClass?.modality_name || 'Futebol Society',
      preferred_class_id: newClassId,
      preferred_class_name: targetClass?.name || 'Sub-9',
      scheduled_date: newDate,
      scheduled_time: newTime,
      status: 'agendada',
      created_at: new Date().toISOString().split('T')[0],
      coach_feedback: 'Aula experimental recém-agendada pela secretaria.',
    };

    setTrials([newTrial, ...trials]);
    setShowModal(false);
    // Reset form
    setNewStudentName('');
    setNewGuardianName('');
    setNewGuardianPhone('');
    alert('Aula experimental agendada com sucesso!');
  };

  const handleUpdateStatus = (id: string, newStatus: TrialStatus) => {
    setTrials(trials.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if (selectedTrial && selectedTrial.id === id) {
      setSelectedTrial({ ...selectedTrial, status: newStatus });
    }
  };

  const handleConvertToEnrollment = (trial: TrialBooking) => {
    handleUpdateStatus(trial.id, 'matriculado');
    alert(`🎉 Parabéns! ${trial.student_name} foi convertido em Aluno Ativo da turma ${trial.preferred_class_name}! A matrícula foi formalizada.`);
  };

  const openWhatsAppConfirmation = (trial: TrialBooking) => {
    const text = `Olá ${trial.guardian_name}! Confirmamos a aula experimental do(a) ${trial.student_name} na turma ${trial.preferred_class_name} no dia ${trial.scheduled_date} às ${trial.scheduled_time}. Favor chegar 10 minutos antes com tênis/chuteira e garrafinha de água!`;
    const cleanPhone = trial.guardian_phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredTrials = trials.filter(t => {
    const matchStatus = filterStatus === 'todos' || t.status === filterStatus;
    const matchSearch = t.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.guardian_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.preferred_class_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Captação & Novos Alunos
            </span>
            <span className="text-xs text-slate-400">Sportdesk Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Aulas Experimentais ⚽
          </h1>
          <p className="text-sm text-slate-400">
            Agende aulas experimentais, acompanhe o comparecimento e converta novos alunos em 1 clique.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition self-start sm:self-auto"
        >
          <Plus size={18} /> Agendar Nova Experimental
        </button>
      </div>

      {/* Cards de Métricas do Funil */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Aulas Agendadas</span>
            <Calendar size={16} className="text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{scheduledCount}</p>
          <span className="text-[11px] text-purple-400 font-medium">Próximos treinos</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Comparecimento</span>
            <UserCheck size={16} className="text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{attendedCount}</p>
          <span className="text-[11px] text-blue-400 font-medium">Fizeram o treino</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Matrículas Fechadas</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{convertedCount}</p>
          <span className="text-[11px] text-emerald-400 font-medium">Convertidos em alunos</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Taxa de Conversão</span>
            <TrendingUp size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{conversionRate}%</p>
          <span className="text-[11px] text-amber-400 font-medium">Alta eficácia esportiva</span>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por aluno, responsável ou turma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'agendada', label: 'Agendadas' },
            { id: 'compareceu', label: 'Compareceram' },
            { id: 'matriculado', label: 'Matriculados 🏆' },
            { id: 'ausente', label: 'Ausentes' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === tab.id 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Aulas Experimentais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrials.map((trial) => {
          const isEnrolled = trial.status === 'matriculado';
          const isAttended = trial.status === 'compareceu';
          const isScheduled = trial.status === 'agendada';

          return (
            <div 
              key={trial.id}
              className={`bg-slate-950 border rounded-2xl p-5 flex flex-col justify-between transition hover:border-slate-700 ${
                isEnrolled ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {trial.student_name}
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                        {trial.age} anos
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Resp: <strong className="text-slate-300">{trial.guardian_name}</strong>
                    </p>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    trial.status === 'matriculado' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : trial.status === 'compareceu' 
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      : trial.status === 'agendada'
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}>
                    {trial.status === 'matriculado' && '🏆 Aluno Matriculado'}
                    {trial.status === 'compareceu' && '✓ Compareceu'}
                    {trial.status === 'agendada' && '📅 Agendada'}
                    {trial.status === 'ausente' && '✕ Não compareceu'}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock size={13} className="text-slate-500" />
                    <span>{trial.scheduled_date} às {trial.scheduled_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users size={13} className="text-slate-500" />
                    <span className="font-semibold text-emerald-400">{trial.preferred_class_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone size={13} className="text-slate-500" />
                    <span>{trial.guardian_phone}</span>
                  </div>
                </div>

                {trial.coach_feedback && (
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 italic">
                    &ldquo;{trial.coach_feedback}&rdquo;
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                <button
                  onClick={() => openWhatsAppConfirmation(trial)}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={13} className="text-emerald-400" /> WhatsApp
                </button>

                {isScheduled && (
                  <button
                    onClick={() => handleUpdateStatus(trial.id, 'compareceu')}
                    className="py-1.5 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-bold"
                  >
                    Marcar Presença
                  </button>
                )}

                {isAttended && (
                  <button
                    onClick={() => handleConvertToEnrollment(trial)}
                    className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition"
                  >
                    <CheckCircle2 size={15} /> Matricular Aluno Agora!
                  </button>
                )}

                {isEnrolled && (
                  <div className="w-full py-1 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 size={13} /> Matrícula Formalizada
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova Aula Experimental */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Agendar Aula Experimental ⚽</h3>
                <p className="text-xs text-slate-400">Cadastre a criança e agende a aula no horário da turma</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTrial} className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Nome da Criança *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pedro Henrique"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Idade *</label>
                  <input
                    type="number"
                    required
                    min={4}
                    max={17}
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Nome do Responsável *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mariana Silva"
                    value={newGuardianName}
                    onChange={(e) => setNewGuardianName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp do Responsável *</label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 98888-7777"
                    value={newGuardianPhone}
                    onChange={(e) => setNewGuardianPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Turma Sugerida *</label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {mockClasses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.age_group} ({c.coach_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Data da Aula *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Horário *</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
