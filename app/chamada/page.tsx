'use client';

import { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Check, 
  Save, 
  ShieldAlert, 
  CheckCheck, 
  RotateCcw,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';
import { mockClasses, mockStudents } from '@/lib/mock-data';
import { AttendanceStatus } from '@/lib/types';

export default function ChamadaPage() {
  const [selectedClassId, setSelectedClassId] = useState<string>(mockClasses[1]?.id || mockClasses[0]?.id);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [justificationModalStudent, setJustificationModalStudent] = useState<string | null>(null);

  // Turma e alunos selecionados
  const currentClass = mockClasses.find(c => c.id === selectedClassId);
  const classStudents = mockStudents.filter(s => s.current_class?.id === selectedClassId);

  // Estado da chamada: alunoId -> { status, notes }
  const [attendance, setAttendance] = useState<Record<string, { status: AttendanceStatus; notes: string }>>({
    'stu-2': { status: 'present', notes: '' },
    'stu-4': { status: 'late', notes: 'Chegou às 15:45' },
  });

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        status,
        notes: prev[studentId]?.notes || ''
      }
    }));
  };

  const handleSetNotes = (studentId: string, notes: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'excused',
        notes
      }
    }));
  };

  // Marcar todos como presentes (atalho rápido no campo)
  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; notes: string }> = {};
    classStudents.forEach(s => {
      updated[s.id] = { status: 'present', notes: '' };
    });
    setAttendance(updated);
  };

  // Resetar seleções
  const handleReset = () => {
    setAttendance({});
  };

  // Estatísticas dinâmicas
  const total = classStudents.length;
  const presentCount = classStudents.filter(s => attendance[s.id]?.status === 'present').length;
  const absentCount = classStudents.filter(s => attendance[s.id]?.status === 'absent').length;
  const lateCount = classStudents.filter(s => attendance[s.id]?.status === 'late').length;
  const excusedCount = classStudents.filter(s => attendance[s.id]?.status === 'excused').length;
  const presenceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

  const handleSave = () => {
    setSavedSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Chamada Rápida
            </span>
            <span className="text-xs text-slate-400">Modo Professor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Fazer Chamada do Treino ⏱️
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Interface otimizada para toque no celular. Marque presença com poucos cliques.
          </p>
        </div>

        {/* Botão de Finalizar no Topo */}
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 self-stretch sm:self-auto"
        >
          <Save size={18} />
          Concluir Chamada
        </button>
      </div>

      {/* Alerta de Sucesso */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between gap-4 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-white">Chamada do Treino Salva com Sucesso!</p>
              <p className="text-xs text-emerald-300/80">
                {presentCount} presentes ({presenceRate}% de presença) • Registrado por Prof. Marcos Vinícius
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-500/20 rounded-full font-bold">Auditado</span>
        </div>
      )}

      {/* Barra de Seleção de Turma e Treino */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Seletor de Turma */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Turma
            </label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
            >
              {mockClasses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.enrolled_count} alunos)
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Data */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Data do Treino
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Dados do Treino Atual */}
          <div className="sm:col-span-2 lg:col-span-1 bg-slate-900/60 border border-slate-800/60 rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-white flex items-center gap-1.5">
                <MapPin size={13} className="text-emerald-400" />
                Campo 1 (Sintético)
              </p>
              <p className="text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Clock size={13} className="text-slate-500" />
                15:30 às 16:45
              </p>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Professor</span>
              <span className="font-bold text-emerald-400">{currentClass?.coach_name || 'Prof. Titular'}</span>
            </div>
          </div>
        </div>

        {/* Placar Rápido de Presença */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Contadores */}
          <div className="grid grid-cols-4 gap-2 w-full sm:w-auto">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Presentes</span>
              <span className="text-xl font-black text-emerald-400">{presentCount}</span>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">Faltas</span>
              <span className="text-xl font-black text-rose-400">{absentCount}</span>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Atrasos</span>
              <span className="text-xl font-black text-amber-400">{lateCount}</span>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">Justif.</span>
              <span className="text-xl font-black text-blue-400">{excusedCount}</span>
            </div>
          </div>

          {/* Botões Rápidos de Ação Coletiva */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
            >
              <CheckCheck size={16} />
              Todos Presentes
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-medium transition"
              title="Limpar seleção"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Lista Touch dos Alunos da Turma */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Lista de Chamada ({total} Atletas)
          </h2>
          <span className="text-xs font-semibold text-emerald-400">
            Taxa de Presença: {presenceRate}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {classStudents.map((student) => {
            const currentRecord = attendance[student.id];
            const currentStatus = currentRecord?.status;
            const hasNotes = Boolean(currentRecord?.notes);

            return (
              <div 
                key={student.id}
                className={`
                  p-4 rounded-2xl border transition-all duration-150 flex flex-col justify-between gap-3
                  ${currentStatus === 'present' 
                    ? 'bg-slate-950/90 border-emerald-500/40 shadow-sm shadow-emerald-500/5' 
                    : currentStatus === 'absent'
                    ? 'bg-slate-950/90 border-rose-500/40'
                    : currentStatus === 'late'
                    ? 'bg-slate-950/90 border-amber-500/40'
                    : currentStatus === 'excused'
                    ? 'bg-slate-950/90 border-blue-500/40'
                    : 'bg-slate-950/60 border-slate-800/80'
                  }
                `}
              >
                {/* Cabeçalho do Aluno */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm border
                      ${currentStatus === 'present' 
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                        : currentStatus === 'absent'
                        ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                      }
                    `}>
                      {student.full_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">
                        {student.full_name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Resp: {student.guardian?.full_name} ({student.relationship})
                      </p>
                    </div>
                  </div>

                  {/* Alerta de Saúde (Discreto para o Professor) */}
                  {student.medical_alerts && (
                    <span 
                      className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      title={student.medical_alerts}
                    >
                      <ShieldAlert size={16} />
                    </span>
                  )}
                </div>

                {/* Justificativa / Observação Salva */}
                {hasNotes && (
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                    <span className="truncate">Obs: {currentRecord?.notes}</span>
                    <button 
                      onClick={() => setJustificationModalStudent(student.id)}
                      className="text-emerald-400 hover:underline font-semibold ml-2 text-[11px]"
                    >
                      Editar
                    </button>
                  </div>
                )}

                {/* Botões Grandes de Toque (Mobile-First) */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {/* Presente */}
                  <button
                    type="button"
                    onClick={() => handleSetStatus(student.id, 'present')}
                    className={`
                      py-2.5 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 active:scale-95
                      ${currentStatus === 'present'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }
                    `}
                  >
                    <CheckCircle2 size={16} />
                    <span>Presente</span>
                  </button>

                  {/* Falta */}
                  <button
                    type="button"
                    onClick={() => handleSetStatus(student.id, 'absent')}
                    className={`
                      py-2.5 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 active:scale-95
                      ${currentStatus === 'absent'
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }
                    `}
                  >
                    <XCircle size={16} />
                    <span>Falta</span>
                  </button>

                  {/* Atraso */}
                  <button
                    type="button"
                    onClick={() => handleSetStatus(student.id, 'late')}
                    className={`
                      py-2.5 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 active:scale-95
                      ${currentStatus === 'late'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }
                    `}
                  >
                    <Clock size={16} />
                    <span>Atraso</span>
                  </button>

                  {/* Justificada */}
                  <button
                    type="button"
                    onClick={() => {
                      handleSetStatus(student.id, 'excused');
                      setJustificationModalStudent(student.id);
                    }}
                    className={`
                      py-2.5 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 active:scale-95
                      ${currentStatus === 'excused'
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }
                    `}
                  >
                    <HelpCircle size={16} />
                    <span>Justif.</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra Fixa Flutuante no Rodapé (Ideal para Mobile no Campo) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:pl-64 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-3 sm:p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {presentCount + lateCount} de {total} atletas
            </span>
            <div className="w-24 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${presenceRate}%` }}
              />
            </div>
            <span className="text-xs font-bold text-white hidden sm:inline">{presenceRate}%</span>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Check size={18} />
            Finalizar Chamada
          </button>
        </div>
      </div>

      {/* Modal Rápido de Observação / Justificativa */}
      {justificationModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4">
            <h3 className="font-bold text-white text-base">Observação / Justificativa</h3>
            <textarea
              rows={3}
              placeholder="Ex: Consulta médica, viagem em família, atestado..."
              defaultValue={attendance[justificationModalStudent]?.notes || ''}
              id="justification-input"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setJustificationModalStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = (document.getElementById('justification-input') as HTMLTextAreaElement)?.value || '';
                  handleSetNotes(justificationModalStudent, val);
                  setJustificationModalStudent(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                Salvar Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
