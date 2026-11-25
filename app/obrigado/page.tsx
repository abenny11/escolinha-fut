import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, MessageCircle, Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agendamento Recebido | Escola de Futebol Grêmio Concórdia',
  description: 'Obrigado por agendar seu treino experimental gratuito na Escola de Futebol Grêmio Concórdia.',
};

export default function ObrigadoPage() {
  return (
    <div className="min-h-screen bg-[#050912] text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center space-y-5 shadow-2xl">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#009fe3]/20 text-[#38bdf8]">
          <CheckCircle2 className="size-9" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Agendamento Enviado!</h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Recebemos os dados do atleta para o <strong>Treino Experimental Gratuito</strong> na{' '}
          <strong>Escola de Futebol Grêmio Concórdia</strong>. Nossa coordenação confirmará o horário pelo WhatsApp{' '}
          <strong>(49) 98896-8754</strong>.
        </p>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-slate-300 space-y-1 text-left">
          <p><strong>Local:</strong> Rua Gregório Bressan, Bairro São Cristóvão (próximo ao SENAI), Concórdia – SC</p>
          <p><strong>Dica:</strong> Compareça com 15 minutos de antecedência usando tênis/chuteira society, meião e garrafa de água.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/gremio-concordia"
            className="inline-flex items-center gap-2 rounded-xl bg-[#009fe3] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0086c3] transition"
          >
            <ArrowLeft className="size-4" /> Voltar para a Página
          </Link>
          <a
            href="https://wa.me/5549988968754"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition"
          >
            <MessageCircle className="size-4 text-[#38bdf8]" /> Falar no WhatsApp
          </a>
          <Link
            href="/torneios"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-[#38bdf8]"
          >
            <Trophy className="size-4" /> Ver Torneios
          </Link>
        </div>
      </div>
    </div>
  );
}
