'use client';

import { useState } from 'react';
import { 
  mockStudents, 
  mockMatchScouts, 
  mockPhysicalScouts
} from '@/lib/mock-data';
import { 
  MatchScoutStats, 
  TrainingPhysicalScout,
  ScoutEventType
} from '@/lib/types';
import { 
  Activity, 
  Zap, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Share2, 
  Calendar, 
  Dumbbell, 
  X, 
  Trophy
} from 'lucide-react';

export default function ScoutPage() {
  const [activeTab, setActiveTab] = useState<'jogo' | 'treino' | 'card' | 'historico'>('jogo');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-1'); // Lucas Silveira por padrão
  
  // Lista de scouts de jogos (expansível via novo scout)
  const [matchScouts, setMatchScouts] = useState<MatchScoutStats[]>(mockMatchScouts);
  const [physicalScouts] = useState<Record<string, TrainingPhysicalScout>>(mockPhysicalScouts);

  // Modal Tapper de Beira de Campo
  const [isTapperModalOpen, setIsTapperModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Estado do Tapper Ao Vivo
  const [tapperStudentId, setTapperStudentId] = useState<string>('stu-1');
  const [tapperMatchType, setTapperMatchType] = useState<'coletivo_treino' | 'amistoso' | 'campeonato'>('coletivo_treino');
  const [tapperContext, setTapperContext] = useState<string>('Coletivo Tático da Semana');
  const [tapperMinutes, setTapperMinutes] = useState<number>(30);
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
    fouls_received: 0,
  });
  const [tapperNotes, setTapperNotes] = useState('');

  // Atleta e scout selecionados
  const selectedStudent = mockStudents.find(s => s.id === selectedStudentId) || mockStudents[0];
  const studentMatchScouts = matchScouts.filter(s => s.student_id === selectedStudentId);
  const latestMatchScout = studentMatchScouts[0] || mockMatchScouts[0];
  const currentPhysical = physicalScouts[selectedStudentId] || mockPhysicalScouts['stu-1'];

  // Manipular contadores no Tapper
  const updateLiveStat = (key: keyof typeof liveStats, delta: number) => {
    setLiveStats(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  // Salvar scout do Tapper
  const handleSaveTapperScout = (e: React.FormEvent) => {
    e.preventDefault();
    const st = mockStudents.find(s => s.id === tapperStudentId) || selectedStudent;
    
    // Cálculo automático de nota baseada no saldo positivo vs negativo
    const positiveScore = (liveStats.goals * 1.5) + (liveStats.assists * 1.2) + (liveStats.passes_completed * 0.15) + (liveStats.tackles_successful * 0.4) + (liveStats.saves_or_blocks * 0.5) + (liveStats.dribbles_successful * 0.3);
    const negativeScore = (liveStats.passes_missed * 0.2) + (liveStats.balls_lost * 0.4) + (liveStats.shots_off_target * 0.3) + (liveStats.fouls_committed * 0.3);
    const rawRating = 6.0 + positiveScore - negativeScore;
    const finalRating = Math.min(10.0, Math.max(4.0, Number(rawRating.toFixed(1))));

    const newScout: MatchScoutStats = {
      id: `scout-${Date.now()}`,
      student_id: st.id,
      student_name: st.full_name,
      position: st.position || 'Meio-Campo',
      match_type: tapperMatchType,
      match_date: new Date().toISOString().split('T')[0],
      opponent_context: tapperContext,
      minutes_played: tapperMinutes,
      ...liveStats,
      yellow_cards: 0,
      red_cards: 0,
      marking_lapses: liveStats.balls_lost > 3 ? 1 : 0,
      overall_rating: finalRating,
      coach_notes: tapperNotes || 'Scout registrado em tempo real na beira do campo.',
    };

    setMatchScouts(prev => [newScout, ...prev]);
    setSelectedStudentId(st.id);
    setIsTapperModalOpen(false);
    setActiveTab('jogo');

    // Resetar tapper
    setLiveStats({
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
      fouls_received: 0,
    });
    setTapperNotes('');
  };

  // Copiar relatório do scout para WhatsApp
  const handleCopyWhatsAppScout = () => {
    if (!latestMatchScout) return;
    const totalPasses = latestMatchScout.passes_completed + latestMatchScout.passes_missed;
    const passAccuracy = totalPasses > 0 ? Math.round((latestMatchScout.passes_completed / totalPasses) * 100) : 100;

    const msg = `📊 *Scout do Atleta - Escolinha Pro* ⚽\n\n` +
      `👤 *Atleta:* ${selectedStudent.full_name}\n` +
      `🏅 *Posição:* ${selectedStudent.position} | *Categoria:* ${selectedStudent.current_class?.name}\n` +
      `🏟️ *Jogo:* ${latestMatchScout.opponent_context} (${latestMatchScout.match_date})\n` +
      `⭐ *Nota da Partida:* ${latestMatchScout.overall_rating.toFixed(1)} / 10\n\n` +
      `✅ *Ações Positivas (Destaques):*\n` +
      `• Gols: ${latestMatchScout.goals} ⚽\n` +
      `• Assistências: ${latestMatchScout.assists} 👟\n` +
      `• Passes Certos: ${latestMatchScout.passes_completed} (${passAccuracy}% de precisão)\n` +
      `• Desarmes Limpos: ${latestMatchScout.tackles_successful} 🛡️\n` +
      `• Defesas / Bloqueios: ${latestMatchScout.saves_or_blocks} 🧤\n` +
      `• Dribles Completados: ${latestMatchScout.dribbles_successful} ⚡\n\n` +
      `⚠️ *Pontos de Correção no Treino:*\n` +
      `• Passes Errados: ${latestMatchScout.passes_missed} ❌\n` +
      `• Perdas de Posse: ${latestMatchScout.balls_lost}\n` +
      `• Faltas Cometidas: ${latestMatchScout.fouls_committed}\n\n` +
      `🏋️ *Físico no Treino:*\n` +
      `• Velocidade (Tiro 20m): ${currentPhysical.speed_20m_sec}s (${currentPhysical.speed_rating}/100)\n` +
      `• Potência do Chute: ${currentPhysical.shot_power_kmh} km/h\n` +
      `• Coordenação: ${currentPhysical.coordination_rating}/100 | Resistência: ${currentPhysical.endurance_rating}/100\n\n` +
      `💬 *Feedback da Comissão:*\n"${latestMatchScout.coach_notes}"`;

    navigator.clipboard.writeText(msg);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // Cálculos de aproveitamento
  const totalPasses = latestMatchScout ? latestMatchScout.passes_completed + latestMatchScout.passes_missed : 0;
  const passAccuracy = totalPasses > 0 ? Math.round((latestMatchScout.passes_completed / totalPasses) * 100) : 100;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 p-6 rounded-2xl border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <Activity size={14} /> Scout & Análise de Desempenho
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Scout do Jogador
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Registro completo de partidas (gols, defesas, desarmes, passes certos x errados) e testes físico-motores de treino (velocidade, força, coordenação e fôlego).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsTapperModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Zap size={16} /> Abrir Tapper Ao Vivo (Campo)
            </button>
            <button
              onClick={handleCopyWhatsAppScout}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm flex items-center gap-2 transition"
            >
              <Share2 size={16} /> WhatsApp dos Pais
            </button>
          </div>
        </div>

        {/* 4 Cards de Resumo do Atleta Selecionado */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Nota no Último Jogo</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {latestMatchScout ? latestMatchScout.overall_rating.toFixed(1) : '8.5'}
              <span className="text-xs text-slate-500 font-normal"> / 10</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {latestMatchScout?.opponent_context || 'Coletivo da semana'}
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Gols / Assistências</div>
            <div className="text-2xl font-black text-white mt-1">
              {latestMatchScout?.goals || 0} <span className="text-sm font-semibold text-slate-400">gols</span> • {latestMatchScout?.assists || 0} <span className="text-sm font-semibold text-slate-400">assists</span>
            </div>
            <div className="text-[11px] text-emerald-400">
              Participação direta ativa
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Precisão de Passes</div>
            <div className="text-2xl font-black text-teal-400 mt-1">
              {passAccuracy}%
            </div>
            <div className="text-[11px] text-slate-400">
              {latestMatchScout?.passes_completed || 0} certos / {totalPasses} tentados
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Físico Geral no Treino</div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {currentPhysical?.overall_physical_score || 85} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Tiro 20m: {currentPhysical?.speed_20m_sec || 3.5}s
            </div>
          </div>
        </div>
      </div>

      {copiedNotification && (
        <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} /> Relatório de Scout copiado com sucesso! Pronto para colar no WhatsApp dos pais.
        </div>
      )}

      {/* Seletor do Atleta em Análise */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Atleta Selecionado:</span>
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
              setTapperStudentId(selectedStudentId);
              setIsTapperModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus size={14} /> Anotar Scout Deste Atleta
          </button>
        </div>
      </div>

      {/* Tabs de Navegação do Scout */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('jogo')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'jogo'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target size={16} /> Raio-X do Jogo (O Que Fez de Bom x Ruim)
        </button>
        <button
          onClick={() => setActiveTab('treino')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'treino'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dumbbell size={16} /> Scout Físico de Treino (Velocidade & Força)
        </button>
        <button
          onClick={() => setActiveTab('card')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'card'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy size={16} /> Card do Craque (Atributos FUT)
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'historico'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar size={16} /> Histórico de Partidas
        </button>
      </div>

      {/* ======================================================== */}
      {/* ABA 1: RAIO-X DO JOGO (PONTOS POSITIVOS X PONTOS A CORRIGIR) */}
      {/* ======================================================== */}
      {activeTab === 'jogo' && (
        <div className="space-y-6">
          {/* Header da Partida */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-semibold uppercase">
                {latestMatchScout?.match_type === 'campeonato' ? '🏆 Campeonato Oficial' : latestMatchScout?.match_type === 'amistoso' ? '🤝 Amistoso' : '⚽ Coletivo Tático de Treino'}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {latestMatchScout?.opponent_context}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Data: {latestMatchScout?.match_date} • Tempo em campo: {latestMatchScout?.minutes_played} minutos
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800">
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-400 leading-none">
                  {latestMatchScout?.overall_rating.toFixed(1)}
                  <span className="text-xs text-slate-500 font-normal"> / 10</span>
                </div>
                <span className="text-[10px] text-slate-400">Avaliação Geral do Scout</span>
              </div>
            </div>
          </div>

          {/* Comparativo Lado a Lado: O QUE FEZ DE BOM vs O QUE PRECISA MELHORAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LADO VERDE: AÇÕES POSITIVAS */}
            <div className="bg-slate-900/90 rounded-2xl border border-emerald-800/40 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400 text-sm">Tudo de Bom Feito em Campo</h4>
                    <span className="text-[11px] text-slate-400">Ações construtivas e eficiência</span>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Destaques
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">⚽</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Gols Marcados</div>
                      <div className="text-[11px] text-slate-400">Finalizações convertidas em gol</div>
                    </div>
                  </div>
                  <span className="text-xl font-black text-emerald-400">{latestMatchScout?.goals || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">👟</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Assistências para Gol</div>
                      <div className="text-[11px] text-slate-400">Passes que deixaram o colega na cara do gol</div>
                    </div>
                  </div>
                  <span className="text-xl font-black text-emerald-400">{latestMatchScout?.assists || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">✅</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Passes Certos</div>
                      <div className="text-[11px] text-slate-400">{passAccuracy}% de aproveitamento</div>
                    </div>
                  </div>
                  <span className="text-xl font-black text-emerald-400">{latestMatchScout?.passes_completed || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Desarmes Limpos Realizados</div>
                      <div className="text-[11px] text-slate-400">Recuperação de posse sem cometer falta</div>
                    </div>
                  </div>
                  <span className="text-xl font-black text-emerald-400">{latestMatchScout?.tackles_successful || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🧤</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Defesas / Bloqueios de Chute</div>
                      <div className="text-[11px] text-slate-400">Intervenções defensivas cruciais</div>
                    </div>
                  </div>
                  <span className="text-xl font-black text-emerald-400">{latestMatchScout?.saves_or_blocks || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">⚡</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Dribles / 1v1 Vencidos</div>
                      <div className="text-[11px] text-slate-400">Superação de marcadores com a bola</div>
                    </div>
                  </div>
                  <span className="text-xl font-black text-emerald-400">{latestMatchScout?.dribbles_successful || 0}</span>
                </div>
              </div>
            </div>

            {/* LADO VERMELHO / ÂMBAR: PONTOS A CORRIGIR */}
            <div className="bg-slate-900/90 rounded-2xl border border-amber-800/40 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-400 text-sm">Oportunidades de Correção</h4>
                    <span className="text-[11px] text-slate-400">Erros observados para lapidar no treino</span>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Atenção
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">❌</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Passes Errados</div>
                      <div className="text-[11px] text-slate-400">Entregas de bola para o adversário</div>
                    </div>
                  </div>
                  <span className="text-xl font-black text-rose-400">{latestMatchScout?.passes_missed || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Perdas de Posse sob Pressão</div>
                      <div className="text-[11px] text-slate-400">Segurar a bola por tempo demais</div>
                    </div>
                  </div>
                  <span className="text-xl font-black text-amber-400">{latestMatchScout?.balls_lost || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🎯</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Finalizações Para Fora</div>
                      <div className="text-[11px] text-slate-400">Chutes sem direção correta</div>
                    </div>
                  </div>
                  <span className="text-xl font-black text-slate-300">{latestMatchScout?.shots_off_target || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🟨</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Faltas Cometidas</div>
                      <div className="text-[11px] text-slate-400">Entradas precipitadas ou desnecessárias</div>
                    </div>
                  </div>
                  <span className="text-xl font-black text-amber-300">{latestMatchScout?.fouls_committed || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🏃‍♂️</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Perda de Marcação / Desatenção</div>
                      <div className="text-[11px] text-slate-400">Demora para recompor após perder a bola</div>
                    </div>
                  </div>
                  <span className="text-xl font-black text-rose-300">{latestMatchScout?.marking_lapses || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🟨 / 🟥</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Cartões na Partida</div>
                      <div className="text-[11px] text-slate-400">Amarelos / Vermelhos</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs">
                      {latestMatchScout?.yellow_cards || 0}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-xs">
                      {latestMatchScout?.red_cards || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parecer do Treinador sobre o Jogo */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Activity size={16} className="text-emerald-400" />
              Parecer Técnico do Professor Sobre a Partida
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950 p-4 rounded-xl border border-slate-800">
              &ldquo;{latestMatchScout?.coach_notes}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 2: SCOUT FÍSICO-MOTOR DE TREINO */}
      {/* ======================================================== */}
      {activeTab === 'treino' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🏋️‍♂️</span>
                <h3 className="text-lg font-bold text-white">Avaliação Biomotora e Física de Treino</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Testes práticos de pista e campo realizados pela comissão técnica para calibrar velocidade, potência e agilidade.
              </p>
            </div>

            <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-right">
              <div className="text-2xl font-black text-amber-400 leading-none">
                {currentPhysical.overall_physical_score}
                <span className="text-xs text-slate-500 font-normal"> / 100</span>
              </div>
              <span className="text-[10px] text-slate-400">Score Físico Geral</span>
            </div>
          </div>

          {/* Grid dos 4 Pilares Físicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* VELOCIDADE */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl">
                    ⚡
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    {currentPhysical.speed_rating}/100
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">Velocidade & Arranque</h4>
                <div className="text-2xl font-black text-amber-400 mt-2">
                  {currentPhysical.speed_20m_sec}s
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Tiro curto de 20 metros</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                    style={{ width: `${currentPhysical.speed_rating}%` }}
                  />
                </div>
              </div>
            </div>

            {/* FORÇA & IMPACTO */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-xl">
                    🥊
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    {currentPhysical.strength_rating}/100
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">Força & Potência</h4>
                <div className="text-2xl font-black text-rose-400 mt-2">
                  {currentPhysical.shot_power_kmh} <span className="text-sm font-semibold">km/h</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Potência estimada do chute</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                    style={{ width: `${currentPhysical.strength_rating}%` }}
                  />
                </div>
              </div>
            </div>

            {/* COORDENAÇÃO & AGILIDADE */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center text-xl">
                    🌀
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                    {currentPhysical.coordination_rating}/100
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">Coordenação Motora</h4>
                <div className="text-2xl font-black text-teal-400 mt-2">
                  {currentPhysical.agility_circuit_sec}s
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Circuito de estacas e cones</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                    style={{ width: `${currentPhysical.coordination_rating}%` }}
                  />
                </div>
              </div>
            </div>

            {/* RESISTÊNCIA / FÔLEGO */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl">
                    🫁
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {currentPhysical.endurance_rating}/100
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">Resistência & Fôlego</h4>
                <div className="text-2xl font-black text-blue-400 mt-2">
                  {currentPhysical.endurance_rating > 85 ? 'Excelente' : 'Regular'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Intensidade mantida até o final</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    style={{ width: `${currentPhysical.endurance_rating}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* O que foi ótimo no treino vs o que falhou no treino */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 rounded-2xl border border-emerald-900/40 p-5">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
                <CheckCircle size={16} /> Destaques Observados nos Treinos
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentPhysical.strengths_in_training.map((str, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/80 rounded-2xl border border-amber-900/40 p-5">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
                <AlertTriangle size={16} /> O Que Precisa Lapidar no Treino
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentPhysical.improvements_in_training.map((imp, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 3: CARD DO CRAQUE (ESTILO FUT / FIFA) */}
      {/* ======================================================== */}
      {activeTab === 'card' && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-full max-w-md bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-500/40 p-6 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Cabeçalho do Card */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="text-left">
                <span className="text-3xl font-black text-amber-400 leading-none">
                  {Math.round((latestMatchScout.overall_rating * 10))}
                </span>
                <span className="text-[11px] block font-bold text-slate-400">OVR SCOUT</span>
              </div>
              <div className="text-right">
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black">
                  {selectedStudent.position || 'GER'}
                </span>
                <span className="text-[10px] block text-slate-400 mt-0.5">
                  {selectedStudent.current_class?.name.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Avatar / Destaque do Atleta */}
            <div className="my-6">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-4xl font-black text-slate-950 shadow-xl border-4 border-slate-900">
                {selectedStudent.full_name.charAt(0)}
              </div>
              <h3 className="text-xl font-black text-white mt-3">
                {selectedStudent.full_name}
              </h3>
              <p className="text-xs text-slate-400">
                Pé {selectedStudent.dominant_foot} • {selectedStudent.current_class?.name}
              </p>
            </div>

            {/* 6 Atributos Principais Estilo FUT */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-xs text-slate-400 font-bold">VEL (Velocidade)</span>
                <span className="text-sm font-black text-amber-400">{currentPhysical.speed_rating}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-xs text-slate-400 font-bold">FOR (Força)</span>
                <span className="text-sm font-black text-rose-400">{currentPhysical.strength_rating}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-xs text-slate-400 font-bold">PAS (Passe)</span>
                <span className="text-sm font-black text-emerald-400">{passAccuracy}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-xs text-slate-400 font-bold">DES (Desarme)</span>
                <span className="text-sm font-black text-teal-400">{latestMatchScout.tackles_successful * 15 + 30}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-xs text-slate-400 font-bold">FIN (Finalização)</span>
                <span className="text-sm font-black text-yellow-400">{latestMatchScout.goals * 20 + 40}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-xs text-slate-400 font-bold">COO (Coordenação)</span>
                <span className="text-sm font-black text-blue-400">{currentPhysical.coordination_rating}</span>
              </div>
            </div>

            {/* Rodapé do Card */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>⚽ Escolinha Pro Scout</span>
              <span className="text-amber-400 font-bold">Temporada 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 4: HISTÓRICO DE PARTIDAS E COLETIVOS */}
      {/* ======================================================== */}
      {activeTab === 'historico' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Histórico de Scouts Gravados</h3>
            <span className="text-xs text-slate-400">{matchScouts.length} partidas registradas</span>
          </div>

          <div className="space-y-3">
            {matchScouts.map(scout => {
              const passPct = scout.passes_completed + scout.passes_missed > 0
                ? Math.round((scout.passes_completed / (scout.passes_completed + scout.passes_missed)) * 100)
                : 100;

              return (
                <div key={scout.id} className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-white">{scout.student_name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                          {scout.position}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {scout.opponent_context} • {scout.match_date} ({scout.minutes_played} min)
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-400 leading-none">
                        {scout.overall_rating.toFixed(1)}
                        <span className="text-xs text-slate-500 font-normal"> / 10</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Nota Final</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-3 text-xs">
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block">Gols</span>
                      <strong className="text-emerald-400 font-black">{scout.goals}</strong>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block">Assists</span>
                      <strong className="text-emerald-400 font-black">{scout.assists}</strong>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block">Passes</span>
                      <strong className="text-teal-400 font-black">{scout.passes_completed} ({passPct}%)</strong>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block">Desarmes</span>
                      <strong className="text-emerald-400 font-black">{scout.tackles_successful}</strong>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block">Defesas</span>
                      <strong className="text-blue-400 font-black">{scout.saves_or_blocks}</strong>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block">Perdas Posse</span>
                      <strong className="text-rose-400 font-black">{scout.balls_lost}</strong>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                    &ldquo;{scout.coach_notes}&rdquo;
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TAPPER AO VIVO DE BEIRA DE CAMPO (TOUCH-FIRST) */}
      {/* ======================================================== */}
      {isTapperModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
            {/* Top Modal */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Zap size={18} className="text-emerald-400" />
                  Tapper de Scout Ao Vivo
                </h3>
                <p className="text-xs text-slate-400">
                  Toque nos botões para registrar as ações do jogador durante a partida.
                </p>
              </div>
              <button 
                onClick={() => setIsTapperModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo do Tapper */}
            <form onSubmit={handleSaveTapperScout} className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Seleção do Atleta e Partida */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Jogador:</label>
                  <select
                    value={tapperStudentId}
                    onChange={e => setTapperStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:border-emerald-500"
                  >
                    {mockStudents.map(st => (
                      <option key={st.id} value={st.id}>{st.full_name} ({st.position || 'GER'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Tipo de Evento:</label>
                  <select
                    value={tapperMatchType}
                    onChange={e => setTapperMatchType(e.target.value as ScoutEventType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:border-emerald-500"
                  >
                    <option value="coletivo_treino">Coletivo de Treino</option>
                    <option value="amistoso">Amistoso</option>
                    <option value="campeonato">Campeonato</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Minutos Jogados:</label>
                  <input
                    type="number"
                    value={tapperMinutes}
                    onChange={e => setTapperMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Contexto da Partida / Adversário */}
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Nome / Contexto do Confronto:</label>
                <input
                  type="text"
                  placeholder="Ex: Coletivo Tático - Colete Azul vs Vermelho, Amistoso Regional..."
                  value={tapperContext}
                  onChange={e => setTapperContext(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-emerald-500"
                />
              </div>

              {/* PAINEL DE BOTÕES TAPPER - AÇÕES POSITIVAS (VERDE) */}
              <div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block mb-2">
                  ✅ Ações Positivas (Destaques em Campo)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* GOL */}
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">⚽ Gol Feito</div>
                      <div className="text-lg font-black text-emerald-400">{liveStats.goals}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateLiveStat('goals', -1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLiveStat('goals', 1)}
                        className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* ASSISTÊNCIA */}
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">👟 Assistência</div>
                      <div className="text-lg font-black text-emerald-400">{liveStats.assists}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateLiveStat('assists', -1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLiveStat('assists', 1)}
                        className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* PASSE CERTO */}
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">🎯 Passe Certo</div>
                      <div className="text-lg font-black text-emerald-400">{liveStats.passes_completed}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateLiveStat('passes_completed', -1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLiveStat('passes_completed', 1)}
                        className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* DESARME */}
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">🛡️ Desarme</div>
                      <div className="text-lg font-black text-emerald-400">{liveStats.tackles_successful}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateLiveStat('tackles_successful', -1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLiveStat('tackles_successful', 1)}
                        className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* DEFESA */}
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">🧤 Defesa / Bloq.</div>
                      <div className="text-lg font-black text-emerald-400">{liveStats.saves_or_blocks}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateLiveStat('saves_or_blocks', -1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLiveStat('saves_or_blocks', 1)}
                        className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* DRIBLE */}
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">⚡ Drible Vencido</div>
                      <div className="text-lg font-black text-emerald-400">{liveStats.dribbles_successful}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateLiveStat('dribbles_successful', -1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLiveStat('dribbles_successful', 1)}
                        className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAINEL DE BOTÕES TAPPER - AÇÕES A CORRIGIR (VERMELHO / ÂMBAR) */}
              <div>
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider block mb-2">
                  ⚠️ Ações a Corrigir (Oportunidades de Treino)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* PASSE ERRADO */}
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">❌ Passe Errado</div>
                      <div className="text-lg font-black text-rose-400">{liveStats.passes_missed}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateLiveStat('passes_missed', -1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLiveStat('passes_missed', 1)}
                        className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-bold shadow-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* BOLA PERDIDA */}
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">⚠️ Bola Perdida</div>
                      <div className="text-lg font-black text-rose-400">{liveStats.balls_lost}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateLiveStat('balls_lost', -1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLiveStat('balls_lost', 1)}
                        className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-bold shadow-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* CHUTE PRA FORA */}
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">🎯 Chute Fora</div>
                      <div className="text-lg font-black text-amber-400">{liveStats.shots_off_target}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateLiveStat('shots_off_target', -1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLiveStat('shots_off_target', 1)}
                        className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center font-bold shadow-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* FALTA COMETIDA */}
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">🟨 Falta Cometida</div>
                      <div className="text-lg font-black text-amber-400">{liveStats.fouls_committed}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateLiveStat('fouls_committed', -1)}
                        className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLiveStat('fouls_committed', 1)}
                        className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center font-bold shadow-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback rápido do professor */}
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">
                  Parecer Técnico da Partida:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Excelente na armação, porém precisa soltar a bola mais rápido quando pressionado..."
                  value={tapperNotes}
                  onChange={e => setTapperNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-emerald-500"
                />
              </div>

              {/* Ações do Modal */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTapperModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-500/20"
                >
                  Finalizar & Salvar Scout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
