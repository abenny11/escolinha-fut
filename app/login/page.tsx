'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Lock, LogIn, Mail, Phone, User, UserPlus } from 'lucide-react';
import { useAppRole } from '@/contexts/RoleContext';
import { registrarPreCadastro } from '@/lib/cadastros-responsaveis';
import { autenticarUsuarioSistema } from '@/lib/usuarios-acesso';
import type { AppRole } from '@/lib/types';

const HOME_BY_ROLE: Record<AppRole, string> = {
  admin: '/dashboard',
  secretary: '/alunos',
  coach: '/turmas',
  guardian_portal: '/portal-pais',
};

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAppRole();
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar');

  // Login automático por e-mail, telefone ou usuário + senha
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // Pré-cadastro simples de responsável
  const [respNome, setRespNome] = useState('');
  const [respTel, setRespTel] = useState('');
  const [respEmail, setRespEmail] = useState('');
  const [respSenha, setRespSenha] = useState('');
  const [criancaNome, setCriancaNome] = useState('');
  const [criancaIdade, setCriancaIdade] = useState('10');
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

  function entrar() {
    setErro('');
    const auth = autenticarUsuarioSistema(identificador, senha);
    if (!auth.ok || !auth.role) {
      return setErro(auth.erro || 'Não foi possível entrar.');
    }

    setRole(auth.role);
    try {
      localStorage.setItem(
        'escolinha_auth_user_v1',
        JSON.stringify({
          email: auth.email || identificador.trim(),
          nome: auth.nome,
          role: auth.role,
          cadastroId: auth.cadastroId,
          loggedAt: new Date().toISOString(),
        }),
      );
    } catch {
      // ignore
    }
    router.push(HOME_BY_ROLE[auth.role]);
  }

  function enviarPreCadastro(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    if (respNome.trim().length < 2 || criancaNome.trim().length < 2) {
      return setErro('Preencha o nome do responsável e o nome da criança.');
    }
    if (!respEmail.includes('@') || respSenha.length < 4) {
      return setErro('Informe um e-mail válido e uma senha com pelo menos 4 caracteres.');
    }
    const idade = Math.min(15, Math.max(4, Number(criancaIdade) || 10));
    const cat =
      idade <= 7 ? 'Sub-5 / Sub-7' : idade <= 9 ? 'Sub-9' : idade <= 11 ? 'Sub-11' : idade <= 13 ? 'Sub-13' : 'Sub-15';

    const res = registrarPreCadastro({
      responsavelNome: respNome,
      responsavelTelefone: respTel,
      responsavelEmail: respEmail,
      senha: respSenha,
      criancaNome,
      criancaIdade: idade,
      categoria: cat,
    });

    if (!res.ok) {
      return setErro(res.erro || 'Erro ao enviar pré-cadastro.');
    }
    setCadastroSucesso(true);
  }

  return (
    <div className="min-h-screen bg-[#050912] text-white flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,159,227,0.28),_transparent_55%)]" />

      <div className="relative w-full max-w-md space-y-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-[#38bdf8] transition"
        >
          <ArrowLeft className="size-4" /> Voltar para o site Grêmio Concórdia
        </Link>

        <div className="rounded-3xl border border-white/15 bg-[#0b1324]/95 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gremio-concordia-logo.svg"
              alt="Logo Escola de Futebol Grêmio Concórdia"
              className="size-12 rounded-xl ring-2 ring-white/20 bg-[#050912]"
            />
            <div>
              <h1 className="text-xl font-black text-white leading-tight">Escola de Futebol Grêmio Concórdia</h1>
              <p className="text-xs text-[#7dd3fc]">Acesso ao Sistema &amp; Portal dos Pais</p>
            </div>
          </div>

          {/* Abas Entrar / Pré-Cadastro Responsável */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-900 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setModo('entrar');
                setErro('');
                setCadastroSucesso(false);
              }}
              className={`rounded-lg py-2 transition ${modo === 'entrar' ? 'bg-[#009fe3] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Já tenho acesso
            </button>
            <button
              type="button"
              onClick={() => {
                setModo('cadastrar');
                setErro('');
              }}
              className={`rounded-lg py-2 transition ${modo === 'cadastrar' ? 'bg-[#009fe3] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Cadastro Responsável
            </button>
          </div>

          {erro && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-xs font-semibold text-red-300">
              {erro}
            </div>
          )}

          {modo === 'entrar' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                entrar();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  E-mail, Telefone ou Usuário
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 size-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                    placeholder="seu@email.com, (49) 99999-9999 ou usuário"
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
                    placeholder="Digite sua senha"
                    className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-3 text-sm text-white outline-none focus:border-[#009fe3]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl border-b-4 border-[#006fa1] bg-[#009fe3] py-3 text-sm font-bold text-white hover:bg-[#008ecc] transition"
              >
                <LogIn className="size-4" /> Entrar
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Seu perfil de acesso é identificado automaticamente pelo seu login.
              </p>
            </form>
          ) : cadastroSucesso ? (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center space-y-3">
              <CheckCircle2 className="size-10 text-emerald-400 mx-auto" />
              <h2 className="text-base font-bold text-white">Pré-Cadastro Enviado!</h2>
              <p className="text-xs text-slate-200 leading-relaxed">
                Seu cadastro foi enviado para a diretoria da <strong>Escola de Futebol Grêmio Concórdia</strong>.
                Assim que o dono aprovar, você poderá entrar com seu e-mail e senha para <strong>completar os dados da criança</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setModo('entrar');
                  setIdentificador(respEmail);
                  setCadastroSucesso(false);
                }}
                className="rounded-xl bg-[#009fe3] px-4 py-2 text-xs font-bold text-white"
              >
                Ir para Login
              </button>
            </div>
          ) : (
            <form onSubmit={enviarPreCadastro} className="space-y-3">
              <p className="text-xs text-slate-300">
                Preencha seus dados básicos. Após a aprovação do dono da escolinha, você poderá completar a ficha completa do atleta.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Responsável *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 size-4 text-slate-400" />
                  <input
                    required
                    value={respNome}
                    onChange={(e) => setRespNome(e.target.value)}
                    placeholder="Nome do pai, mãe ou responsável"
                    className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-3 text-sm text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 size-4 text-slate-400" />
                    <input
                      required
                      value={respTel}
                      onChange={(e) => setRespTel(e.target.value)}
                      placeholder="(49) 99999-9999"
                      className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-2 text-sm text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Idade da Criança *</label>
                  <input
                    type="number"
                    min={4}
                    max={15}
                    required
                    value={criancaIdade}
                    onChange={(e) => setCriancaIdade(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nome Completo da Criança *</label>
                <input
                  required
                  value={criancaNome}
                  onChange={(e) => setCriancaNome(e.target.value)}
                  placeholder="Nome do aluno / atleta"
                  className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">E-mail de Acesso *</label>
                <input
                  type="email"
                  required
                  value={respEmail}
                  onChange={(e) => setRespEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Crie uma Senha *</label>
                <input
                  type="password"
                  required
                  value={respSenha}
                  onChange={(e) => setRespSenha(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl border-b-4 border-[#006fa1] bg-[#009fe3] py-3 text-sm font-bold text-white hover:bg-[#008ecc] transition"
              >
                <UserPlus className="size-4" /> Enviar Pré-Cadastro para Aprovação
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
