'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, LogIn, Mail, ShieldCheck } from 'lucide-react';
import { useAppRole } from '@/contexts/RoleContext';
import type { AppRole } from '@/lib/types';

const HOME_BY_ROLE: Record<AppRole, string> = {
  admin: '/',
  secretary: '/alunos',
  coach: '/turmas',
  guardian_portal: '/portal-pais',
};

const DEMO_ACCOUNTS: { role: AppRole; email: string; label: string; desc: string }[] = [
  { role: 'admin', email: 'diretoria@gremioconcordia.com.br', label: 'Dono / Diretor', desc: 'Acesso total ao sistema' },
  { role: 'secretary', email: 'secretaria@gremioconcordia.com.br', label: 'Secretaria', desc: 'Alunos, matrículas, caixa e torneios' },
  { role: 'coach', email: 'professor@gremioconcordia.com.br', label: 'Professor / Técnico', desc: 'Chamada, treinos e marcação ao vivo' },
  { role: 'guardian_portal', email: 'responsavel@gremioconcordia.com.br', label: 'Pais / Responsável', desc: 'Portal do atleta, notas e torneios' },
];

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAppRole();
  const [email, setEmail] = useState('diretoria@gremioconcordia.com.br');
  const [senha, setSenha] = useState('123456');
  const [perfil, setPerfil] = useState<AppRole>('admin');
  const [erro, setErro] = useState('');

  function entrar(targetRole: AppRole, targetEmail: string) {
    setErro('');
    if (!targetEmail.trim() || !targetEmail.includes('@')) {
      return setErro('Informe um e-mail válido.');
    }
    if (senha.length < 4) {
      return setErro('Informe a senha de acesso (mínimo 4 caracteres).');
    }

    setRole(targetRole);
    try {
      localStorage.setItem(
        'escolinha_auth_user_v1',
        JSON.stringify({ email: targetEmail.trim(), role: targetRole, loggedAt: new Date().toISOString() }),
      );
    } catch {
      // ignore
    }
    router.push(HOME_BY_ROLE[targetRole]);
  }

  return (
    <div className="min-h-screen bg-[#050912] text-white flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,159,227,0.28),_transparent_55%)]" />

      <div className="relative w-full max-w-md space-y-6">
        <Link
          href="/gremio-concordia"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-[#38bdf8] transition"
        >
          <ArrowLeft className="size-4" /> Voltar para o site Grêmio Concórdia
        </Link>

        <div className="rounded-3xl border border-white/15 bg-[#0b1324]/95 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gremio-concordia-logo.svg"
              alt="Logo Escola de Futebol Grêmio Concórdia"
              className="size-12 rounded-xl ring-2 ring-white/20 bg-[#050912]"
            />
            <div>
              <h1 className="text-xl font-black text-white leading-tight">Acesso ao Sistema</h1>
              <p className="text-xs text-[#7dd3fc]">Escola de Futebol Grêmio Concórdia</p>
            </div>
          </div>

          {erro && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300">
              {erro}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              entrar(perfil, email);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Perfil de Acesso</label>
              <select
                value={perfil}
                onChange={(e) => {
                  const r = e.target.value as AppRole;
                  setPerfil(r);
                  const found = DEMO_ACCOUNTS.find((a) => a.role === r);
                  if (found) setEmail(found.email);
                }}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none focus:border-[#009fe3]"
              >
                {DEMO_ACCOUNTS.map((a) => (
                  <option key={a.role} value={a.role}>
                    {a.label} — {a.desc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 size-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-3 text-sm text-white outline-none focus:border-[#009fe3]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 size-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-3 text-sm text-white outline-none focus:border-[#009fe3]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl border-b-4 border-[#006fa1] bg-[#009fe3] py-3 text-sm font-bold text-white hover:bg-[#008ecc] transition"
            >
              <LogIn className="size-4" /> Entrar no Painel
            </button>
          </form>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#38bdf8]" /> Acesso Rápido por Perfil (Demo)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => entrar(acc.role, acc.email)}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-left hover:border-[#009fe3] transition"
                >
                  <span className="block text-xs font-bold text-white">{acc.label}</span>
                  <span className="block text-[10px] text-slate-400 truncate">{acc.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
