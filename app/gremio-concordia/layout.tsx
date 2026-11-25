import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Escola de Futebol Grêmio Concórdia | Unidade Conveniada Grêmio FBPA',
  description:
    'Unidade conveniada do Grêmio Foot-Ball Porto Alegrense em Concórdia-SC. Treinos 3x por semana para alunos de 4 a 15 anos. Agende seu treino experimental gratuito!',
  openGraph: {
    title: 'Escola de Futebol Grêmio Concórdia | Unidade Conveniada Grêmio FBPA',
    description:
      'Treinos 3x por semana para alunos de 4 a 15 anos na Rua Gregório Bressan, São Cristóvão, Concórdia-SC. Agende grátis pelo WhatsApp (49) 98896-8754.',
    url: 'https://escolinha-fut.vercel.app/gremio-concordia',
  },
};

export default function GremioConcordiaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
