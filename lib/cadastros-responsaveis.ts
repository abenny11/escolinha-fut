import { syncCadastrosToSupabase } from './supabase/sync';

export type StatusCadastro = 'pendente' | 'aprovado' | 'recusado';

export interface FichaCompletaCrianca {
  dataNascimento: string;
  cpf?: string;
  rg?: string;
  genero: string;
  posicao: string;
  peDominante: string;
  tamanhoUniforme: string;
  alergiasMedicamentos?: string;
  contatoEmergencia: string;
  telefoneEmergencia: string;
  endereco: string;
  autorizacaoImagem: boolean;
  preenchidaEm: string;
}

export interface CadastroResponsavel {
  id: string;
  responsavelNome: string;
  responsavelTelefone: string;
  responsavelEmail: string;
  senha: string;
  criancaNome: string;
  criancaIdade: number;
  categoria: string;
  status: StatusCadastro;
  criadoEm: string;
  aprovadoEm?: string;
  fichaCompleta?: FichaCompletaCrianca;
}

const STORAGE_KEY = 'gremio_concordia_cadastros_resp_v1';

const SEED_CADASTROS: CadastroResponsavel[] = [
  {
    id: 'cad-pendente-1',
    responsavelNome: 'Ana Paula Mendes',
    responsavelTelefone: '(49) 99123-4567',
    responsavelEmail: 'anapaula@exemplo.com',
    senha: '123456',
    criancaNome: 'Arthur Mendes',
    criancaIdade: 9,
    categoria: 'Sub-9',
    status: 'pendente',
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'cad-aprovado-1',
    responsavelNome: 'Carlos Henrique Souza',
    responsavelTelefone: '(49) 99988-7766',
    responsavelEmail: 'responsavel@gremioconcordia.com.br',
    senha: '123456',
    criancaNome: 'Lucas Gabriel Souza',
    criancaIdade: 11,
    categoria: 'Sub-11',
    status: 'aprovado',
    criadoEm: new Date(Date.now() - 86400000 * 2).toISOString(),
    aprovadoEm: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function loadCadastrosResponsaveis(): CadastroResponsavel[] {
  if (typeof window === 'undefined') return SEED_CADASTROS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  saveCadastrosResponsaveis(SEED_CADASTROS);
  return SEED_CADASTROS;
}

export function saveCadastrosResponsaveis(lista: CadastroResponsavel[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch {
    // ignore
  }
  void syncCadastrosToSupabase(lista);
}

export function registrarPreCadastro(dados: {
  responsavelNome: string;
  responsavelTelefone: string;
  responsavelEmail: string;
  senha: string;
  criancaNome: string;
  criancaIdade: number;
  categoria: string;
}): { ok: boolean; erro?: string; cadastro?: CadastroResponsavel } {
  const lista = loadCadastrosResponsaveis();
  const emailNorm = dados.responsavelEmail.trim().toLowerCase();
  if (lista.some((c) => c.responsavelEmail.toLowerCase() === emailNorm)) {
    return { ok: false, erro: 'Já existe um cadastro com este e-mail.' };
  }
  const novo: CadastroResponsavel = {
    id: `cad-${Date.now().toString(36)}`,
    responsavelNome: dados.responsavelNome.trim(),
    responsavelTelefone: dados.responsavelTelefone.trim(),
    responsavelEmail: emailNorm,
    senha: dados.senha,
    criancaNome: dados.criancaNome.trim(),
    criancaIdade: dados.criancaIdade,
    categoria: dados.categoria,
    status: 'pendente',
    criadoEm: new Date().toISOString(),
  };
  saveCadastrosResponsaveis([novo, ...lista]);
  return { ok: true, cadastro: novo };
}

export function atualizarStatusCadastro(id: string, status: StatusCadastro): CadastroResponsavel[] {
  const lista = loadCadastrosResponsaveis().map((c) =>
    c.id === id
      ? {
          ...c,
          status,
          aprovadoEm: status === 'aprovado' ? new Date().toISOString() : c.aprovadoEm,
        }
      : c,
  );
  saveCadastrosResponsaveis(lista);
  return lista;
}

export function salvarFichaCompletaCrianca(
  cadastroId: string,
  ficha: Omit<FichaCompletaCrianca, 'preenchidaEm'>,
): CadastroResponsavel[] {
  const lista = loadCadastrosResponsaveis().map((c) =>
    c.id === cadastroId
      ? {
          ...c,
          fichaCompleta: { ...ficha, preenchidaEm: new Date().toISOString() },
        }
      : c,
  );
  saveCadastrosResponsaveis(lista);
  return lista;
}

export function autenticarResponsavel(
  email: string,
  senha: string,
): { ok: boolean; status?: StatusCadastro; cadastro?: CadastroResponsavel; erro?: string } {
  const emailNorm = email.trim().toLowerCase();
  const lista = loadCadastrosResponsaveis();
  const found = lista.find((c) => c.responsavelEmail.toLowerCase() === emailNorm);
  if (!found) {
    return { ok: false, erro: 'E-mail não encontrado. Faça seu pré-cadastro primeiro.' };
  }
  if (found.senha !== senha) {
    return { ok: false, erro: 'Senha incorreta.' };
  }
  if (found.status === 'pendente') {
    return {
      ok: false,
      status: 'pendente',
      erro: 'Seu cadastro ainda está aguardando aprovação do dono/direção da escolinha.',
    };
  }
  if (found.status === 'recusado') {
    return {
      ok: false,
      status: 'recusado',
      erro: 'Cadastro não aprovado. Entre em contato pelo WhatsApp (49) 98896-8754.',
    };
  }
  return { ok: true, status: 'aprovado', cadastro: found };
}
