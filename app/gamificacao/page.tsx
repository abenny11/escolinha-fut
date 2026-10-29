'use client';

import { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Plus, 
  X, 
  Search,
  CheckCircle,
  Flame,
  Star
} from 'lucide-react';
import { mockStudents, mockSportsSkills, mockClasses } from '@/lib/mock-data';
import { Student, SportSkillDimension } from '@/lib/types';

export default function GamificacaoPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Atribuir Pontos / Estrela
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [awardStudent, setAwardStudent] = useState<Student | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SportSkillDimension>('passe_dominio');
  const [customNote, setCustomNote] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filtragem e ordenação decrescente por pontuação
  const filteredStudents = students
    .filter(s => {
      const matchesClass = selectedClassId === 'all' || s.current_class?.id === selectedClassId;
      const matchesSearch = s.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesClass && matchesSearch;
    })
    .sort((a, b) => (b.total_points || 0) - (a.total_points || 0));

  // Craque da Semana (1º colocado do ranking)
  const topAthlete = [...students].sort((a, b) => (b.total_points || 0) - (a.total_points || 0))[0] || students[0];

  const handleOpenAwardModal = (student: Student) => {
    setAwardStudent(student);
    setIsAwardModalOpen(true);
    setCustomNote('');
    setSelectedSkill('passe_dominio');
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
        
        let newLevel: Student['player_level'] = s.player_level;
        if (newPoints >= 400) newLevel = 'Craque da Turma';
        else if (newPoints >= 300) newLevel = 'Destaque';
        else if (newPoints >= 150) newLevel = 'Em Formação';

        return {
          ...s,
          total_points: newPoints,
          stars_count: newStars,
          player_level: newLevel,
          behavior_notes: customNote ? customNote : s.behavior_notes
        };
      }
      return s;
    });

    setStudents(updated);
    setIsAwardModalOpen(false);
    setSuccessToast(`Parabéns! +${addedPoints} pts e 1 estrela atribuídos a ${awardStudent.full_name}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Fundamentos principais em destaque
  const highlightedSkills = [
    { label: 'Passe & Domínio', points: '+15 pts', icon: '⚽' },
    { label: 'Finalização & Chute', points: '+20 pts', icon: '🎯' },
    { label: 'Marcação & Desarme', points: '+15 pts', icon: '🛡️' },
    { label: 'Fair Play & Equipe', points: '+20 pts', icon: '🤝', highlight: true }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-[#eab308]/15 text-[#facc15] border border-[#eab308]/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Trophy size={13} className="text-[#facc15]" /> PERFORMANCE & MÉRITO
          </span>
          <span className="text-xs text-slate-400 font-medium">Gamificação Esportiva</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 flex items-center gap-2">
          Evolução Técnica & Estrelas ⭐
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Reconheça a dedicação, fundamentos e evolução dos atletas nos treinos.
        </p>
      </div>

      {/* Toast de Sucesso */}
      {successToast && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-3 animate-fadeIn">
          <Sparkles size={20} className="text-amber-400 flex-shrink-0" />
          <p className="font-bold text-sm text-white">{successToast}</p>
        </div>
      )}

      {/* ======================================================== */}
      {/* HERO SECTION: CRAQUE DA SEMANA + FUNDAMENTOS AVALIADOS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Craque da Semana (2 colunas no desktop) */}
        <div className="lg:col-span-2 bg-[#0c1322]/80 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#f59e0b] flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 text-slate-950 flex-shrink-0">
            🏆
          </div>

          <div className="flex-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#f59e0b] block">
              CRAQUE DA SEMANA
            </span>
            <h2 className="text-2xl font-black text-white mt-0.5 tracking-tight">
              {topAthlete.full_name}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Posição: <strong className="text-slate-300 font-semibold">{topAthlete.position || 'Goleiro'}</strong> • Categoria: <strong className="text-slate-300 font-semibold">{topAthlete.current_class?.name || 'Sub-13 Tarde (Intermediário)'}</strong>
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-3.5">
              <span className="px-3 py-1 rounded-full bg-[#2a1e0b] border border-[#f59e0b]/40 text-[#f59e0b] text-xs font-black flex items-center gap-1.5 shadow-sm">
                <Star size={13} className="fill-[#f59e0b]" /> {topAthlete.total_points || 420} Pontos
              </span>
              <span className="px-3 py-1 rounded-full bg-[#0d2a1f] border border-[#10b981]/40 text-[#10b981] text-xs font-black flex items-center gap-1.5 shadow-sm">
                <Flame size={13} className="fill-[#10b981]" /> {topAthlete.attendance_rate || 96}% Presença
              </span>
            </div>
          </div>
        </div>

        {/* Fundamentos Avaliados */}
        <div className="bg-[#0c1322]/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">
              FUNDAMENTOS AVALIADOS
            </h3>
            <div className="space-y-2 text-xs">
              {highlightedSkills.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 font-medium ${item.highlight ? 'text-[#38bdf8] font-bold' : 'text-slate-200'}`}>
                    <span>{item.icon}</span> {item.label}:
                  </span>
                  <strong className={`font-black ${item.highlight ? 'text-[#38bdf8]' : 'text-slate-300'}`}>
                    {item.points}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] font-semibold text-[#10b981] mt-4 pt-3 border-t border-slate-800/80">
            Atribua estrelas no final de cada treino!
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BARRA DE PESQUISA & FILTRO POR TURMA */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-3 relative">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar atleta por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0b1120] border border-slate-800/90 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#f59e0b]/60 transition"
          />
        </div>

        <div>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full bg-[#0b1120] border border-slate-800/90 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 focus:outline-none focus:border-[#f59e0b]/60 transition cursor-pointer"
          >
            <option value="all">Todas as turmas</option>
            {mockClasses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ======================================================== */}
      {/* GRID DE CARDS DOS ATLETAS (LAYOUT 3 COLUNAS) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student, index) => {
          const rank = index + 1;

          // Badges de colocação (1º ouro, 2º prata, 3º bronze, demais escuro)
          const rankBadgeStyle = 
            rank === 1 ? 'bg-[#3b2710] border border-[#f59e0b]/50 text-[#f59e0b]' :
            rank === 2 ? 'bg-[#1e293b] border border-slate-500/50 text-slate-200' :
            rank === 3 ? 'bg-[#38261e] border border-amber-700/50 text-amber-300' :
            'bg-[#131d2e] border border-slate-700/60 text-slate-300';

          // Nível esportivo (Craque da Turma, Destaque, Em Formação)
          const levelBadgeStyle = 
            student.player_level === 'Craque da Turma' ? 'bg-[#2b1c09] text-[#f59e0b] border border-[#f59e0b]/40' :
            student.player_level === 'Destaque' ? 'bg-[#0b2b1d] text-[#10b981] border border-[#10b981]/40' :
            'bg-[#0c1f38] text-[#38bdf8] border border-[#38bdf8]/40';

          return (
            <div
              key={student.id}
              className="bg-[#0b1120] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between gap-4 transition shadow-lg"
            >
              <div>
                {/* Linha superior: Rank + Nome + Categoria + Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${rankBadgeStyle}`}>
                      {rank}º
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm leading-tight">
                        {student.full_name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {student.position || 'Geral'} • {student.current_class?.name || 'Formação'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${levelBadgeStyle}`}>
                    {student.player_level || 'Em Formação'}
                  </span>
                </div>

                {/* Linha de Pontos & Estrelas */}
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-sm font-black text-[#facc15]">
                    <Star size={15} className="fill-[#facc15]" />
                    <span>{student.total_points || 180} pts</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    {student.stars_count || Math.floor((student.total_points || 180) / 20)} estrelas
                  </div>
                </div>
              </div>

              {/* Botão de Ação: + Atribuir Pontos / Estrela */}
              <button
                type="button"
                onClick={() => handleOpenAwardModal(student)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0e1627] hover:bg-[#1a233a] hover:border-[#f59e0b]/40 text-[#f59e0b] border border-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Plus size={14} /> Atribuir Pontos / Estrela
              </button>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODAL: ATRIBUIR PONTOS / ESTRELA */}
      {/* ======================================================== */}
      {isAwardModalOpen && awardStudent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="text-[#f59e0b]" size={20} /> Atribuir Pontos / Estrela
              </h2>
              <button 
                onClick={() => setIsAwardModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Identificação do Atleta */}
            <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">Atleta Selecionado</p>
                <p className="font-extrabold text-white text-base">{awardStudent.full_name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{awardStudent.position || 'Geral'} • {awardStudent.current_class?.name}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#facc15] font-black block">
                  ★ {awardStudent.total_points || 0} pts
                </span>
                <span className="text-xs text-emerald-400 font-semibold block">
                  {awardStudent.attendance_rate || 90}% Presença
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmAward} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Selecione o Fundamento ou Mérito Avaliado:
                </label>
                <div className="space-y-2">
                  {mockSportsSkills.map((skill) => (
                    <label
                      key={skill.dimension}
                      className={`
                        p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition
                        ${selectedSkill === skill.dimension 
                          ? 'bg-[#2b1c09] border-[#f59e0b]/50 text-white' 
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/60'
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
                          className="accent-[#f59e0b]"
                        />
                        <div>
                          <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                            <span>{skill.icon}</span> {skill.label}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{skill.desc}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#facc15] whitespace-nowrap pl-2">
                        +{skill.points} pts
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mensagem / Observação do Treinador */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nota do Treinador (Opcional):
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Ex: Excelente posicionamento tático e ótima atitude de equipe no treino..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f59e0b]"
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
                  className="px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <CheckCircle size={15} /> Confirmar Pontos & Estrela
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}