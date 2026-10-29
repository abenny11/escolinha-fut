'use client';

import { useState } from 'react';
import { 
  Trophy, 
  Users, 
  Clock, 
  Plus, 
  X
} from 'lucide-react';
import { mockClasses, mockModalities } from '@/lib/mock-data';
import { SportClass, ClassSchedule } from '@/lib/types';

export default function TurmasPage() {
  const [classes, setClasses] = useState<SportClass[]>(mockClasses);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    modalityId: mockModalities[0]?.id || '',
    ageGroup: 'Sub-9 (7 a 9 anos)',
    capacity: 20,
    coachName: 'Prof. Carlos Eduardo',
    weekday1: 'tuesday',
    time1: '09:00',
    location: 'Campo 1'
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const mod = mockModalities.find(m => m.id === newClass.modalityId);

    const created: SportClass = {
      id: `class-${Date.now()}`,
      name: newClass.name,
      modality_id: newClass.modalityId,
      modality_name: mod?.name || 'Futebol Society',
      age_group: newClass.ageGroup,
      capacity: Number(newClass.capacity),
      enrolled_count: 0,
      coach_name: newClass.coachName,
      status: 'active',
      schedules: [
        {
          id: `sch-${Date.now()}`,
          class_id: `class-${Date.now()}`,
          weekday: newClass.weekday1 as ClassSchedule['weekday'],
          start_time: newClass.time1,
          end_time: '10:15',
          location: newClass.location
        }
      ]
    };

    setClasses([...classes, created]);
    setIsNewClassModalOpen(false);
    alert('Nova turma cadastrada com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Turmas & Treinos ⚽
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestão de categorias, horários semanais, ocupação de vagas e professores responsáveis.
          </p>
        </div>

        <button
          onClick={() => setIsNewClassModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/10 self-start sm:self-auto"
        >
          <Plus size={18} />
          Nova Turma
        </button>
      </div>

      {/* Grid de Turmas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((sportClass) => {
          const isFull = (sportClass.enrolled_count || 0) >= sportClass.capacity;
          const occupancyRate = Math.round(((sportClass.enrolled_count || 0) / sportClass.capacity) * 100);

          return (
            <div
              key={sportClass.id}
              className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                {/* Header do Card */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                      {sportClass.modality_name}
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {sportClass.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{sportClass.age_group}</p>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isFull ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isFull ? 'Lotada' : 'Vagas Abertas'}
                  </span>
                </div>

                {/* Barra de Ocupação */}
                <div className="mt-4 p-3 bg-slate-900 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Ocupação ({occupancyRate}%)</span>
                    <span className="font-bold text-white">
                      {sportClass.enrolled_count} / {sportClass.capacity} alunos
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Detalhes de Horários e Professor */}
                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-500" />
                    <span>Professor: <strong className="text-white">{sportClass.coach_name}</strong></span>
                  </div>
                  {sportClass.schedules?.map((sch) => (
                    <div key={sch.id} className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} className="text-slate-500" />
                      <span>
                        {sch.weekday === 'monday' && 'Segunda-feira'}
                        {sch.weekday === 'tuesday' && 'Terça-feira'}
                        {sch.weekday === 'wednesday' && 'Quarta-feira'}
                        {sch.weekday === 'thursday' && 'Quinta-feira'}
                        {sch.weekday === 'friday' && 'Sexta-feira'}
                        {sch.weekday === 'saturday' && 'Sábado'} • {sch.start_time} às {sch.end_time} ({sch.location})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações do Card */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <a
                  href={`/chamada?turma=${sportClass.id}`}
                  className="text-xs font-bold text-emerald-400 hover:underline"
                >
                  Fazer Chamada →
                </a>
                <button className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                  Ver Alunos
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova Turma */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="text-emerald-400" size={20} /> Cadastrar Nova Turma
              </h2>
              <button 
                onClick={() => setIsNewClassModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 mt-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Nome da Turma *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sub-13 Manhã"
                  value={newClass.name}
                  onChange={e => setNewClass({...newClass, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Modalidade *</label>
                  <select
                    value={newClass.modalityId}
                    onChange={e => setNewClass({...newClass, modalityId: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {mockModalities.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Capacidade (Limite Alunos) *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={newClass.capacity}
                    onChange={e => setNewClass({...newClass, capacity: Number(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Professor Responsável *</label>
                  <input
                    type="text"
                    required
                    value={newClass.coachName}
                    onChange={e => setNewClass({...newClass, coachName: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Local / Campo *</label>
                  <input
                    type="text"
                    required
                    value={newClass.location}
                    onChange={e => setNewClass({...newClass, location: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
                >
                  Salvar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
