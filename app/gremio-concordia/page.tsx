'use client';

import { useState } from 'react';
import {
  Award,
  Bus,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';

const WHATSAPP_NUM = '5549988968754';
const WHATSAPP_DISPLAY = '(49) 98896-8754';
const INSTAGRAM_URL = 'https://www.instagram.com/ctgremioconcordia/';
const ENDERECO = 'Rua Gregório Bressan, Bairro São Cristóvão (próximo ao SENAI), Concórdia – SC';

function Instagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinhasCampo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 260" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="10" y="10" width="380" height="240" rx="4" />
      <line x1="200" y1="10" x2="200" y2="250" />
      <circle cx="200" cy="130" r="36" />
      <circle cx="200" cy="130" r="3" fill="currentColor" />
      <rect x="10" y="80" width="46" height="100" />
      <rect x="344" y="80" width="46" height="100" />
      <path d="M56 104a30 30 0 0 1 0 52M344 104a30 30 0 0 0 0 52" />
    </svg>
  );
}

const CATEGORIAS = [
  { nome: 'Sub-5 / Sub-7', idade: '4 a 7 anos', foco: 'Coordenação motora, ludicidade e primeiros toques na bola' },
  { nome: 'Sub-9', idade: '8 e 9 anos', foco: 'Fundamentos de passe, condução, domínio e espírito de equipe' },
  { nome: 'Sub-11', idade: '10 e 11 anos', foco: 'Noções táticas, tomada de decisão e liga interna' },
  { nome: 'Sub-13', idade: '12 e 13 anos', foco: 'Aperfeiçoamento técnico, posicionamento e torneios regionais' },
  { nome: 'Sub-15', idade: '14 e 15 anos', foco: 'Alto rendimento formativo, preparação competitiva e amistosos' },
];

export default function GremioConcordiaLanding() {
  const [alunoNome, setAlunoNome] = useState('');
  const [alunoIdade, setAlunoIdade] = useState('10');
  const [responsavel, setResponsavel] = useState('');
  const [turno, setTurno] = useState('Tarde');

  const zapUrl = (texto: string) =>
    `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(texto)}`;

  const zapGeral = zapUrl(
    'Olá! Vim pelo site da Escola de Futebol do Grêmio Concórdia e gostaria de agendar um treino experimental gratuito.',
  );

  function agendarExperimental(e: React.FormEvent) {
    e.preventDefault();
    const msg = [
      'Olá! Gostaria de agendar um *Treino Experimental Gratuito* na Escola de Futebol do Grêmio Concórdia:',
      `• *Atleta:* ${alunoNome.trim() || 'A informar'}`,
      `• *Idade:* ${alunoIdade} anos`,
      `• *Responsável:* ${responsavel.trim() || 'A informar'}`,
      `• *Turno de preferência:* ${turno}`,
    ].join('\n');
    window.open(zapUrl(msg), '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#0b1320] pb-20 md:pb-0">
      {/* ================================================================ */}
      {/* HERO (Estilo Estação X1 adaptado para o Tricolor - Grêmio)       */}
      {/* ================================================================ */}
      <header className="relative overflow-hidden bg-[#050912] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,159,227,0.28),_transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#009fe3] via-white to-[#050912]" />
        <LinhasCampo className="pointer-events-none absolute -right-24 top-6 w-[42rem] max-w-none text-[#009fe3]/15 md:right-0" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-6 md:pb-24">
          <nav className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/gremio-concordia-logo.svg" alt="Grêmio Concórdia" className="size-12 rounded-xl ring-2 ring-white/20 shadow-lg bg-[#050912]" />
              <div>
                <span className="block text-base sm:text-lg font-black tracking-tight leading-none">
                  Grêmio Concórdia
                </span>
                <span className="text-[11px] font-semibold text-[#38bdf8]">
                  Unidade Conveniada Grêmio FBPA
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/20 ring-1 ring-white/15 transition"
              >
                <Instagram className="size-3.5" /> @ctgremioconcordia
              </a>
              <a
                href="#experimental"
                className="rounded-full bg-[#009fe3] px-4 py-1.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0086c3] transition shadow-lg shadow-[#009fe3]/25"
              >
                Treino Grátis
              </a>
            </div>
          </nav>

          <div className="mt-12 items-center gap-10 md:mt-16 md:grid md:grid-cols-[1fr_22rem]">
            <div className="max-w-2xl">
              <a
                href="#experimental"
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#009fe3]/20 border border-[#009fe3]/40 px-3.5 py-1 text-xs sm:text-sm font-semibold text-[#7dd3fc] hover:bg-[#009fe3]/30 transition"
              >
                <span className="size-2 animate-pulse rounded-full bg-[#38bdf8]" />
                Concórdia – SC · Metodologia Oficial do Grêmio desde 2018
              </a>

              <h1 className="text-4xl font-black leading-[1.06] tracking-tight md:text-6xl">
                Formando atletas e cidadãos.{' '}
                <span className="text-[#38bdf8]">Aqui nasce o futuro tricolor.</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed">
                Unidade conveniada do <strong>Grêmio Foot-Ball Porto Alegrense</strong> em Concórdia, SC.
                Treinos 3 vezes por semana para alunos de <strong>4 a 15 anos</strong> com a metodologia oficial do clube.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#experimental"
                  className="rounded-xl border-b-4 border-[#006fa1] bg-[#009fe3] px-6 py-3.5 text-sm sm:text-base font-bold text-white transition hover:bg-[#008ecc] active:translate-y-0.5 active:border-b-2"
                >
                  Agendar Treino Experimental Gratuito
                </a>
                <a
                  href={zapGeral}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm sm:text-base font-bold text-white hover:bg-white/20 transition"
                >
                  <MessageCircle className="size-5 text-[#38bdf8]" /> WhatsApp {WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>

            {/* Card Lateral Destaque no Hero */}
            <div className="mt-8 md:mt-0 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">Informações Rápidas</span>
                <span className="rounded-full bg-[#009fe3]/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  4 a 15 anos
                </span>
              </div>
              <ul className="space-y-3 text-sm text-white/90">
                <li className="flex items-start gap-2.5">
                  <CalendarCheck className="size-4 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span><strong>3 treinos por semana</strong> com metodologia oficial do Grêmio FBPA</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Sparkles className="size-4 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span><strong>1º treino experimental gratuito</strong> mediante agendamento</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Trophy className="size-4 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span>Liga interna, torneios regionais, society e amistosos</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Bus className="size-4 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span>Excursões e viagens oficiais a <strong>Porto Alegre</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="size-4 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span className="text-xs text-white/75">{ENDERECO}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/* PILARES DA METODOLOGIA                                           */}
      {/* ================================================================ */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0077b6]">Metodologia Oficial</span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-black text-[#0b1320]">
            Por que treinar no Grêmio Concórdia?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Atuando em Concórdia desde 2018 com foco na formação esportiva, disciplina e vivência real de clube.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Shield,
              titulo: 'Metodologia Grêmio FBPA',
              desc: 'Planejamento pedagógico e técnico alinhado à base oficial do Grêmio Foot-Ball Porto Alegrense.',
            },
            {
              icon: Users,
              titulo: 'Turmas de 4 a 15 anos',
              desc: 'Divisão por faixa etária e nível técnico para respeitar o desenvolvimento de cada atleta.',
            },
            {
              icon: Clock,
              titulo: '3x por Semana',
              desc: 'Frequência consistente de treinos semanais para evolução técnica, física e tática.',
            },
            {
              icon: Award,
              titulo: 'Valores e Cidadania',
              desc: 'Respeito, trabalho em equipe, pontualidade e fair play dentro e fora das quatro linhas.',
            },
          ].map((item) => (
            <div key={item.titulo} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#009fe3]/50 transition">
              <div className="mb-3 grid size-11 place-items-center rounded-xl bg-[#009fe3]/10 text-[#0077b6]">
                <item.icon className="size-6" />
              </div>
              <h3 className="font-bold text-base text-[#0b1320]">{item.titulo}</h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* CATEGORIAS (4 A 15 ANOS)                                         */}
      {/* ================================================================ */}
      <section className="bg-white border-y border-slate-200 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0077b6]">Categorias</span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black text-[#0b1320]">
                Do Sub-5 ao Sub-15
              </h2>
            </div>
            <p className="text-sm text-slate-600">Treinos 3 vezes por semana · Experimente gratuitamente</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIAS.map((c) => (
              <div key={c.nome} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 hover:border-[#009fe3] transition">
                <div>
                  <span className="inline-block rounded-full bg-[#009fe3]/15 px-2.5 py-0.5 text-xs font-bold text-[#0077b6]">
                    {c.idade}
                  </span>
                  <h3 className="mt-2 font-black text-lg text-[#0b1320]">{c.nome}</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{c.foco}</p>
                </div>
                <a
                  href={zapUrl(`Olá! Gostaria de agendar um treino experimental na categoria ${c.nome} (${c.idade}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#050912] px-3 py-2 text-xs font-bold text-white hover:bg-[#009fe3] transition"
                >
                  Agendar aula
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* COMPETIÇÕES E VIAGENS A PORTO ALEGRE                             */}
      {/* ================================================================ */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl bg-[#050912] text-white p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(0,159,227,0.25),_transparent_55%)]" />
          <div className="relative grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#009fe3]/20 px-3 py-1 text-xs font-bold text-[#38bdf8]">
                <Trophy className="size-3.5" /> Além dos Treinos
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                Competições, torneios e viagens a Porto Alegre.
              </h2>
              <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                Nossos atletas vivenciam o futebol de verdade ao longo de todo o ano, fortalecendo confiança, espírito competitivo e amizade.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { titulo: 'Liga Interna & Torneios', desc: 'Campeonatos internos organizados com tabela, artilharia e premiação.' },
                { titulo: 'Futebol Society & Amistosos', desc: 'Jogos contra outras escolinhas e campeonatos regionais de SC.' },
                { titulo: 'Excursões a Porto Alegre', desc: 'Viagens oficiais para conhecer a estrutura do Grêmio e viver a cultura do clube.' },
                { titulo: 'Integração com as Famílias', desc: 'Eventos, festivais e acompanhamento próximo dos pais e responsáveis.' },
              ].map((card) => (
                <div key={card.titulo} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className="size-5 text-[#38bdf8] mb-2" />
                  <h3 className="font-bold text-sm text-white">{card.titulo}</h3>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FORMULÁRIO TREINO EXPERIMENTAL GRATUITO                          */}
      {/* ================================================================ */}
      <section id="experimental" className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-8 lg:grid-cols-2 items-start rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0077b6]">Aula Experimental</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0b1320]">
              Agende um treino experimental gratuito
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Preencha os dados do atleta ao lado e envie direto para o nosso WhatsApp oficial. Nossa coordenação confirma o melhor dia e horário para a categoria.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-[#0077b6] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#0b1320]">Endereço</strong>
                  <span>{ENDERECO}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-[#0077b6] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#0b1320]">Telefone / WhatsApp</strong>
                  <a href={zapGeral} target="_blank" rel="noopener noreferrer" className="text-[#0077b6] font-semibold hover:underline">
                    {WHATSAPP_DISPLAY}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Instagram className="size-5 text-[#0077b6] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#0b1320]">Instagram Oficial</strong>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#0077b6] font-semibold hover:underline">
                    @ctgremioconcordia
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={agendarExperimental} className="space-y-4 rounded-2xl border border-slate-200 bg-[#f8fafc] p-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Aluno / Atleta *</label>
              <input
                required
                value={alunoNome}
                onChange={(e) => setAlunoNome(e.target.value)}
                placeholder="Ex: Lucas Gabriel"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none focus:border-[#009fe3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Idade (4 a 15 anos) *</label>
                <input
                  type="number"
                  min={4}
                  max={15}
                  required
                  value={alunoIdade}
                  onChange={(e) => setAlunoIdade(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none focus:border-[#009fe3]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Turno de Preferência</label>
                <select
                  value={turno}
                  onChange={(e) => setTurno(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none focus:border-[#009fe3]"
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Responsável *</label>
              <input
                required
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Nome do pai, mãe ou responsável"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none focus:border-[#009fe3]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl border-b-4 border-[#006fa1] bg-[#009fe3] py-3.5 text-sm font-bold text-white hover:bg-[#008ecc] transition active:translate-y-0.5 active:border-b-2"
            >
              <MessageCircle className="size-4" /> Enviar Agendamento no WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* ================================================================ */}
      {/* LOCALIZAÇÃO & MAPA                                               */}
      {/* ================================================================ */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black text-[#0b1320]">Onde Estamos em Concórdia – SC</h2>
              <p className="text-sm text-slate-600">{ENDERECO}</p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Rua+Gregorio+Bressan+Sao+Cristovao+Concordia+SC"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#050912] px-4 py-2 text-xs font-bold text-white hover:bg-[#009fe3] transition"
            >
              Abrir no Google Maps
            </a>
          </div>
          <iframe
            title="Mapa Grêmio Concórdia"
            src="https://www.google.com/maps?q=Rua+Gregorio+Bressan,+Concordia+-+SC&output=embed"
            className="h-72 w-full border-0"
            loading="lazy"
          />
        </div>
      </section>

      {/* ================================================================ */}
      {/* RODAPÉ                                                           */}
      {/* ================================================================ */}
      <footer className="bg-[#050912] text-white py-8 px-4 border-t border-white/10">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div>
            <strong className="text-white">Escola de Futebol Grêmio Concórdia</strong> · Unidade Conveniada Grêmio FBPA · Desde 2018
          </div>
          <div className="flex items-center gap-4">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#38bdf8] transition flex items-center gap-1">
              <Instagram className="size-3.5" /> @ctgremioconcordia
            </a>
            <a href={zapGeral} target="_blank" rel="noopener noreferrer" className="hover:text-[#38bdf8] transition flex items-center gap-1">
              <Phone className="size-3.5" /> {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
      </footer>

      {/* Barra fixa mobile WhatsApp */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden flex gap-2">
        <a
          href="#experimental"
          className="flex-1 rounded-xl bg-[#009fe3] py-3 text-center text-xs font-bold text-white"
        >
          Agendar Treino Grátis
        </a>
        <a
          href={zapGeral}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#050912] px-4 py-3 text-xs font-bold text-white"
        >
          <MessageCircle className="size-4 text-[#38bdf8]" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
