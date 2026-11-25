'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding =
    pathname?.startsWith('/gremio-concordia') ||
    pathname?.startsWith('/obrigado') ||
    pathname?.startsWith('/privacidade') ||
    pathname?.startsWith('/termos');

  if (isLanding) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="app-themed flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:pl-64 flex flex-col min-w-0 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
