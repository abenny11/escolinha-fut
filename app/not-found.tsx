import Link from 'next/link';
import { ArrowLeft, Home, Trophy } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center space-y-5">
      <div className="rounded-full bg-[#009fe3]/15 border border-[#009fe3]/30 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#009fe3]">
        Erro 404
      </div>
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
        Bola fora de campo!
      </h1>
      <p className="max-w-md text-sm sm:text-base text-slate-400">
        A página que você tentou acessar não foi encontrada ou foi movida. Volte para o início ou acesse os torneios e a página oficial do Grêmio Concórdia.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#009fe3] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0086c3] transition"
        >
          <Home className="size-4" /> Ir para o Início
        </Link>
        <Link
          href="/gremio-concordia"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-[#009fe3]"
        >
          <ArrowLeft className="size-4" /> Site Grêmio Concórdia
        </Link>
        <Link
          href="/torneios"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-[#009fe3]"
        >
          <Trophy className="size-4" /> Ver Torneios
        </Link>
      </div>
    </div>
  );
}
