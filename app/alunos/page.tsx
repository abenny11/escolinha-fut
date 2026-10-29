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
  PhoneCall,
  Activity,
  Zap,
  CheckCircle,
  Plus,
  Minus,
  Copy,
  Trophy,
  Dumbbell
} from 'lucide-react';
import { 
  mockStudents, 
  mockClasses, 
  mockPlans, 
  mockMatchScouts, 
  mockPhysicalScouts 
} from '@/lib/mock-data';
import { 
  Student, 
  SoccerPosition, 
  DominantFoot, 
  MatchScoutStats
} from '@/lib/types';

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
  const [activeTab, setActiveTab] = useState<'dados' | 'esporte' | 'responsaveis' | 'matricula' | 'carteirinha' | 'scout'>('dados');

  // Modal de Scout do Atleta (Ação Direta da Tela de Alunos)
  const [scoutModalStudent, setScoutModalStudent] = useState<Student | null>(null);
  const [scoutTab, setScoutTab] = useState<'jogo' | 'treino' | 'tapper'>('jogo');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [allMatchScouts, setAllMatchScouts] = useState<MatchScoutStats[]>(mockMatchScouts);
  const [liveStats, setLiveStats] = useState({
    goals: 0,
    assists: 0,
    passes_completed: 0,
    passes_missed: 0,
    tackles_successful: 0,
    saves_or_blocks: 0,
    dribbles_successful: 0,
    balls_lost: 0,
    shots_off_target: 0,
    fouls_committed: 0,
  });

  const updateLiveStat = (key: keyof typeof liveStats, delta: number) => {
    setLiveStats(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

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

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setScoutModalStudent(student);
                            setScoutTab('jogo');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold border border-emerald-500/30 transition shadow-sm"
                          title="Abrir Scout e Estatísticas do Atleta"
                        >
                          <Activity size={13} /> Scout
                        </button>
                        {isRisk ? (
                          <a
                            href={`https://wa.me/55${student.guardian?.phone}?text=Ol%C3%A1%20${encodeURIComponent(student.guardian?.full_name || '')},%20tudo%20bem?%20Sentimos%20a%20falta%20do(a)%20${encodeURIComponent(student.full_name)}%20nos%20%C3%BAltimos%20treinos!%20Est%C3%A1%20tudo%20bem%20com%20ele?`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold border border-emerald-500/30"
                            title="Enviar mensagem de acolhimento"
                          >
                            <PhoneCall size={12} /> WhatsApp
                          </a>
                        ) : (
                          <button 
                            onClick={() => { setSelectedStudent(student); setActiveTab('dados'); }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                          >
                            Ver Ficha
                          </button>
                        )}
                      </div>
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
              <button
                onClick={() => setActiveTab('scout')}
                className={`py-2 px-3 border-b-2 whitespace-nowrap transition ${
                  activeTab === 'scout' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400'
                }`}
              >
                Scout
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

              {activeTab === 'scout' && (
                <div className="space-y-4">
                  {(() => {
                    const stScout = allMatchScouts.find(s => s.student_id === selectedStudent.id) || allMatchScouts[0];
                    const phys = mockPhysicalScouts[selectedStudent.id] || mockPhysicalScouts['stu-1'];
                    const passTot = stScout ? stScout.passes_completed + stScout.passes_missed : 0;
                    const passPct = passTot > 0 ? Math.round((stScout.passes_completed / passTot) * 100) : 100;

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                          <div>
                            <span className="text-[11px] text-slate-400 block font-semibold">Nota Média do Scout</span>
                            <span className="text-xl font-black text-emerald-400">
                              {stScout ? stScout.overall_rating.toFixed(1) : '8.5'} / 10
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setScoutModalStudent(selectedStudent);
                              setSelectedStudent(null);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition"
                          >
                            <Zap size={14} /> Abrir Scout Completo
                          </button>
                        </div>

                        {/* Mini Resumo */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 block">Gols / Assists</span>
                            <strong className="text-white font-black text-sm">{stScout.goals}G • {stScout.assists}A</strong>
                          </div>
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 block">Passes Certos</span>
                            <strong className="text-teal-400 font-black text-sm">{passPct}% ({stScout.passes_completed})</strong>
                          </div>
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 block">Desarmes / Defesas</span>
                            <strong className="text-emerald-400 font-black text-sm">{stScout.tackles_successful} / {stScout.saves_or_blocks}</strong>
                          </div>
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 block">Tiro 20m (Treino)</span>
                            <strong className="text-amber-400 font-black text-sm">{phys.speed_20m_sec}s ({phys.speed_rating}/100)</strong>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 italic">
                          &ldquo;{stScout.coach_notes}&rdquo;
                        </div>
                      </div>
                    );
                  })()}
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

      {/* ======================================================== */}
      {/* MODAL PRINCIPAL DE SCOUT DO ATLETA (ACIONADO PELO BOTÃO) */}
      {/* ======================================================== */}
      {scoutModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          {(() => {
            const stScout = allMatchScouts.find(s => s.student_id === scoutModalStudent.id) || allMatchScouts[0];
            const phys = mockPhysicalScouts[scoutModalStudent.id] || mockPhysicalScouts['stu-1'];
            const totalP = (stScout?.passes_completed || 0) + (stScout?.passes_missed || 0);
            const pPct = totalP > 0 ? Math.round(((stScout?.passes_completed || 0) / totalP) * 100) : 100;

            const handleCopyWhatsApp = () => {
              const msg = `📊 *Scout do Atleta - Escolinha Pro* ⚽\n\n` +
                `👤 *Atleta:* ${scoutModalStudent.full_name}\n` +
                `🏅 *Posição:* ${scoutModalStudent.position} | *Categoria:* ${scoutModalStudent.current_class?.name}\n` +
                `⭐ *Nota da Partida:* ${stScout.overall_rating.toFixed(1)} / 10\n\n` +
                `✅ *Tudo de Bom Feito em Campo:*\n` +
                `• Gols: ${stScout.goals} ⚽\n` +
                `• Assistências: ${stScout.assists} 👟\n` +
                `• Passes Certos: ${stScout.passes_completed} (${pPct}% precisão)\n` +
                `• Desarmes Limpos: ${stScout.tackles_successful} 🛡️\n` +
                `• Defesas / Bloqueios: ${stScout.saves_or_blocks} 🧤\n\n` +
                `⚠️ *Oportunidades de Correção:*\n` +
                `• Passes Errados: ${stScout.passes_missed} ❌\n` +
                `• Perdas de Posse: ${stScout.balls_lost}\n` +
                `• Faltas Cometidas: ${stScout.fouls_committed}\n\n` +
                `🏋️ *Físico no Treino:*\n` +
                `• Tiro de 20m: ${phys.speed_20m_sec}s (${phys.speed_rating}/100)\n` +
                `• Potência do Chute: ${phys.shot_power_kmh} km/h\n` +
                `• Coordenação: ${phys.coordination_rating}/100 | Resistência: ${phys.endurance_rating}/100\n\n` +
                `💬 *Parecer:* "${stScout.coach_notes}"`;

              navigator.clipboard.writeText(msg);
              setCopiedNotification(true);
              setTimeout(() => setCopiedNotification(false), 3000);
            };

            const handleSaveLiveScout = () => {
              const newRating = Number((7.0 + (liveStats.goals * 1.0) + (liveStats.assists * 0.8) + (liveStats.tackles_successful * 0.3) - (liveStats.passes_missed * 0.2) - (liveStats.balls_lost * 0.3)).toFixed(1));
              const updatedScout: MatchScoutStats = {
                ...stScout,
                id: `scout-${Date.now()}`,
                student_id: scoutModalStudent.id,
                student_name: scoutModalStudent.full_name,
                goals: liveStats.goals,
                assists: liveStats.assists,
                passes_completed: liveStats.passes_completed,
                passes_missed: liveStats.passes_missed,
                tackles_successful: liveStats.tackles_successful,
                saves_or_blocks: liveStats.saves_or_blocks,
                dribbles_successful: liveStats.dribbles_successful,
                balls_lost: liveStats.balls_lost,
                shots_off_target: liveStats.shots_off_target,
                fouls_committed: liveStats.fouls_committed,
                overall_rating: Math.min(10.0, Math.max(4.0, newRating)),
                coach_notes: 'Scout de beira de campo registrado com sucesso.',
              };

              setAllMatchScouts(prev => [updatedScout, ...prev.filter(s => s.student_id !== scoutModalStudent.id)]);
              setScoutTab('jogo');
            };

            return (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header do Modal */}
                <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
                      {scoutModalStudent.full_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white">{scoutModalStudent.full_name}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          {scoutModalStudent.position || 'Geral'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {scoutModalStudent.current_class?.name} • Pé {scoutModalStudent.dominant_foot}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyWhatsApp}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700"
                    >
                      <Copy size={13} /> WhatsApp
                    </button>
                    <button 
                      onClick={() => setScoutModalStudent(null)}
                      className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {copiedNotification && (
                  <div className="px-5 py-2.5 bg-emerald-950 border-b border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle size={14} /> Relatório do Scout copiado! Pronto para enviar no WhatsApp.
                  </div>
                )}

                {/* Subtabs do Scout */}
                <div className="flex border-b border-slate-800 px-5 pt-3 gap-2 bg-slate-950">
                  <button
                    onClick={() => setScoutTab('jogo')}
                    className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                      scoutTab === 'jogo' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Trophy size={14} /> Jogo: Bom x Ruim
                  </button>
                  <button
                    onClick={() => setScoutTab('treino')}
                    className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                      scoutTab === 'treino' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Dumbbell size={14} /> Físico no Treino (Velocidade & Força)
                  </button>
                  <button
                    onClick={() => {
                      setScoutTab('tapper');
                      setLiveStats({
                        goals: stScout?.goals || 0,
                        assists: stScout?.assists || 0,
                        passes_completed: stScout?.passes_completed || 0,
                        passes_missed: stScout?.passes_missed || 0,
                        tackles_successful: stScout?.tackles_successful || 0,
                        saves_or_blocks: stScout?.saves_or_blocks || 0,
                        dribbles_successful: stScout?.dribbles_successful || 0,
                        balls_lost: stScout?.balls_lost || 0,
                        shots_off_target: stScout?.shots_off_target || 0,
                        fouls_committed: stScout?.fouls_committed || 0,
                      });
                    }}
                    className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                      scoutTab === 'tapper' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Zap size={14} /> Tapper de Campo (Marcar Ao Vivo)
                  </button>
                </div>

                {/* Conteúdo das Subtabs */}
                <div className="p-5 overflow-y-auto space-y-4 flex-1">
                  {/* SUBTAB 1: JOGO (BOM X RUIM) */}
                  {scoutTab === 'jogo' && (
                    <div className="space-y-4">
                      {/* Nota e Contexto */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block">{stScout.opponent_context} ({stScout.match_date})</span>
                          <span className="text-sm font-bold text-white">Tempo em campo: {stScout.minutes_played} min</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-emerald-400 leading-none">
                            {stScout.overall_rating.toFixed(1)} <span className="text-xs text-slate-500 font-normal">/ 10</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Nota da Atuação</span>
                        </div>
                      </div>

                      {/* Lado a Lado: Bom vs Ruim */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Lado Bom */}
                        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-2.5">
                          <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-emerald-900/40">
                            <CheckCircle size={14} /> Tudo de Bom Feito
                          </h4>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">⚽ Gols Marcados:</span>
                            <strong className="text-emerald-400 font-black">{stScout.goals}</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">👟 Assistências:</span>
                            <strong className="text-emerald-400 font-black">{stScout.assists}</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">🎯 Passes Certos ({pPct}%):</span>
                            <strong className="text-emerald-400 font-black">{stScout.passes_completed}</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">🛡️ Desarmes Limpos:</span>
                            <strong className="text-emerald-400 font-black">{stScout.tackles_successful}</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">🧤 Defesas / Bloqueios:</span>
                            <strong className="text-emerald-400 font-black">{stScout.saves_or_blocks}</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">⚡ Dribles Vencidos:</span>
                            <strong className="text-emerald-400 font-black">{stScout.dribbles_successful}</strong>
                          </div>
                        </div>

                        {/* Lado a Corrigir */}
                        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-2.5">
                          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-amber-900/40">
                            <AlertTriangle size={14} /> O Que Precisa Corrigir
                          </h4>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">❌ Passes Errados:</span>
                            <strong className="text-rose-400 font-black">{stScout.passes_missed}</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">⚠️ Bolas Perdidas:</span>
                            <strong className="text-amber-400 font-black">{stScout.balls_lost}</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">🎯 Finalizações Fora:</span>
                            <strong className="text-slate-400 font-black">{stScout.shots_off_target}</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">🟨 Faltas Cometidas:</span>
                            <strong className="text-amber-400 font-black">{stScout.fouls_committed}</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">🏃‍♂️ Desatenção na Marcação:</span>
                            <strong className="text-rose-300 font-black">{stScout.marking_lapses}</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                            <span className="text-slate-300">Cartões:</span>
                            <strong className="text-amber-300 font-black">{stScout.yellow_cards}A • {stScout.red_cards}V</strong>
                          </div>
                        </div>
                      </div>

                      {/* Parecer do Professor */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="font-bold text-slate-300 block mb-1">Parecer Técnico:</span>
                        <p className="text-slate-300 italic leading-relaxed">&ldquo;{stScout.coach_notes}&rdquo;</p>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: TREINO (FÍSICO & BIOMOTORES) */}
                  {scoutTab === 'treino' && (
                    <div className="space-y-4">
                      {/* Grid dos 4 Pilares Físicos */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">⚡ Velocidade (Tiro 20m)</span>
                          <div className="text-lg font-black text-amber-400 mt-1">{phys.speed_20m_sec}s</div>
                          <span className="text-[10px] text-slate-500 font-bold">{phys.speed_rating}/100</span>
                        </div>
                        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">🥊 Força (Chute km/h)</span>
                          <div className="text-lg font-black text-rose-400 mt-1">{phys.shot_power_kmh} km/h</div>
                          <span className="text-[10px] text-slate-500 font-bold">{phys.strength_rating}/100</span>
                        </div>
                        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">🌀 Coordenação (Cones)</span>
                          <div className="text-lg font-black text-teal-400 mt-1">{phys.agility_circuit_sec}s</div>
                          <span className="text-[10px] text-slate-500 font-bold">{phys.coordination_rating}/100</span>
                        </div>
                        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">🫁 Fôlego / Resistência</span>
                          <div className="text-lg font-black text-blue-400 mt-1">{phys.endurance_rating}/100</div>
                          <span className="text-[10px] text-slate-500 font-bold">Aeróbico</span>
                        </div>
                      </div>

                      {/* Destaques no Treino vs Lapidar */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-900/30">
                          <span className="font-bold text-emerald-400 block mb-2">✨ O Que Foi Ótimo no Treino:</span>
                          <ul className="space-y-1.5 text-slate-300">
                            {phys.strengths_in_training.map((str, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-400">•</span> {str}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-900/30">
                          <span className="font-bold text-amber-400 block mb-2">🎯 O Que Precisa Lapidar no Treino:</span>
                          <ul className="space-y-1.5 text-slate-300">
                            {phys.improvements_in_training.map((imp, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-400">•</span> {imp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 3: TAPPER AO VIVO */}
                  {scoutTab === 'tapper' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                        <Zap size={15} /> Toque nos botões (+ / -) para marcar ações durante o jogo ou coletivo de treino em tempo real.
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {/* GOL */}
                        <div className="p-2.5 bg-slate-900 border border-emerald-800/40 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-white block">⚽ Gol</span>
                            <span className="text-base font-black text-emerald-400">{liveStats.goals}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => updateLiveStat('goals', -1)} className="w-7 h-7 rounded bg-slate-950 text-slate-400 font-bold flex items-center justify-center"><Minus size={12} /></button>
                            <button type="button" onClick={() => updateLiveStat('goals', 1)} className="w-7 h-7 rounded bg-emerald-600 text-white font-bold flex items-center justify-center shadow"><Plus size={12} /></button>
                          </div>
                        </div>

                        {/* ASSIST */}
                        <div className="p-2.5 bg-slate-900 border border-emerald-800/40 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-white block">👟 Assist.</span>
                            <span className="text-base font-black text-emerald-400">{liveStats.assists}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => updateLiveStat('assists', -1)} className="w-7 h-7 rounded bg-slate-950 text-slate-400 font-bold flex items-center justify-center"><Minus size={12} /></button>
                            <button type="button" onClick={() => updateLiveStat('assists', 1)} className="w-7 h-7 rounded bg-emerald-600 text-white font-bold flex items-center justify-center shadow"><Plus size={12} /></button>
                          </div>
                        </div>

                        {/* PASSE CERTO */}
                        <div className="p-2.5 bg-slate-900 border border-emerald-800/40 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-white block">✅ Passe Certo</span>
                            <span className="text-base font-black text-emerald-400">{liveStats.passes_completed}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => updateLiveStat('passes_completed', -1)} className="w-7 h-7 rounded bg-slate-950 text-slate-400 font-bold flex items-center justify-center"><Minus size={12} /></button>
                            <button type="button" onClick={() => updateLiveStat('passes_completed', 1)} className="w-7 h-7 rounded bg-emerald-600 text-white font-bold flex items-center justify-center shadow"><Plus size={12} /></button>
                          </div>
                        </div>

                        {/* DESARME */}
                        <div className="p-2.5 bg-slate-900 border border-emerald-800/40 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-white block">🛡️ Desarme</span>
                            <span className="text-base font-black text-emerald-400">{liveStats.tackles_successful}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => updateLiveStat('tackles_successful', -1)} className="w-7 h-7 rounded bg-slate-950 text-slate-400 font-bold flex items-center justify-center"><Minus size={12} /></button>
                            <button type="button" onClick={() => updateLiveStat('tackles_successful', 1)} className="w-7 h-7 rounded bg-emerald-600 text-white font-bold flex items-center justify-center shadow"><Plus size={12} /></button>
                          </div>
                        </div>

                        {/* DEFESA */}
                        <div className="p-2.5 bg-slate-900 border border-emerald-800/40 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-white block">🧤 Defesa</span>
                            <span className="text-base font-black text-emerald-400">{liveStats.saves_or_blocks}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => updateLiveStat('saves_or_blocks', -1)} className="w-7 h-7 rounded bg-slate-950 text-slate-400 font-bold flex items-center justify-center"><Minus size={12} /></button>
                            <button type="button" onClick={() => updateLiveStat('saves_or_blocks', 1)} className="w-7 h-7 rounded bg-emerald-600 text-white font-bold flex items-center justify-center shadow"><Plus size={12} /></button>
                          </div>
                        </div>

                        {/* PASSE ERRADO */}
                        <div className="p-2.5 bg-slate-900 border border-rose-800/40 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-white block">❌ Passe Errado</span>
                            <span className="text-base font-black text-rose-400">{liveStats.passes_missed}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => updateLiveStat('passes_missed', -1)} className="w-7 h-7 rounded bg-slate-950 text-slate-400 font-bold flex items-center justify-center"><Minus size={12} /></button>
                            <button type="button" onClick={() => updateLiveStat('passes_missed', 1)} className="w-7 h-7 rounded bg-rose-600 text-white font-bold flex items-center justify-center shadow"><Plus size={12} /></button>
                          </div>
                        </div>

                        {/* BOLA PERDIDA */}
                        <div className="p-2.5 bg-slate-900 border border-amber-800/40 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-white block">⚠️ Bola Perdida</span>
                            <span className="text-base font-black text-amber-400">{liveStats.balls_lost}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => updateLiveStat('balls_lost', -1)} className="w-7 h-7 rounded bg-slate-950 text-slate-400 font-bold flex items-center justify-center"><Minus size={12} /></button>
                            <button type="button" onClick={() => updateLiveStat('balls_lost', 1)} className="w-7 h-7 rounded bg-amber-600 text-white font-bold flex items-center justify-center shadow"><Plus size={12} /></button>
                          </div>
                        </div>

                        {/* FALTA */}
                        <div className="p-2.5 bg-slate-900 border border-amber-800/40 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-white block">🟨 Falta</span>
                            <span className="text-base font-black text-amber-400">{liveStats.fouls_committed}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => updateLiveStat('fouls_committed', -1)} className="w-7 h-7 rounded bg-slate-950 text-slate-400 font-bold flex items-center justify-center"><Minus size={12} /></button>
                            <button type="button" onClick={() => updateLiveStat('fouls_committed', 1)} className="w-7 h-7 rounded bg-amber-600 text-white font-bold flex items-center justify-center shadow"><Plus size={12} /></button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveLiveScout}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                        >
                          <CheckCircle size={14} /> Salvar Scout Deste Jogo
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer do Modal */}
                <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/60">
                  <span className="text-[11px] text-slate-400">Escolinha Pro • Scout Integrado</span>
                  <button
                    onClick={() => setScoutModalStudent(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

