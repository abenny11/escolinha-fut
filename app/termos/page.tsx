import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Termos e Condições | Escola de Futebol Grêmio Concórdia',
  description: 'Termos e condições de uso da plataforma e serviços da Escola de Futebol Grêmio Concórdia.',
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#0b1320] py-12 px-4">
      <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 space-y-6 shadow-sm">
        <Link href="/gremio-concordia" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077b6] hover:underline">
          <ArrowLeft className="size-4" /> Voltar ao site
        </Link>
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <FileText className="size-7 text-[#009fe3]" />
          <div>
            <h1 className="text-2xl font-black">Termos e Condições de Uso</h1>
            <p className="text-xs text-slate-500">Escola de Futebol Grêmio Concórdia · Concórdia – SC</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-bold text-base text-[#0b1320]">1. Objeto</h2>
          <p>
            Estes termos regulam o uso do site, do portal de torneios/súmulas e dos agendamentos de treinos experimentais da <strong>Escola de Futebol Grêmio Concórdia</strong>.
          </p>
          <h2 className="font-bold text-base text-[#0b1320]">2. Treinos Experimentais e Matrículas</h2>
          <p>
            O treino experimental gratuito destina-se a novos alunos de 4 a 15 anos mediante agendamento prévio pelo WhatsApp (49) 98896-8754. A efetivação da matrícula exige autorização do responsável legal e apresentação de atestado ou declaração de aptidão física.
          </p>
          <h2 className="font-bold text-base text-[#0b1320]">3. Torneios e Competições</h2>
          <p>
            A participação em ligas internas, amistosos, campeonatos e viagens segue o regulamento específico de cada competição publicado na aba de Torneios, incluindo regras disciplinares e de fair play.
          </p>
          <h2 className="font-bold text-base text-[#0b1320]">4. Contato</h2>
          <p>
            Endereço: <strong>Rua Gregório Bressan, Bairro São Cristóvão (próximo ao SENAI), Concórdia – SC</strong> · WhatsApp: <strong>(49) 98896-8754</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
