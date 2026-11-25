import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { RoleProvider } from '@/contexts/RoleContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Escolinha Pro — Gestão Esportiva & Performance',
  description: 'Sistema completo para escolinhas de futebol e modalidades esportivas.',
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
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
