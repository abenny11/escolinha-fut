'use client';

import { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Plus, 
  X, 
  Search,
  CheckCircle,
  Calendar,
  Heart,
  Flame,
  Award
} from 'lucide-react';
import { mockStudents, mockSportsSkills, mockClasses } from '@/lib/mock-data';
import { Student, SportSkillDimension } from '@/lib/types';

export default function GamificacaoPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'presenca' | 'comportamento' | 'tecnico'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Atribuir Pontos
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [awardStudent, setAwardStudent] = useState<Student | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SportSkillDimension>('presenca_constante');
  const [selectedModalTab, setSelectedModalTab] = useState<'comportamento' | 'tecnico'>('comportamento');
  const [customNote, setCustomNote] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filtragem e ordenação dos alunos
  const filteredStudents = students
    .filter(s => {
      const matchesClass = selectedClassId === 'all' || s.current_class?.id === selectedClassId;
      const matchesSearch = s.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategoryFilter === 'presenca') {
        matchesCategory = (s.attendance_rate || 0) >= 85;
      } else if (selectedCategoryFilter === 'comportamento') {
        matchesCategory = (s.behavior_score || 0) >= 90;
      } else if (selectedCategoryFilter === 'tecnico') {
        matchesCategory = (s.total_points || 0) >= 250;
      }

      return matchesClass && matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (selectedCategoryFilter === 'presenca') {
        return (b.attendance_rate || 0) - (a.attendance_rate || 0);
      }
      if (selectedCategoryFilter === 'comportamento') {
        return (b.behavior_score || 0) - (a.behavior_score || 0);
      }
      return (b.total_points || 0) - (a.total_points || 0);
    });

  // Destaques da Semana da Escolinha
  const topTechnical = [...students].sort((a, b) => (b.total_points || 0) - (a.total_points || 0))[0];
  const topPresence = [...students].sort((a, b) => (b.attendance_rate || 0) - (a.attendance_rate || 0))[0];
  const topBehavior = [...students].sort((a, b) => (b.behavior_score || 0) - (a.behavior_score || 0))[0];

  const handleOpenAwardModal = (student: Student) => {
    setAwardStudent(student);
    setIsAwardModalOpen(true);
    setCustomNote('');
    setSelectedSkill('presenca_constante');
    setSelectedModalTab('comportamento');
  };

  const handleConfirmAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardStudent) return;

    const skill = mockSportsSkills.find(s => s.dimension === selectedSkill);
    const addedPoints = skill?.points || 20;

    const updated = students.map(s => {
      if (s.id === awardStudent.id) {
        const newPoints = (s.total_points || 0) + addedPoints;
        const newStars = (s.stars_count || 0) + 1;
        const newBehavior = skill?.category === 'comportamento_presenca' 
          ? Math.min(100, (s.behavior_score || 85) + 3) 
          : (s.behavior_score || 85);
        
        let newLevel: Student['player_level'] = s.player_level;
        if (newPoints >= 400) newLevel = 'Craque da Turma';
        else if (newPoints >= 300) newLevel = 'Destaque';
        else if (newPoints >= 150) newLevel = 'Em Formação';

        return {
          ...s,
          total_points: newPoints,
          stars_count: newStars,
          player_level: newLevel,
          behavior_score: newBehavior,
          behavior_notes: customNote ? customNote : s.behavior_notes
        };
      }
      return s;
    });

    setStudents(updated);
    setIsAwardModalOpen(false);
    setSuccessToast(`Parabéns! +${addedPoints} pts e 1 estrela atribuídos a ${awardStudent.full_name} em "${skill?.label}"!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Separação dos fundamentos no catálogo
  const behaviorSkills = mockSportsSkills.filter(s => s.category === 'comportamento_presenca');
  const technicalSkills = mockSportsSkills.filter(s => s.category === 'fundamento_tecnico');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Trophy size={13} /> Formação Cidadã & Mérito Esportivo
            </span>
            <span className="text-xs text-slate-400">Presença • Disciplina • Técnica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Evolução do Aluno & Estrelas de Mérito ⭐
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Reconhecimento integral: valorizamos a <strong>assiduidade (presença)</strong>, o <strong>respeito e convivência</strong> e a <strong>superação pessoal</strong>, além dos fundamentos com a bola.
          </p>
        </div>
      </div>

      {/* Toast de Sucesso */}
      {successToast && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-3 animate-fadeIn">
          <Sparkles size={20} className="text-amber-400 flex-shrink-0" />
          <p className="font-bold text-sm text-white">{successToast}</p>
        </div>
      )}

      {/* ======================================================== */}
      {/* OS 3 DESTAQUES DA SEMANA (PRESENÇA, COMPORTAMENTO, TÉCNICA) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Destaque em Presença & Compromisso */}
        <div className="bg-gradient-to-br from-emerald-950/70 via-slate-950 to-slate-950 border border-emerald-800/40 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Calendar size={11} /> Presença de Ouro
              </span>
              <span className="text-xl">📅</span>
            </div>
            <h3 className="text-lg font-black text-white">{topPresence?.full_name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{topPresence?.current_class?.name}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Assiduidade:</span>
            <span className="text-sm font-black text-emerald-400 flex items-center gap-1">
              <Flame size={14} /> {topPresence?.attendance_rate}% ({topPresence?.presence_streak} treinos seguidos)
            </span>
          </div>
        </div>

        {/* 2. Destaque em Comportamento & Convivência */}
        <div className="bg-gradient-to-br from-indigo-950/70 via-slate-950 to-slate-950 border border-indigo-800/40 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Heart size={11} /> Exemplo de Conduta
              </span>
              <span className="text-xl">🤝</span>
            </div>
            <h3 className="text-lg font-black text-white">{topBehavior?.full_name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{topBehavior?.current_class?.name}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Nota de Conduta:</span>
            <span className="text-sm font-black text-indigo-300 flex items-center gap-1">
              <CheckCircle size={14} /> {topBehavior?.behavior_score} / 100 (Fair Play)
            </span>
          </div>
        </div>

        {/* 3. Destaque Técnico / Craque com a Bola */}
        <div className="bg-gradient-to-br from-amber-950/70 via-slate-950 to-slate-950 border border-amber-800/40 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Trophy size={11} /> Craque da Semana
              </span>
              <span className="text-xl">⚽</span>
            </div>
            <h3 className="text-lg font-black text-white">{topTechnical?.full_name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{topTechnical?.current_class?.name}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Pontuação Total:</span>
            <span className="text-sm font-black text-amber-400 flex items-center gap-1">
              ⭐ {topTechnical?.total_points} pts ({topTechnical?.stars_count} estrelas)
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BARRA DE FILTROS & PESQUISA */}
      {/* ======================================================== */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex-1 relative w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar aluno por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filtro por Turma */}
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 w-full md:w-auto"
        >
          <option value="all">Todas as turmas</option>
          {mockClasses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Filtro por Pilar de Reconhecimento */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategoryFilter === 'all' 
                ? 'bg-amber-500 text-slate-950' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('presenca')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
              selectedCategoryFilter === 'presenca' 
                ? 'bg-emerald-500 text-slate-950' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Calendar size={13} /> Presença
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('comportamento')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
              selectedCategoryFilter === 'comportamento' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Heart size={13} /> Comportamento
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('tecnico')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
              selectedCategoryFilter === 'tecnico' 
                ? 'bg-amber-500 text-slate-950' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Trophy size={13} /> Técnica
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* GRID DE CARDS DOS ALUNOS COM PRESENÇA + COMPORTAMENTO + TÉCNICA */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student, index) => {
          const isTop3 = index < 3;

          return (
            <div
              key={student.id}
              className={`
                p-5 rounded-2xl border transition-all duration-150 flex flex-col justify-between gap-4
                ${isTop3 
                  ? 'bg-slate-950/90 border-amber-500/30 shadow-md shadow-amber-500/5' 
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                }
              `}
            >
              <div>
                {/* Header do Card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm border
                      ${index === 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 text-base' :
                        index === 1 ? 'bg-slate-300/20 text-slate-200 border-slate-300/40' :
                        index === 2 ? 'bg-amber-800/20 text-amber-600 border-amber-700/40' :
                        'bg-slate-900 text-slate-400 border-slate-800'}
                    `}>
                      {index + 1}º
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{student.full_name}</h3>
                      <p className="text-xs text-slate-400">
                        {student.position || 'Geral'} • {student.current_class?.name}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    student.player_level === 'Craque da Turma' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    student.player_level === 'Destaque' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {student.player_level}
                  </span>
                </div>

                {/* Badge de Reconhecimento Pedagógico */}
                {student.evolution_badge && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400">
                    <Award size={13} className="text-amber-400" />
                    <span>{student.evolution_badge}</span>
                  </div>
                )}

                {/* Os 3 Pilares Visuais do Aluno */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
                  {/* Presença */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-medium">Presença</span>
                    <strong className={`text-xs font-black block mt-0.5 ${
                      (student.attendance_rate || 0) >= 85 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {student.attendance_rate}%
                    </strong>
                    <span className="text-[9px] text-slate-500 block truncate">
                      {student.presence_streak || 0} treinos
                    </span>
                  </div>

                  {/* Comportamento */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-medium">Conduta</span>
                    <strong className="text-xs font-black text-indigo-300 block mt-0.5">
                      {student.behavior_score || 85}/100
                    </strong>
                    <span className="text-[9px] text-slate-500 block">Fair Play</span>
                  </div>

                  {/* Estrelas & Pontos */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-medium">Pontos</span>
                    <strong className="text-xs font-black text-amber-400 block mt-0.5">
                      {student.total_points} pts
                    </strong>
                    <span className="text-[9px] text-slate-500 block">
                      {student.stars_count} ⭐
                    </span>
                  </div>
                </div>

                {/* Nota do Professor */}
                {student.behavior_notes && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2 rounded-lg border border-slate-800/60 mt-2.5 line-clamp-2">
                    &ldquo;{student.behavior_notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Botão de Avaliar / Dar Pontos */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handleOpenAwardModal(student)}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Plus size={14} /> Atribuir Mérito / Estrela
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODAL: ATRIBUIR PONTOS EM FORMAÇÃO DO ALUNO OU TÉCNICA */}
      {/* ======================================================== */}
      {isAwardModalOpen && awardStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="text-amber-400" size={20} /> Reconhecer Evolução do Aluno
              </h2>
              <button 
                onClick={() => setIsAwardModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Identificação do Aluno */}
            <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">Aluno(a) em Avaliação</p>
                <p className="font-extrabold text-white text-base">{awardStudent.full_name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{awardStudent.current_class?.name}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-bold block">
                  {awardStudent.attendance_rate}% Presença
                </span>
                <span className="text-xs text-indigo-300 font-bold block">
                  Conduta: {awardStudent.behavior_score}/100
                </span>
              </div>
            </div>

            {/* Subtabs de Seleção: Comportamento/Presença vs Técnica */}
            <div className="flex border-b border-slate-800 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedModalTab('comportamento');
                  setSelectedSkill('presenca_constante');
                }}
                className={`flex-1 pb-2 text-xs font-bold border-b-2 transition flex items-center justify-center gap-1.5 ${
                  selectedModalTab === 'comportamento'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Heart size={14} /> Presença & Comportamento
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedModalTab('tecnico');
                  setSelectedSkill('passe_dominio');
                }}
                className={`flex-1 pb-2 text-xs font-bold border-b-2 transition flex items-center justify-center gap-1.5 ${
                  selectedModalTab === 'tecnico'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Trophy size={14} /> Fundamentos com Bola
              </button>
            </div>

            <form onSubmit={handleConfirmAward} className="space-y-4 overflow-y-auto flex-1 pr-1">
              {/* Opções de Habilidade / Mérito */}
              <div className="space-y-2">
                {(selectedModalTab === 'comportamento' ? behaviorSkills : technicalSkills).map((skill) => (
                  <label
                    key={skill.dimension}
                    className={`
                      p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition
                      ${selectedSkill === skill.dimension 
                        ? 'bg-amber-500/10 border-amber-500/40 text-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/70'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="skill"
                        value={skill.dimension}
                        checked={selectedSkill === skill.dimension}
                        onChange={() => setSelectedSkill(skill.dimension)}
                        className="accent-amber-400"
                      />
                      <div>
                        <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                          <span>{skill.icon}</span> {skill.label}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{skill.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-400 whitespace-nowrap pl-2">
                      +{skill.points} pts
                    </span>
                  </label>
                ))}
              </div>

              {/* Observação / Parecer Positivo para a Família */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Mensagem de Incentivo / Motivo do Mérito:
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Ex: Demonstrou muito companheirismo ajudando os colegas a recolher os materiais..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAwardModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <CheckCircle size={15} /> Confirmar Mérito (+Estrela)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
