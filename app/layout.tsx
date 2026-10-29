import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { RoleProvider } from '@/contexts/RoleContext';

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
        <RoleProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:pl-64 flex flex-col min-w-0 pt-14 lg:pt-0">
              <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                {children}
              </div>
            </main>
          </div>
        </RoleProvider>
      </body>
    </html>
  );
}
