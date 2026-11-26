'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { useAppRole } from '@/contexts/RoleContext';
import type { AppRole } from '@/lib/types';

const ROUTE_PERMISSIONS: Record<string, AppRole[]> = {
  '/dashboard': ['admin'],
  '/alunos': ['admin', 'secretary'],
  '/turmas': ['admin', 'secretary', 'coach'],
  '/torneios': ['admin', 'secretary', 'coach', 'guardian_portal'],
  '/chamada': ['admin', 'secretary', 'coach'],
  '/experimentais': ['admin', 'secretary', 'coach'],
  '/uniformes': ['admin', 'secretary'],
  '/financeiro': ['admin', 'secretary'],
  '/rentabilidade': ['admin'],
  '/indicadores': ['admin'],
  '/comunicacao': ['admin', 'secretary', 'coach'],
  '/desenvolvimento': ['admin', 'coach', 'guardian_portal'],
  '/gamificacao': ['admin', 'coach', 'guardian_portal'],
  '/scout': ['admin', 'coach'],
  '/portal-pais': ['guardian_portal', 'admin'],
  '/configuracoes': ['admin', 'secretary'],
};

const HOME_BY_ROLE: Record<AppRole, string> = {
  admin: '/dashboard',
  secretary: '/alunos',
  coach: '/turmas',
  guardian_portal: '/portal-pais',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentRole, roleLabels } = useAppRole();

  const isPublicStandalone =
    pathname === '/' ||
    pathname?.startsWith('/gremio-concordia') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/obrigado') ||
    pathname?.startsWith('/privacidade') ||
    pathname?.startsWith('/termos') ||
    (pathname?.startsWith('/torneios/') && pathname !== '/torneios');

  if (isPublicStandalone) {
    return <div className="min-h-screen">{children}</div>;
  }

  const allowedRoles = pathname ? ROUTE_PERMISSIONS[pathname] : undefined;
  const isAllowed = !allowedRoles || allowedRoles.includes(currentRole);

  return (
    <div className="app-themed flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:pl-64 flex flex-col min-w-0 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isAllowed ? (
            children
          ) : (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 rounded-2xl border border-slate-800 bg-slate-950 p-8">
              <div className="rounded-full bg-amber-500/15 p-3 text-amber-400">
                <Lock className="size-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Acesso Restrito ao Perfil</h2>
              <p className="max-w-md text-sm text-slate-400">
                Seu perfil atual (<strong className="text-white">{roleLabels[currentRole].name}</strong>) não possui permissão para acessar esta tela.
              </p>
              <div className="flex gap-3">
                <Link
                  href={HOME_BY_ROLE[currentRole]}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950"
                >
                  Ir para minha tela inicial
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200"
                >
                  Trocar conta / Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
