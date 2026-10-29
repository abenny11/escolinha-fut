'use client';

import { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Phone, 
  X,
  AlertTriangle,
  QrCode,
  FileText,
  PhoneCall
} from 'lucide-react';
import { mockStudents, mockClasses, mockPlans } from '@/lib/mock-data';
import { Student, SoccerPosition, DominantFoot } from '@/lib/types';

export default function AlunosPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [radarFilterActive, setRadarFilterActive] = useState(false);

  // Modal de Novo Aluno
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    birthDate: '',
    gender: 'Masculino',
    position: 'Meio-Campo' as SoccerPosition,
    dominantFoot: 'Destro' as DominantFoot,
    jerseySize: 'Tam 10',
    medicalAlerts: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    relationship: 'Pai',
    classId: mockClasses[0]?.id || '',
    planId: mockPlans[0]?.id || '',
    agreedAmount: '140.00'
  });

  // Drawer de Detalhes do Aluno
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'dados' | 'esporte' | 'responsaveis' | 'matricula' | 'carteirinha'>('dados');

  // Filtragem (com suporte ao Radar de Busca Ativa de Evasão)
  const filteredStudents = students.filter(student => {
    if (radarFilterActive) {
      return (student.attendance_rate || 100) < 75 || (student.consecutive_absences || 0) >= 2;
    }

    const matchesSearch = 
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.guardian?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (student.guardian?.phone.includes(searchTerm) ?? false);

    const matchesClass = selectedClass === 'all' || student.current_class?.id === selectedClass;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.guardianName || !newStudent.guardianPhone) {
      alert('Por favor, preencha os campos obrigatórios (Nome, Responsável e Telefone).');
      return;
    }

    const targetClass = mockClasses.find(c => c.id === newStudent.classId);
    const targetPlan = mockPlans.find(p => p.id === newStudent.planId);

    const created: Student = {
      id: `stu-${Date.now()}`,
      full_name: newStudent.name,
      birth_date: newStudent.birthDate || '2015-01-01',
      gender: newStudent.gender,
      position: newStudent.position,
      dominant_foot: newStudent.dominantFoot,
      jersey_size: newStudent.jerseySize,
      medical_alerts: newStudent.medicalAlerts,
      status: 'active',
      guardian: {
        id: `g-${Date.now()}`,
        full_name: newStudent.guardianName,
        phone: newStudent.guardianPhone,
        email: newStudent.guardianEmail,
      },
      relationship: newStudent.relationship,
      current_class: {
        id: newStudent.classId,
        name: targetClass?.name || 'Sub-9',
        modality_name: targetClass?.modality_name || 'Futebol Society'
      },
      current_plan: {
        id: newStudent.planId,
        name: targetPlan?.name || '2x por semana',
        agreed_amount: parseFloat(newStudent.agreedAmount) || 140.0
      },
      financial_status: 'ok',
      total_points: 100,
      stars_count: 5,
      player_level: 'Iniciante',
      attendance_rate: 100,
      consecutive_absences: 0
    };

    setStudents([created, ...students]);
    setIsNewModalOpen(false);
    alert('Atleta matriculado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Alunos & Atletas 📋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestão técnica, posições, tamanhos de uniforme, responsáveis e retenção.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão de Radar de Busca Ativa */}
          <button
            onClick={() => setRadarFilterActive(!radarFilterActive)}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition border ${
              radarFilterActive 
                ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20' 
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}
          >
            <AlertTriangle size={15} />
            Radar de Evasão (Busca Ativa)
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/10"
          >
            <UserPlus size={18} />
            Novo Aluno
          </button>
        </div>
      </div>

      {/* Alerta de Busca Ativa Ativado */}
      {radarFilterActive && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-400 flex-shrink-0" />
            <span>
              <strong>Filtro de Risco Ativo:</strong> Exibindo atletas com frequência abaixo de 75% ou mais de 2 faltas seguidas. Envie mensagem de acolhimento para evitar o cancelamento.
            </span>
          </div>
          <button 
            onClick={() => setRadarFilterActive(false)} 
            className="underline font-bold text-white hover:text-rose-200"
          >
            Ver todos
          </button>
        </div>
      )}

      {/* Barra de Filtros e Busca */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por atleta, posição, responsável ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todas as turmas</option>
            {mockClasses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todas situações</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
      </div>

      {/* Tabela de Atletas */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Atleta</th>
                <th className="py-3.5 px-4">Posição / Turma</th>
                <th className="py-3.5 px-4">Responsável Legal</th>
                <th className="py-3.5 px-4">Desempenho</th>
                <th className="py-3.5 px-4">Frequência</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredStudents.map((student) => {
                const isRisk = (student.attendance_rate || 100) < 75;

                return (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-900/40 transition cursor-pointer"
                    onClick={() => { setSelectedStudent(student); setActiveTab('dados'); }}
                  >
                    {/* Aluno */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center font-bold text-xs text-emerald-400">
                          {student.full_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{student.full_name}</p>
                          <p className="text-xs text-slate-400">{student.jersey_size} • {student.dominant_foot}</p>
                        </div>
                      </div>
                    </td>

                    {/* Posição e Turma */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-emerald-400">{student.position || 'Geral'}</p>
                      <p className="text-xs text-slate-400">{student.current_class?.name}</p>
                    </td>

                    {/* Responsável */}
                    <td className="py-3.5 px-4">
                      <p className="text-slate-200 font-medium">{student.guardian?.full_name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Phone size={11} /> {student.guardian?.phone}
                      </p>
                    </td>

                    {/* Desempenho / Nível */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-amber-400">
                        ⭐ {student.total_points} pts
                      </span>
                      <p className="text-[10px] text-slate-400">{student.player_level}</p>
                    </td>

                    {/* Frequência & Risco */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {student.attendance_rate}%
                        </span>
                        {isRisk && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                            Risco
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Ação */}
                    <td className="py-3.5 px-4 text-right">
                      {isRisk ? (
                        <a
                          href={`https://wa.me/55${student.guardian?.phone}?text=Ol%C3%A1%20${encodeURIComponent(student.guardian?.full_name || '')},%20tudo%20bem?%20Sentimos%20a%20falta%20do(a)%20${encodeURIComponent(student.full_name)}%20nos%20%C3%BAltimos%20treinos!%20Est%C3%A1%20tudo%20bem%20com%20ele?`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold border border-emerald-500/30"
                          title="Enviar mensagem de acolhimento"
                        >
                          <PhoneCall size={12} /> WhatsApp
                        </a>
                      ) : (
                        <button 
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                        >
                          Ver Ficha
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Cadastro de Novo Atleta com Campos Esportivos */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="text-emerald-400" size={20} /> Matricular Novo Atleta
              </h2>
              <button 
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 mt-4">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Dados do Atleta</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Nome Completo *</label>
                    <input 
                      type="text" 
                      required 
                      value={newStudent.name}
                      onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                      placeholder="Ex: Pedro Henrique Silva" 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Data de Nascimento *</label>
                    <input 
                      type="date" 
                      required 
                      value={newStudent.birthDate}
                      onChange={e => setNewStudent({...newStudent, birthDate: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" 
                    />
                  </div>
                </div>

                {/* Campos Esportivos */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Posição</label>
                    <select
                      value={newStudent.position}
                      onChange={e => setNewStudent({...newStudent, position: e.target.value as SoccerPosition})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Atacante">Atacante</option>
                      <option value="Meio-Campo">Meio-Campo</option>
                      <option value="Lateral">Lateral</option>
                      <option value="Zagueiro">Zagueiro</option>
                      <option value="Goleiro">Goleiro</option>
                      <option value="Pivô">Pivô (Futsal)</option>
                      <option value="Fixo">Fixo (Futsal)</option>
                      <option value="Ala">Ala (Futsal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Perna</label>
                    <select
                      value={newStudent.dominantFoot}
                      onChange={e => setNewStudent({...newStudent, dominantFoot: e.target.value as DominantFoot})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Destro">Destro</option>
                      <option value="Canhoto">Canhoto</option>
                      <option value="Ambidestro">Ambidestro</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Tam. Uniforme</label>
                    <select
                      value={newStudent.jerseySize}
                      onChange={e => setNewStudent({...newStudent, jerseySize: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Tam 6">Tam 6</option>
                      <option value="Tam 8">Tam 8</option>
                      <option value="Tam 10">Tam 10</option>
                      <option value="Tam 12">Tam 12</option>
                      <option value="Tam 14">Tam 14</option>
                      <option value="P Adulto">P Adulto</option>
                      <option value="M Adulto">M Adulto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Alertas Médicos / Alergias (Acesso Restrito)</label>
                  <input 
                    type="text" 
                    value={newStudent.medicalAlerts}
                    onChange={e => setNewStudent({...newStudent, medicalAlerts: e.target.value})}
                    placeholder="Ex: Asma, alérgico a picada de inseto..." 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" 
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Responsável Legal (LGPD)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Nome do Responsável *</label>
                    <input 
                      type="text" 
                      required 
                      value={newStudent.guardianName}
                      onChange={e => setNewStudent({...newStudent, guardianName: e.target.value})}
                      placeholder="Ex: Marcos Silva" 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">WhatsApp / Telefone *</label>
                    <input 
                      type="text" 
                      required 
                      value={newStudent.guardianPhone}
                      onChange={e => setNewStudent({...newStudent, guardianPhone: e.target.value})}
                      placeholder="11999998888" 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Turma & Plano</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Turma Escolhida *</label>
                    <select
                      value={newStudent.classId}
                      onChange={e => setNewStudent({...newStudent, classId: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      {mockClasses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.enrolled_count}/{c.capacity} alunos)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Plano & Valor Contratado *</label>
                    <select
                      value={newStudent.planId}
                      onChange={e => {
                        const plan = mockPlans.find(p => p.id === e.target.value);
                        setNewStudent({
                          ...newStudent, 
                          planId: e.target.value,
                          agreedAmount: (plan?.base_amount || 140).toFixed(2)
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      {mockPlans.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} — R$ {p.base_amount.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
                >
                  Confirmar Matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer / Perfil do Atleta em Abas */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-950 border-l border-slate-800 h-full flex flex-col p-6 overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-lg flex items-center justify-center">
                  {selectedStudent.full_name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">{selectedStudent.full_name}</h2>
                  <p className="text-xs text-slate-400">{selectedStudent.position} • {selectedStudent.current_class?.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Abas */}
            <div className="flex border-b border-slate-800 mt-4 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('dados')}
                className={`py-2 px-3 border-b-2 whitespace-nowrap transition ${
                  activeTab === 'dados' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'
                }`}
              >
                Dados
              </button>
              <button
                onClick={() => setActiveTab('esporte')}
                className={`py-2 px-3 border-b-2 whitespace-nowrap transition ${
                  activeTab === 'esporte' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'
                }`}
              >
                Esporte
              </button>
              <button
                onClick={() => setActiveTab('responsaveis')}
                className={`py-2 px-3 border-b-2 whitespace-nowrap transition ${
                  activeTab === 'responsaveis' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'
                }`}
              >
                Responsável
              </button>
              <button
                onClick={() => setActiveTab('carteirinha')}
                className={`py-2 px-3 border-b-2 whitespace-nowrap transition ${
                  activeTab === 'carteirinha' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'
                }`}
              >
                Carteirinha
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="py-4 space-y-4 flex-1">
              {activeTab === 'dados' && (
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <span className="text-xs text-slate-400 block">Data de Nascimento</span>
                    <span className="font-semibold text-white">{selectedStudent.birth_date}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <span className="text-xs text-slate-400 block">Tamanho de Uniforme</span>
                    <span className="font-semibold text-white">{selectedStudent.jersey_size || 'Tam 10'}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <span className="text-xs text-slate-400 block">Frequência Geral</span>
                    <span className="font-semibold text-emerald-400">{selectedStudent.attendance_rate}% de presença</span>
                  </div>
                </div>
              )}

              {activeTab === 'esporte' && (
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <span className="text-xs text-slate-400 block">Posição em Campo</span>
                    <span className="font-semibold text-emerald-400 text-base">{selectedStudent.position}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <span className="text-xs text-slate-400 block">Perna Dominante</span>
                    <span className="font-semibold text-white">{selectedStudent.dominant_foot}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <span className="text-xs text-slate-400 block">Nível de Performance</span>
                    <span className="font-semibold text-amber-400">
                      ⭐ {selectedStudent.player_level} ({selectedStudent.total_points} pts)
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'responsaveis' && (
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <span className="text-xs text-slate-400 block">Responsável Legal</span>
                    <span className="font-semibold text-white">{selectedStudent.guardian?.full_name}</span>
                    <span className="text-xs text-slate-500 block">Vínculo: {selectedStudent.relationship}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <span className="text-xs text-slate-400 block">WhatsApp</span>
                    <span className="font-semibold text-white">{selectedStudent.guardian?.phone}</span>
                  </div>
                </div>
              )}

              {activeTab === 'carteirinha' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">ESCOLINHA PRO</span>
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-emerald-400 mx-auto flex items-center justify-center font-black text-xl text-emerald-400">
                      {selectedStudent.full_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{selectedStudent.full_name}</p>
                      <p className="text-xs text-slate-400">{selectedStudent.position} • {selectedStudent.current_class?.name}</p>
                    </div>
                    <div className="p-2 bg-white rounded-xl inline-block">
                      <QrCode size={90} className="text-slate-900" />
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Download do Termo de Matrícula e Autorização de Imagem LGPD gerado!')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-white flex items-center justify-center gap-2"
                  >
                    <FileText size={15} /> Imprimir Termo & Uso de Imagem
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
