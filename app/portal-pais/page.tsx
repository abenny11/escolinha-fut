'use client';

import { useState, useEffect } from 'react';
import { 
  Star, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  MapPin, 
  Download,
  Flame,
  ShieldCheck,
  Award,
  HeartHandshake,
  MessageSquareQuote
} from 'lucide-react';
import { mockStudents, mockCharges } from '@/lib/mock-data';

export default function PortalPaisPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(mockStudents[0]?.id);
  const [copiedPix, setCopiedPix] = useState(false);
  const [showQrCard, setShowQrCard] = useState(false);
  const [schoolName, setSchoolName] = useState('Escolinha Pro');
  const [schoolPix, setSchoolPix] = useState('pix@escolinhapro.com.br');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('escolinha_pro_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.trade_name) setSchoolName(parsed.trade_name);
        if (parsed.pix_key) setSchoolPix(parsed.pix_key);
      }
    } catch {
      // fallback
    }
  }, []);

  const student = mockStudents.find(s => s.id === selectedStudentId) || mockStudents[0];
  const charge = mockCharges.find(c => c.student_name.includes(student.full_name)) || mockCharges[2];

  const handleCopyPix = () => {
    navigator.clipboard.writeText(schoolPix);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              👨‍👩‍👧 Área da Família
            </span>
            <span className="text-xs text-slate-400">{schoolName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Meu Atleta: {student.full_name} ⚽
          </h1>
          <p className="text-sm text-slate-400">
            Acompanhe a frequência, comportamento, desenvolvimento humano e evolução técnica do seu filho.
          </p>
        </div>

        {/* Seletor de Filho */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex gap-1 self-start sm:self-auto">
          {mockStudents.slice(0, 3).map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStudentId(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedStudentId === s.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s.full_name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Cartão do Atleta & Carteirinha Digital */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card Principal do Atleta */}
        <div className="md:col-span-2 bg-gradient-to-r from-slate-950 via-slate-950 to-purple-950/40 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-3xl flex items-center justify-center shadow-xl shadow-emerald-500/10 border-2 border-emerald-400">
              {student.full_name.substring(0, 2).toUpperCase()}
            </div>
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-slate-900 border border-emerald-500 text-[10px] font-bold text-emerald-400">
              {student.jersey_size || 'Tam 10'}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-xl font-black text-white">{student.full_name}</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {student.player_level}
                </span>
                {student.evolution_badge && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Award size={12} /> {student.evolution_badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Turma: <strong className="text-slate-200">{student.current_class?.name}</strong> • Posição: <strong className="text-slate-200">{student.position}</strong> ({student.dominant_foot})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start pt-1">
              <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Star size={14} className="fill-amber-400" />
                <span>{student.total_points} Pontos ({student.stars_count} ⭐)</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <CheckCircle2 size={14} />
                <span>{student.attendance_rate}% Presença</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                <Flame size={14} />
                <span>{student.presence_streak || 10} Treinos Seguidos</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                <ShieldCheck size={14} />
                <span>Nota Conduta: {student.behavior_score || 95}/100</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowQrCard(!showQrCard)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md shadow-purple-600/20"
              >
                <QrCode size={14} /> Carteirinha Digital do Atleta
              </button>
            </div>
          </div>
        </div>

        {/* Card de Mensalidade do Filho */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Mensalidade Atual
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">R$ {charge.final_amount.toFixed(2)}</span>
              <span className="text-xs text-slate-400">/ Vencimento: {charge.due_date}</span>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Chave PIX da Escolinha</span>
              <p className="text-xs font-mono text-emerald-400 truncate">{schoolPix}</p>
            </div>
          </div>

          <button
            onClick={handleCopyPix}
            className={`w-full mt-4 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              copiedPix 
                ? 'bg-emerald-500 text-slate-950' 
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <Copy size={14} />
            {copiedPix ? 'Chave PIX Copiada!' : 'Copiar Chave PIX'}
          </button>
        </div>
      </div>

      {/* Painel de Evolução do Aluno: Comportamento, Presença & Parecer do Treinador */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Parecer do Treinador */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquareQuote size={16} className="text-purple-400" />
              Parecer Pedagógico do Treinador
            </h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              Atualizado nesta semana
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-sm text-slate-300 italic leading-relaxed">
            &ldquo;{student.behavior_notes || 'Demonstra excelente dedicação nas atividades, escuta ativa aos combinados do treino e muita cooperação e respeito com todos os colegas de equipe.'}&rdquo;
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center gap-2">
              <HeartHandshake size={15} className="text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Fair Play & Respeito</p>
                <p className="text-[11px] text-slate-400">Atitude positiva com os pares</p>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center gap-2">
              <Flame size={15} className="text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Comprometimento</p>
                <p className="text-[11px] text-slate-400">Pontualidade e zelo nos treinos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pilares de Desenvolvimento Pessoal */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            Pilares de Desenvolvimento do Atleta
          </h3>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Assiduidade & Presença</span>
                <span className="text-emerald-400 font-bold">{student.attendance_rate}% ({student.presence_streak || 10} consecutivas)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all" 
                  style={{ width: `${student.attendance_rate}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Comportamento & Convivência em Grupo</span>
                <span className="text-blue-400 font-bold">{student.behavior_score || 95}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all" 
                  style={{ width: `${student.behavior_score || 95}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Aplicação Prática das Instruções</span>
                <span className="text-purple-400 font-bold">Consistente (Nível 4/5)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all" 
                  style={{ width: `80%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carteirinha Digital Modal/Drawer */}
      {showQrCard && (
        <div className="p-6 bg-slate-950 border border-purple-500/30 rounded-2xl max-w-sm mx-auto shadow-2xl relative">
          <div className="text-center pb-4 border-b border-slate-800">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">{schoolName.toUpperCase()}</span>
            <h3 className="text-lg font-black text-white tracking-tight">CARTEIRINHA DO ATLETA</h3>
          </div>

          <div className="py-5 flex flex-col items-center text-center space-y-3">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-emerald-400 flex items-center justify-center text-2xl font-black text-emerald-400">
              {student.full_name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-base font-bold text-white">{student.full_name}</p>
              <p className="text-xs text-slate-400">Categoria: {student.current_class?.name}</p>
              <p className="text-xs text-slate-400">Resp: {student.guardian?.full_name}</p>
            </div>

            {/* Simulação do QR Code estilizado */}
            <div className="p-3 bg-white rounded-xl shadow-md">
              <div className="w-28 h-28 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white">
                <QrCode size={80} className="text-slate-100" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500">ID de Acesso: {student.id}</p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between gap-2">
            <button
              onClick={() => alert('Download do Cartão A6 pronto para impressão!')}
              className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <Download size={14} /> Imprimir / PDF
            </button>
            <button
              onClick={() => setShowQrCard(false)}
              className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-400 font-semibold hover:text-white"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Grade de Treinos da Semana */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Próximos Treinos da Categoria ({student.current_class?.name})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                TER
              </div>
              <div>
                <p className="text-sm font-bold text-white">Terça-feira • 15:30 às 16:45</p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin size={12} className="text-slate-500" /> Campo 1 (Sintético)
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              Confirmado
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                QUI
              </div>
              <div>
                <p className="text-sm font-bold text-white">Quinta-feira • 15:30 às 16:45</p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin size={12} className="text-slate-500" /> Campo 1 (Sintético)
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              Confirmado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
