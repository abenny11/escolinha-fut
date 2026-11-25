import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Escola de Futebol Grêmio Concórdia',
  description: 'Política de Privacidade e proteção de dados (LGPD) da Escola de Futebol Grêmio Concórdia.',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#0b1320] py-12 px-4">
      <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 space-y-6 shadow-sm">
        <Link href="/gremio-concordia" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077b6] hover:underline">
          <ArrowLeft className="size-4" /> Voltar ao site
        </Link>
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <Shield className="size-7 text-[#009fe3]" />
          <div>
            <h1 className="text-2xl font-black">Política de Privacidade (LGPD)</h1>
            <p className="text-xs text-slate-500">Escola de Futebol Grêmio Concórdia · Atualizado em Novembro de 2026</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            A <strong>Escola de Futebol Grêmio Concórdia</strong>, unidade conveniada do Grêmio Foot-Ball Porto Alegrense em Concórdia – SC, respeita a privacidade de alunos, atletas, pais e responsáveis, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).
          </p>
          <h2 className="font-bold text-base text-[#0b1320]">1. Dados Coletados</h2>
          <p>
            Coletamos apenas os dados necessários para matrícula, agendamento de treinos experimentais, organização de turmas, participação em campeonatos, emissão de súmulas e comunicação com os responsáveis (nome do atleta, data de nascimento/idade, nome do responsável, telefone/WhatsApp e informações médicas relevantes para a prática esportiva).
          </p>
          <h2 className="font-bold text-base text-[#0b1320]">2. Uso de Dados de Menores</h2>
          <p>
            O tratamento de dados de crianças e adolescentes (4 a 15 anos) é realizado exclusivamente mediante consentimento e acompanhamento dos pais ou responsáveis legais, estritamente para fins esportivos, educacionais e de segurança.
          </p>
          <h2 className="font-bold text-base text-[#0b1320]">3. Compartilhamento e Segurança</h2>
          <p>
            Não comercializamos nem cedemos dados pessoais a terceiros. As informações são utilizadas apenas pela coordenação técnica, secretaria e, quando necessário, para inscrição em competições oficiais autorizadas.
          </p>
          <h2 className="font-bold text-base text-[#0b1320]">4. Contato do Encarregado (DPO)</h2>
          <p>
            Para solicitar acesso, correção ou exclusão de dados, entre em contato pelo WhatsApp <strong>(49) 98896-8754</strong> ou presencialmente na <strong>Rua Gregório Bressan, Bairro São Cristóvão (próximo ao SENAI), Concórdia – SC</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
