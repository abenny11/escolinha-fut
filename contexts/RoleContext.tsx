'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppRole } from '@/lib/types';

interface RoleContextType {
  currentRole: AppRole;
  setRole: (role: AppRole) => void;
  roleLabels: Record<AppRole, { name: string; icon: string; badge: string; desc: string }>;
}

const roleLabels: Record<AppRole, { name: string; icon: string; badge: string; desc: string }> = {
  admin: { name: 'Dono / Diretor', icon: '👑', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', desc: 'Acesso total: DRE, financeiro, turmas, alunos e gestão' },
  secretary: { name: 'Secretaria', icon: '📋', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30', desc: 'Matrículas, cobranças, turmas e contratos' },
  coach: { name: 'Professor / Treinador', icon: '⚽', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', desc: 'Chamada em campo, treinos e avaliação técnica' },
  guardian_portal: { name: 'Portal dos Pais / Responsável', icon: '👨‍👩‍👧', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30', desc: 'Acompanhamento do atleta, estrelas e mensalidade' },
};

const RoleContext = createContext<RoleContextType>({
  currentRole: 'admin',
  setRole: () => {},
  roleLabels,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<AppRole>('admin');

  useEffect(() => {
    const saved = localStorage.getItem('escolinha_active_role') as AppRole;
    if (saved && roleLabels[saved]) {
      setCurrentRole(saved);
    }
  }, []);

  const handleSetRole = (role: AppRole) => {
    setCurrentRole(role);
    localStorage.setItem('escolinha_active_role', role);
  };

  return (
    <RoleContext.Provider value={{ currentRole, setRole: handleSetRole, roleLabels }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useAppRole() {
  return useContext(RoleContext);
}
