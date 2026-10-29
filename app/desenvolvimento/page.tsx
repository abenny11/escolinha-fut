'use client';

import { useState } from 'react';
import { 
  mockStudents, 
  mockAthleteAssessments, 
  mockAssessmentDimensions, 
  mockMasteryLevels,
  mockSkillCriteria
} from '@/lib/mock-data';
import { 
  AthleteAssessment, 
  AssessmentDimensionKey, 
  MasteryLevel,
  AssessmentScore
} from '@/lib/types';
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Share2, 
  Printer, 
  ChevronRight, 
  Filter, 
  Search,
  Sparkles,
  Calendar,
  X,
  Copy,
  Info
} from 'lucide-react';

export default function DesenvolvimentoPage() {
  const [activeTab, setActiveTab] = useState<'geral' | 'ficha' | 'matriz' | 'relatorio'>('geral');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-1'); // Lucas Silveira por padrão
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado das avaliações (inicial com mock e expansível com nova avaliação)
  const [assessments, setAssessments] = useState<AthleteAssessment[]>(mockAthleteAssessments);
  const [isNewAssessmentModalOpen, setIsNewAssessmentModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Form de nova avaliação
  const [newEvalStudentId, setNewEvalStudentId] = useState('stu-1');
  const [newEvalCycle, setNewEvalCycle] = useState('Ciclo 4 - Novembro 2026');
  const [newEvalScores, setNewEvalScores] = useState<Record<string, MasteryLevel>>({
    'crit-tec-geral-1': 4,
    'crit-tec-geral-2': 4,
    'crit-tec-mei-1': 4,
    'crit-tec-geral-3': 3,
    'crit-tat-1': 4,
    'crit-tat-3': 4,
    'crit-fis-1': 4,
    'crit-cmp-1': 5,
    'crit-apr-1': 5,
    'crit-aut-1': 5,
    'crit-jog-1': 4,
  });
  const [newEvalNotes, setNewEvalNotes] = useState('');
  const [newEvalGoal, setNewEvalGoal] = useState('');

  // Atleta selecionado para ficha e relatório
  const selectedStudent = mockStudents.find(s => s.id === selectedStudentId) || mockStudents[0];
  const studentAssessments = assessments
    .filter(a => a.student_id === selectedStudentId)
    .sort((a, b) => new Date(a.assessed_at).getTime() - new Date(b.assessed_at).getTime());
  const latestAssessment = studentAssessments[studentAssessments.length - 1];

  // Filtro de atletas para lista geral
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || student.current_class?.name.includes(selectedCategory);
    const matchesPos = selectedPosition === 'all' || student.position === selectedPosition;
    return matchesSearch && matchesCategory && matchesPos;
  });

  // Salvar nova avaliação
  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = mockStudents.find(s => s.id === newEvalStudentId);
    if (!student) return;

    // Médias por dimensão
    const dimAvgs: Record<AssessmentDimensionKey, number> = {
      tecnico: 4.0,
      tatico: 4.0,
      fisico_motor: 4.0,
      comportamento: 4.5,
      aprendizagem: 4.5,
      autonomia: 4.5,
      jogo: 4.0,
    };

    // Montar scores
    const scoresList: AssessmentScore[] = Object.entries(newEvalScores).map(([critId, lvl]) => {
      const crit = mockSkillCriteria.find(c => c.id === critId);
      return {
        criterion_id: critId,
        criterion_name: crit ? crit.name : critId,
        dimension: crit ? crit.dimension : 'tecnico',
        level: lvl as MasteryLevel,
      };
    });

    const newAssessment: AthleteAssessment = {
      id: `ass-custom-${Date.now()}`,
      student_id: student.id,
      student_name: student.full_name,
      position: student.position || 'Meio-Campo',
      class_id: student.current_class?.id || 'class-1',
      class_name: student.current_class?.name || 'Sub-9',
      coach_name: 'Prof. Carlos Eduardo',
      cycle_name: newEvalCycle,
      assessed_at: new Date().toISOString().split('T')[0],
      overall_average: 4.2,
      dimension_averages: dimAvgs,
      scores: scoresList,
      strengths: ['Aplicação consistente dos fundamentos', 'Participação ativa'],
      interventions: ['Manter constância nos treinos'],
      coach_notes: newEvalNotes || 'Atleta apresentou excelente foco durante o ciclo de treinamentos.',
      goals: newEvalGoal ? [
        {
          id: `goal-${Date.now()}`,
          student_id: student.id,
          dimension: 'tecnico',
          title: newEvalGoal,
          description: 'Aprimoramento contínuo com orientações da comissão técnica.',
          target_date: '15/12/2026',
          status: 'in_progress',
          created_at: new Date().toISOString().split('T')[0],
        }
      ] : [],
    };

    setAssessments(prev => [...prev, newAssessment]);
    setSelectedStudentId(student.id);
    setIsNewAssessmentModalOpen(false);
    setActiveTab('ficha');
  };

  // Copiar relatório formatado para WhatsApp
  const handleCopyWhatsAppReport = () => {
    if (!latestAssessment) return;
    const reportText = `⚽ *Boletim de Desenvolvimento do Atleta - Escolinha Pro* ⚽\n\n` +
      `👤 *Atleta:* ${selectedStudent.full_name}\n` +
      `🏅 *Posição:* ${selectedStudent.position} | *Categoria:* ${selectedStudent.current_class?.name}\n` +
      `📅 *Ciclo:* ${latestAssessment.cycle_name}\n` +
      `📊 *Nível Médio de Domínio:* ${latestAssessment.overall_average.toFixed(1)} / 5.0\n\n` +
      `🌟 *Destaques Observados:*\n${latestAssessment.strengths.map(s => `• ${s}`).join('\n')}\n\n` +
      `🎯 *Próximo Foco de Evolução:*\n${latestAssessment.interventions.map(i => `• ${i}`).join('\n')}\n\n` +
      `💬 *Palavra do Treinador:*\n"${latestAssessment.coach_notes}"\n\n` +
      `_A escala representa domínio prático observado no tempo da criança, valorizando o esforço contínuo e a evolução individual!_`;

    navigator.clipboard.writeText(reportText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner de Apresentação */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 p-6 rounded-2xl border border-emerald-800/40 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles size={14} /> Pedagogia Esportiva & Formação Integral
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Desenvolvimento do Atleta
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Acompanhamento contínuo da evolução nas 7 dimensões, com critérios específicos por posição (Goleiro, Zagueiro, Meia, Atacante) e escala de domínio de 1 a 5.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewAssessmentModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Plus size={16} /> Nova Avaliação no Campo
            </button>
            <button
              onClick={() => setActiveTab('relatorio')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm flex items-center gap-2 transition"
            >
              <Share2 size={16} /> Relatório para Responsáveis
            </button>
          </div>
        </div>

        {/* 4 Cards de Métricas Principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Atletas no Ciclo Atual</div>
            <div className="text-xl font-bold text-white mt-1">5 <span className="text-xs text-slate-500 font-normal">/ 6 ativos</span></div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={12} /> 83% avaliados
            </div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Maior Salto de Domínio</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">+1.3 pts</div>
            <div className="text-[11px] text-slate-400 truncate">Lucas Silveira (Sub-9)</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Requer Intervenção</div>
            <div className="text-xl font-bold text-amber-400 mt-1">1 Atleta</div>
            <div className="text-[11px] text-amber-300/80 truncate flex items-center gap-1">
              <AlertTriangle size={12} /> Gabriel Duarte (Assiduidade)
            </div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Dimensão Destaque</div>
            <div className="text-xl font-bold text-teal-400 mt-1">4.4 / 5.0</div>
            <div className="text-[11px] text-slate-400 truncate">Comportamento & Respeito</div>
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('geral')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'geral'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp size={16} /> Visão Geral da Turma
        </button>
        <button
          onClick={() => setActiveTab('ficha')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'ficha'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award size={16} /> Ficha Individual & Evolução
        </button>
        <button
          onClick={() => setActiveTab('matriz')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'matriz'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info size={16} /> As 7 Dimensões & Posições
        </button>
        <button
          onClick={() => setActiveTab('relatorio')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'relatorio'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 size={16} /> Relatório aos Pais (WhatsApp)
        </button>
      </div>

      {/* ======================================================== */}
      {/* ABA 1: VISÃO GERAL DA TURMA */}
      {/* ======================================================== */}
      {activeTab === 'geral' && (
        <div className="space-y-6">
          {/* Barra de Filtros */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar atleta por nome..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Filter size={14} /> Categoria:
              </div>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todas as Categorias</option>
                <option value="Sub-7">Sub-7</option>
                <option value="Sub-9">Sub-9</option>
                <option value="Sub-11">Sub-11</option>
                <option value="Sub-13">Sub-13</option>
                <option value="Sub-15">Sub-15</option>
              </select>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-2">
                Posição:
              </div>
              <select
                value={selectedPosition}
                onChange={e => setSelectedPosition(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todas as Posições</option>
                <option value="Goleiro">Goleiro</option>
                <option value="Zagueiro">Zagueiro</option>
                <option value="Lateral">Lateral</option>
                <option value="Meio-Campo">Meio-Campo</option>
                <option value="Atacante">Atacante</option>
              </select>
            </div>
          </div>

          {/* Grid de Atletas com seu status de domínio */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map(student => {
              const studentEvals = assessments.filter(a => a.student_id === student.id);
              const latest = studentEvals[studentEvals.length - 1];
              const first = studentEvals[0];
              const hasEvolved = studentEvals.length > 1 && latest.overall_average > first.overall_average;
              const delta = studentEvals.length > 1 ? (latest.overall_average - first.overall_average).toFixed(1) : null;

              return (
                <div 
                  key={student.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div>
                    {/* Cabeçalho do Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                          {student.full_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-100 text-base leading-tight">
                            {student.full_name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                              {student.position || 'Geral'}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {student.current_class?.name.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {latest && (
                        <div className="text-right">
                          <div className="text-lg font-black text-emerald-400 leading-none">
                            {latest.overall_average.toFixed(1)}
                            <span className="text-xs text-slate-500 font-normal"> /5</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Domínio Médio
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Evolução ao longo dos ciclos */}
                    {latest ? (
                      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Progresso de Ciclos:</span>
                          {delta && (
                            <span className={`font-semibold flex items-center gap-1 ${hasEvolved ? 'text-emerald-400' : 'text-slate-400'}`}>
                              <TrendingUp size={12} /> +{delta} pts
                            </span>
                          )}
                        </div>

                        {/* Mini barras das 7 dimensões */}
                        <div className="space-y-1.5">
                          {mockAssessmentDimensions.slice(0, 4).map(dim => {
                            const val = latest.dimension_averages[dim.key] || 3;
                            return (
                              <div key={dim.key} className="flex items-center gap-2 text-[11px]">
                                <span className="w-24 text-slate-400 truncate">{dim.title}:</span>
                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full bg-gradient-to-r ${dim.color} rounded-full`}
                                    style={{ width: `${(val / 5) * 100}%` }}
                                  />
                                </div>
                                <span className="font-semibold text-slate-200 w-6 text-right">
                                  {val.toFixed(1)}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Tags de Destaques e Atenção */}
                        <div className="pt-2">
                          {latest.strengths.length > 0 && (
                            <div className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1 rounded-lg mb-1.5">
                              ✨ <span className="font-semibold">Ponto Forte:</span> {latest.strengths[0]}
                            </div>
                          )}
                          {latest.interventions.length > 0 && (
                            <div className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-900/60 px-2.5 py-1 rounded-lg">
                              🎯 <span className="font-semibold">Próximo Foco:</span> {latest.interventions[0]}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                        <span className="text-xs text-slate-400">Nenhuma avaliação realizada ainda.</span>
                      </div>
                    )}
                  </div>

                  {/* Ações do Card */}
                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setActiveTab('ficha');
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      Ver Ficha Completa <ChevronRight size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setNewEvalStudentId(student.id);
                        setIsNewAssessmentModalOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 font-semibold text-xs flex items-center gap-1 transition"
                      title="Avaliar agora"
                    >
                      <Plus size={14} /> Avaliar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 2: FICHA INDIVIDUAL & EVOLUÇÃO COMPARATIVA */}
      {/* ======================================================== */}
      {activeTab === 'ficha' && (
        <div className="space-y-6">
          {/* Seletor rápido de atleta */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Atleta em Análise:</span>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {mockStudents.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.full_name} ({st.position || 'Geral'} - {st.current_class?.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setNewEvalStudentId(selectedStudentId);
                  setIsNewAssessmentModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Plus size={14} /> Registrar Novo Ciclo
              </button>
              <button
                onClick={() => setActiveTab('relatorio')}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <Share2 size={14} /> Gerar Relatório
              </button>
            </div>
          </div>

          {/* Perfil Detalhado do Atleta */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-500/20">
                  {selectedStudent.full_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedStudent.full_name}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-semibold">
                      Posição: {selectedStudent.position || 'Polivalente'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Pé Dominante: {selectedStudent.dominant_foot}
                    </span>
                    <span className="text-slate-400">
                      Turma: {selectedStudent.current_class?.name}
                    </span>
                  </div>
                </div>
              </div>

              {latestAssessment && (
                <div className="flex items-center gap-4 bg-slate-950/80 px-5 py-3 rounded-xl border border-slate-800">
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400 leading-none">
                      {latestAssessment.overall_average.toFixed(1)}
                      <span className="text-xs text-slate-500 font-normal"> / 5.0</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Última Avaliação ({latestAssessment.cycle_name.split(' - ')[0]})</span>
                  </div>
                </div>
              )}
            </div>

            {/* Comparativo de 3 Ciclos de Avaliação */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-400" />
                    Evolução Comparativa entre Ciclos
                  </h3>
                  <p className="text-xs text-slate-400">
                    Acompanhamento histórico das 7 dimensões para identificar saltos técnicos e pontos de estagnação.
                  </p>
                </div>

                {studentAssessments.length > 1 && (
                  <div className="flex items-center gap-3 text-xs">
                    {studentAssessments.map((cycle, idx) => (
                      <div key={cycle.id} className="flex items-center gap-1.5">
                        <span className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-slate-600' : idx === 1 ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                        <span className="text-slate-300 font-medium">{cycle.cycle_name.split(' - ')[1] || cycle.cycle_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabela / Grid Comparativo de Dimensões */}
              <div className="space-y-4">
                {mockAssessmentDimensions.map(dim => {
                  return (
                    <div key={dim.key} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{dim.icon}</span>
                          <span className="font-bold text-slate-200 text-sm">{dim.title}</span>
                          <span className="text-[11px] text-slate-500 hidden md:inline">({dim.description})</span>
                        </div>

                        {/* Valores nos ciclos */}
                        <div className="flex items-center gap-4 text-xs font-bold">
                          {studentAssessments.map((cycle, idx) => {
                            const score = cycle.dimension_averages[dim.key] || 3;
                            return (
                              <div key={cycle.id} className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-500">C{idx + 1}:</span>
                                <span className={idx === studentAssessments.length - 1 ? 'text-emerald-400 font-black' : 'text-slate-400'}>
                                  {score.toFixed(1)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Barras de progresso sobrepostas/comparadas */}
                      <div className="space-y-1.5">
                        {studentAssessments.map((cycle, idx) => {
                          const score = cycle.dimension_averages[dim.key] || 3;
                          const pct = (score / 5) * 100;
                          return (
                            <div key={cycle.id} className="flex items-center gap-2 text-[10px]">
                              <span className="w-16 text-slate-500 truncate">{cycle.cycle_name.split(' - ')[1] || `Ciclo ${idx+1}`}</span>
                              <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    idx === studentAssessments.length - 1 
                                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                                      : 'bg-slate-600'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="w-8 text-right font-medium text-slate-400">{score.toFixed(1)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Metas e Próximo Ciclo */}
            {latestAssessment && (
              <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Metas Definidas */}
                <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <Award size={16} className="text-amber-400" />
                    Objetivos Definidos para o Próximo Ciclo
                  </h4>

                  {latestAssessment.goals.length > 0 ? (
                    <div className="space-y-3">
                      {latestAssessment.goals.map(goal => (
                        <div key={goal.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-200">{goal.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                              {goal.status === 'in_progress' ? 'Em andamento' : 'Ativo'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{goal.description}</p>
                          <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                            <Calendar size={12} /> Prazo: {goal.target_date}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Nenhuma meta cadastrada no momento.</p>
                  )}
                </div>

                {/* Parecer do Professor */}
                <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                      <Sparkles size={16} className="text-emerald-400" />
                      Parecer Pedagógico do Professor
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900 p-3 rounded-lg border border-slate-800">
                      &ldquo;{latestAssessment.coach_notes}&rdquo;
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Avaliador: <strong className="text-slate-200">{latestAssessment.coach_name}</strong></span>
                    <span>Data: {latestAssessment.assessed_at}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 3: AS 7 DIMENSÕES & CRITÉRIOS POR POSIÇÃO */}
      {/* ======================================================== */}
      {activeTab === 'matriz' && (
        <div className="space-y-6">
          {/* Apresentação da Escala de 5 Níveis */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">
              Escala de Domínio Observado (1 a 5)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              A escala avalia o domínio prático demonstrado nos treinos e jogos. Não rotula a personalidade nem mede valor pessoal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {mockMasteryLevels.map(ml => (
                <div key={ml.level} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center">
                        {ml.level}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${ml.badgeColor}`}>
                        Nível {ml.level}
                      </span>
                    </div>
                    <div className="font-bold text-slate-200 text-xs mb-1">{ml.title}</div>
                    <div className="text-[11px] text-slate-400 leading-snug">{ml.fullDesc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* As 7 Dimensões Detalhadas */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">
              Catálogo de Critérios de Avaliação
            </h3>

            {mockAssessmentDimensions.map(dim => {
              const criteria = mockSkillCriteria.filter(c => c.dimension === dim.key);
              return (
                <div key={dim.key} className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${dim.color} flex items-center justify-center text-xl shadow-md`}>
                      {dim.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">
                        Dimensão {dim.number}: {dim.title}
                      </h4>
                      <p className="text-xs text-slate-400">{dim.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {criteria.map(crit => (
                      <div key={crit.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-slate-200">{crit.name}</span>
                          {crit.applicable_positions !== 'all' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-medium whitespace-nowrap">
                              {crit.applicable_positions.join(', ')}
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium whitespace-nowrap">
                              Todas as posições
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {crit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 4: RELATÓRIO PARA RESPONSÁVEIS (WHATSAPP & IMPRESSÃO) */}
      {/* ======================================================== */}
      {activeTab === 'relatorio' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Barra de Ações do Relatório */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Selecione o Atleta:</span>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold text-slate-200"
              >
                {mockStudents.map(st => (
                  <option key={st.id} value={st.id}>{st.full_name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyWhatsAppReport}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
              >
                <Copy size={14} /> Copiar para WhatsApp
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <Printer size={14} /> Imprimir
              </button>
            </div>
          </div>

          {copiedNotification && (
            <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 size={16} /> Relatório copiado para a área de transferência! Cole na conversa com os pais no WhatsApp.
            </div>
          )}

          {/* Ficha Pronta para Apresentação ao Responsável */}
          <div className="bg-slate-950 rounded-2xl border-2 border-emerald-500/30 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Cabeçalho da Escolinha */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 text-2xl font-black">
                  ⚽
                </div>
                <div>
                  <h3 className="font-black text-white text-lg">Escolinha Pro</h3>
                  <p className="text-xs text-emerald-400 font-semibold">Boletim Pedagógico de Desenvolvimento Esportivo</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold">
                  {latestAssessment ? latestAssessment.cycle_name : 'Ciclo Atual'}
                </span>
              </div>
            </div>

            {/* Identificação do Aluno */}
            <div className="my-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Atleta</span>
                <h4 className="text-xl font-extrabold text-white">{selectedStudent.full_name}</h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  {selectedStudent.position || 'Geral'} • Pé {selectedStudent.dominant_foot} • {selectedStudent.current_class?.name}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Domínio Geral</span>
                <div className="text-2xl font-black text-emerald-400">
                  {latestAssessment ? latestAssessment.overall_average.toFixed(1) : '4.0'}
                  <span className="text-xs text-slate-500 font-normal"> / 5.0</span>
                </div>
              </div>
            </div>

            {/* 7 Dimensões do Aluno */}
            {latestAssessment && (
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Avaliação por Dimensão de Aprendizagem:
                </h4>
                {mockAssessmentDimensions.map(dim => {
                  const score = latestAssessment.dimension_averages[dim.key] || 3;
                  const levelObj = mockMasteryLevels.find(m => m.level === Math.round(score)) || mockMasteryLevels[2];
                  return (
                    <div key={dim.key} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <span>{dim.icon}</span>
                        <span className="font-semibold text-slate-200">{dim.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-[11px]">{levelObj.title}</span>
                        <span className="font-black text-emerald-400 w-8 text-right">{score.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Destaques e Próxima Meta */}
            {latestAssessment && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/50">
                  <div className="text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                    ✨ Conquistas em Destaque
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {latestAssessment.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span> {str}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/50">
                  <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    🎯 Próximo Passo no Treino
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {latestAssessment.interventions.map((intv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span> {intv}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Recado do Professor */}
            {latestAssessment && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="font-bold text-slate-200 block mb-1">Palavra da Comissão Técnica:</span>
                <p className="text-slate-300 italic leading-relaxed">
                  &ldquo;{latestAssessment.coach_notes}&rdquo;
                </p>
                <div className="mt-3 text-right text-[11px] text-slate-400">
                  {latestAssessment.coach_name} — Comissão Técnica
                </div>
              </div>
            )}

            {/* Nota de rodapé pedagógica */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 text-center leading-relaxed">
              O objetivo desta avaliação é valorizar o desenvolvimento único de cada criança, incentivando a cooperação, disciplina e prazer pelo esporte.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: NOVA AVALIAÇÃO RÁPIDA NO CAMPO (TOUCH-FRIENDLY) */}
      {/* ======================================================== */}
      {isNewAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Top Modal */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus size={18} className="text-emerald-400" />
                  Nova Avaliação no Campo
                </h3>
                <p className="text-xs text-slate-400">
                  Toque na nota de 1 a 5 para cada fundamento observado.
                </p>
              </div>
              <button 
                onClick={() => setIsNewAssessmentModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            {/* Formulário com Scroll */}
            <form onSubmit={handleSaveAssessment} className="p-5 overflow-y-auto space-y-6 flex-1">
              {/* Seleção de Atleta e Ciclo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1.5">Atleta:</label>
                  <select
                    value={newEvalStudentId}
                    onChange={e => setNewEvalStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  >
                    {mockStudents.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.full_name} ({st.position || 'Geral'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1.5">Ciclo de Avaliação:</label>
                  <input
                    type="text"
                    value={newEvalCycle}
                    onChange={e => setNewEvalCycle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Critérios para marcar com 1 toque */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Avaliar Critérios Observados (1 a 5):
                </h4>

                {mockSkillCriteria.slice(0, 8).map(crit => {
                  const currentLvl = newEvalScores[crit.id] || 3;
                  return (
                    <div key={crit.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <div className="font-bold text-xs text-slate-200">{crit.name}</div>
                          <div className="text-[11px] text-slate-400">{crit.description}</div>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-bold self-start sm:self-auto">
                          {mockMasteryLevels[currentLvl - 1].title}
                        </span>
                      </div>

                      {/* Botões Touch 1..5 */}
                      <div className="grid grid-cols-5 gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setNewEvalScores(prev => ({ ...prev, [crit.id]: lvl as MasteryLevel }))}
                            className={`py-2 rounded-lg font-black text-xs transition flex flex-col items-center justify-center ${
                              currentLvl === lvl
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                            }`}
                          >
                            <span>{lvl}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Meta para o Próximo Ciclo */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                  🎯 Meta / Objetivo Prioritário para o Próximo Ciclo:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Aprimorar passe com pé não dominante; Soltar a bola mais rápido..."
                  value={newEvalGoal}
                  onChange={e => setNewEvalGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Observação / Parecer Pedagógico */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                  💬 Parecer do Professor (Feedback):
                </label>
                <textarea
                  rows={3}
                  placeholder="Descreva a evolução observada e pontos de incentivo..."
                  value={newEvalNotes}
                  onChange={e => setNewEvalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Rodapé do Modal */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewAssessmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
                >
                  <CheckCircle2 size={16} /> Salvar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
