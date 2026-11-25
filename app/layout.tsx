import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { CookieBanner } from '@/components/CookieBanner';
import { AnalyticsScript } from '@/components/AnalyticsScript';
import { RoleProvider } from '@/contexts/RoleContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://escolinha-fut.vercel.app'),
  title: {
    default: 'Escola de Futebol Grêmio Concórdia — Gestão, Torneios & Súmulas',
    template: '%s | Grêmio Concórdia',
  },
  description:
    'Sistema completo da Escola de Futebol Grêmio Concórdia (Unidade Conveniada Grêmio FBPA em Concórdia-SC): gestão de alunos, torneios, marcação ao vivo e súmula oficial.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://escolinha-fut.vercel.app',
    siteName: 'Escola de Futebol Grêmio Concórdia',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-slate-900 text-slate-100 min-h-screen antialiased`}>
        <ThemeProvider>
          <RoleProvider>
            <AppShell>{children}</AppShell>
            <CookieBanner />
            <AnalyticsScript />
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
