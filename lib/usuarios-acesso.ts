import type { AppRole } from './types';
import { autenticarResponsavel } from './cadastros-responsaveis';
import { createClient, isSupabaseConfigured } from './supabase/client';

export interface UsuarioAcesso {
  id: string;
  nome: string;
  usuario: string;
  email: string;
  telefone: string;
  senha: string;
  perfil: AppRole;
  ativo: boolean;
  criadoEm: string;
}

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Dono / Administrador',
  secretary: 'Secretaria',
  coach: 'Professor / Técnico',
  guardian_portal: 'Pais / Responsável',
};

const STORAGE_KEY = 'gremio_concordia_usuarios_acesso_v1';

export const SEED_USUARIOS_ACESSO: UsuarioAcesso[] = [
  {
    id: 'usr-admin-1',
    nome: 'Diretoria Grêmio Concórdia',
    usuario: 'diretoria',
    email: 'diretoria@gremioconcordia.com.br',
    telefone: '(49) 98896-8754',
    senha: '123456',
    perfil: 'admin',
    ativo: true,
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'usr-sec-1',
    nome: 'Secretaria da Escolinha',
    usuario: 'secretaria',
    email: 'secretaria@gremioconcordia.com.br',
    telefone: '(49) 98896-0001',
    senha: '123456',
    perfil: 'secretary',
    ativo: true,
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'usr-coach-1',
    nome: 'Professor / Técnico',
    usuario: 'professor',
    email: 'professor@gremioconcordia.com.br',
    telefone: '(49) 98896-0002',
    senha: '123456',
    perfil: 'coach',
    ativo: true,
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'usr-resp-1',
    nome: 'Carlos Henrique Souza',
    usuario: 'carlos',
    email: 'responsavel@gremioconcordia.com.br',
    telefone: '(49) 99988-7766',
    senha: '123456',
    perfil: 'guardian_portal',
    ativo: true,
    criadoEm: new Date().toISOString(),
  },
];

function onlyDigits(val: string): string {
  return val.replace(/\D/g, '');
}

async function syncUsuariosAcessoToSupabase(lista: UsuarioAcesso[]) {
  if (!isSupabaseConfigured() || typeof window === 'undefined') return;
  try {
    const supabase = createClient();
    await supabase.from('fut_configuracoes').upsert(
      {
        chave: 'usuarios_acesso',
        valor: lista,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'chave' },
    );
  } catch {
    // fallback silencioso
  }
}

export function loadUsuariosAcesso(): UsuarioAcesso[] {
  if (typeof window === 'undefined') return SEED_USUARIOS_ACESSO;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  saveUsuariosAcesso(SEED_USUARIOS_ACESSO);
  return SEED_USUARIOS_ACESSO;
}

export function saveUsuariosAcesso(lista: UsuarioAcesso[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch {
    // ignore
  }
  void syncUsuariosAcessoToSupabase(lista);
}

export function autenticarUsuarioSistema(
  identificador: string,
  senha: string,
): {
  ok: boolean;
  role?: AppRole;
  email?: string;
  nome?: string;
  cadastroId?: string;
  erro?: string;
} {
  const idTrim = identificador.trim();
  const idLower = idTrim.toLowerCase();
  const idDigits = onlyDigits(idTrim);

  if (!idTrim) {
    return { ok: false, erro: 'Informe seu e-mail, telefone ou nome de usuário.' };
  }
  if (!senha || senha.length < 4) {
    return { ok: false, erro: 'Informe a senha de acesso (mínimo 4 caracteres).' };
  }

  const usuarios = loadUsuariosAcesso();
  const foundUser = usuarios.find((u) => {
    const uDigits = onlyDigits(u.telefone);
    const matchPhone = idDigits.length >= 8 && uDigits.length >= 8 && uDigits.endsWith(idDigits.slice(-8));
    return (
      u.email.toLowerCase() === idLower ||
      u.usuario.toLowerCase() === idLower ||
      u.nome.toLowerCase() === idLower ||
      matchPhone
    );
  });

  if (foundUser) {
    if (!foundUser.ativo) {
      return { ok: false, erro: 'Este usuário está desativado. Fale com a diretoria.' };
    }
    if (foundUser.senha !== senha) {
      return { ok: false, erro: 'Senha incorreta.' };
    }
    return {
      ok: true,
      role: foundUser.perfil,
      email: foundUser.email,
      nome: foundUser.nome,
    };
  }

  // Fallback para responsáveis cadastrados pelo formulário de pré-cadastro
  const respAuth = autenticarResponsavel(idTrim, senha);
  if (respAuth.ok && respAuth.cadastro) {
    return {
      ok: true,
      role: 'guardian_portal',
      email: respAuth.cadastro.responsavelEmail,
      nome: respAuth.cadastro.responsavelNome,
      cadastroId: respAuth.cadastro.id,
    };
  }

  if (respAuth.status === 'pendente' || respAuth.status === 'recusado' || respAuth.erro === 'Senha incorreta.') {
    return { ok: false, erro: respAuth.erro };
  }

  return { ok: false, erro: 'Usuário, e-mail ou telefone não encontrado.' };
}
