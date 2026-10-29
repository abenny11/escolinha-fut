'use client';

import { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Star, 
  Plus, 
  X, 
  Search
} from 'lucide-react';
import { mockStudents, mockSportsSkills, mockClasses } from '@/lib/mock-data';
import { Student, SportSkillDimension } from '@/lib/types';

export default function GamificacaoPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Atribuir Pontos
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [awardStudent, setAwardStudent] = useState<Student | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SportSkillDimension>('passe_dominio');
  const [customNote, setCustomNote] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredStudents = students
    .filter(s => {
      const matchesClass = selectedClassId === 'all' || s.current_class?.id === selectedClassId;
      const matchesSearch = s.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesClass && matchesSearch;
    })
    .sort((a, b) => (b.total_points || 0) - (a.total_points || 0));

  const handleOpenAwardModal = (student: Student) => {
    setAwardStudent(student);
    setIsAwardModalOpen(true);
    setCustomNote('');
  };

  const handleConfirmAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardStudent) return;

    const skill = mockSportsSkills.find(s => s.dimension === selectedSkill);
    const addedPoints = skill?.points || 15;

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
          player_level: newLevel
        };
      }
      return s;
    });

    setStudents(updated);
    setIsAwardModalOpen(false);
    setSuccessToast(`+${addedPoints} pts atribuídos a ${awardStudent.full_name} em "${skill?.label}"!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Trophy size={13} /> Performance & Mérito
            </span>
            <span className="text-xs text-slate-400">Gamificação Esportiva</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Evolução Técnica & Estrelas ⭐
          </h1>
          <p className="text-sm text-slate-400">
            Reconheça a dedicação, fundamentos e evolução dos atletas nos treinos.
          </p>
        </div>
      </div>

      {/* Toast de Sucesso */}
      {successToast && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-3">
          <Sparkles size={20} className="text-amber-400 flex-shrink-0" />
          <p className="font-bold text-sm text-white">{successToast}</p>
        </div>
      )}

      {/* Destaque do Treino / Atleta da Semana */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 flex-shrink-0">
            🏆
          </div>
          <div className="flex-1 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Craque da Semana</span>
            <h2 className="text-xl font-extrabold text-white mt-0.5">{filteredStudents[0]?.full_name}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Posição: <strong className="text-slate-200">{filteredStudents[0]?.position}</strong> • Categoria: {filteredStudents[0]?.current_class?.name}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⭐ {filteredStudents[0]?.total_points} Pontos
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                🔥 {filteredStudents[0]?.attendance_rate}% Presença
              </span>
            </div>
          </div>
        </div>

        {/* Card de Critérios */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Fundamentos Avaliados</h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p>⚽ <strong>Passe & Domínio:</strong> +15 pts</p>
              <p>🎯 <strong>Finalização & Chute:</strong> +20 pts</p>
              <p>🛡️ <strong>Marcação & Desarme:</strong> +15 pts</p>
              <p>🤝 <strong>Fair Play & Equipe:</strong> +20 pts</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold mt-3 pt-3 border-t border-slate-800">
            Atribua estrelas no final de cada treino!
          </p>
        </div>
      </div>

      {/* Filtros e Busca de Atletas */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar atleta por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
        >
          <option value="all">Todas as turmas</option>
          {mockClasses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Grid de Ranking dos Atletas */}
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
                        {student.position || 'Atleta'} • {student.current_class?.name}
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

                {/* Pontuação e Estrelas */}
                <div className="mt-4 p-3 bg-slate-900/90 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star size={16} className="fill-amber-400" />
                    <span className="font-black text-base text-white">{student.total_points}</span>
                    <span className="text-xs text-slate-400">pts</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    <strong className="text-white">{student.stars_count}</strong> estrelas
                  </div>
                </div>
              </div>

              {/* Botão de Avaliar / Dar Pontos */}
              <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenAwardModal(student)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Atribuir Pontos / Estrela
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Atribuir Pontos em Fundamentos (Inspirado no AwardStarsDialog do Escola Pro) */}
      {isAwardModalOpen && awardStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="text-amber-400" size={20} /> Avaliar Atleta
              </h2>
              <button 
                onClick={() => setIsAwardModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl">
              <p className="text-xs text-slate-400">Atleta Selecionado</p>
              <p className="font-bold text-white text-sm">{awardStudent.full_name}</p>
              <p className="text-xs text-slate-400">{awardStudent.current_class?.name}</p>
            </div>

            <form onSubmit={handleConfirmAward} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Selecione o Fundamento / Mérito Esportivo *
                </label>
                <div className="space-y-2">
                  {mockSportsSkills.map((skill) => (
                    <label
                      key={skill.dimension}
                      className={`
                        p-3 rounded-xl border flex items-center justify-between cursor-pointer transition
                        ${selectedSkill === skill.dimension 
                          ? 'bg-amber-500/10 border-amber-500/40 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/70'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
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
                      <span className="text-xs font-extrabold text-amber-400">+{skill.points} pts</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Observação do Treinador (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ótima jogada de linha de fundo no final do coletivo."
                  value={customNote}
                  onChange={e => setCustomNote(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAwardModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Confirmar Pontuação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
