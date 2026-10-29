'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  CalendarCheck, 
  CircleDollarSign, 
  Settings, 
  Menu,
  X,
  Sparkles,
  ChevronDown,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useState } from 'react';
import { useAppRole } from '@/contexts/RoleContext';
import { AppRole } from '@/lib/types';

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const { currentRole, setRole, roleLabels } = useAppRole();

  // Filtragem estrita de links por perfil (Permissionamento)
  const allNavItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { href: '/alunos', label: 'Alunos & Atletas', icon: Users, roles: ['admin', 'secretary'] },
    { href: '/turmas', label: 'Turmas & Treinos', icon: Trophy, roles: ['admin', 'secretary', 'coach'] },
    { href: '/chamada', label: 'Chamada Rápida', icon: CalendarCheck, badge: 'Treino', roles: ['admin', 'secretary', 'coach'] },
    { href: '/scout', label: 'Scout do Jogador', icon: Activity, badge: 'Ao Vivo', roles: ['admin', 'coach', 'guardian_portal'] },
    { href: '/desenvolvimento', label: 'Desenvolvimento Atleta', icon: TrendingUp, badge: '7 Dimensões', roles: ['admin', 'coach', 'guardian_portal'] },
    { href: '/gamificacao', label: 'Evolução & Estrelas', icon: Sparkles, badge: 'Craques', roles: ['admin', 'coach', 'guardian_portal'] },
    { href: '/financeiro', label: 'Financeiro', icon: CircleDollarSign, roles: ['admin', 'secretary'] },
    { href: '/portal-pais', label: 'Área do Responsável', icon: Users, roles: ['guardian_portal'] },
    { href: '/configuracoes', label: 'Configurações', icon: Settings, roles: ['admin', 'secretary'] },
  ];

  const visibleNavItems = allNavItems.filter(item => item.roles.includes(currentRole));

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
            ⚽
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block leading-none">Escolinha Pro</span>
            <span className="text-[10px] text-emerald-400 font-semibold">{roleLabels[currentRole].name}</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay Mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header / Logo */}
        <div className="p-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
              ⚽
            </div>
            <div>
              <h1 className="font-black text-slate-100 text-base leading-tight tracking-tight">Escolinha Pro</h1>
              <p className="text-[11px] text-emerald-400 font-semibold">Gestão & Performance</p>
            </div>
          </div>
        </div>

        {/* Chave Seletora de Visão / Permissionamento (Igual ao Escola Pro) */}
        <div className="p-3 border-b border-slate-800/60 bg-slate-900/40">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
            Alternar Visão de Perfil:
          </label>
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-base">{roleLabels[currentRole].icon}</span>
                <div>
                  <p className="text-xs font-bold text-white leading-none">{roleLabels[currentRole].name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{roleLabels[currentRole].desc.split(':')[0]}</p>
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-xl z-50 space-y-1">
                {(['admin', 'secretary', 'coach', 'guardian_portal'] as AppRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2 transition ${
                      currentRole === r ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{roleLabels[r].icon}</span>
                    <span className="truncate">{roleLabels[r].name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Links de Navegação Filtrados */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/10' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-slate-950' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé com Informações da Categoria / Usuário */}
        <div className="p-3 border-t border-slate-800/60 bg-slate-950/90">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              {roleLabels[currentRole].icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Sessão Ativa</p>
              <p className="text-[10px] text-emerald-400 font-medium truncate">{roleLabels[currentRole].name}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
