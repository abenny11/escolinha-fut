'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, ClipboardEdit, Save } from 'lucide-react';
import {
  loadCadastrosResponsaveis,
  salvarFichaCompletaCrianca,
  type CadastroResponsavel,
} from '@/lib/cadastros-responsaveis';

export function CompletarFichaCriancaCard() {
  const [cadastro, setCadastro] = useState<CadastroResponsavel | null>(null);
  const [aberto, setAberto] = useState(false);
  const [salvoMsg, setSalvoMsg] = useState('');

  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [genero, setGenero] = useState('Masculino');
  const [posicao, setPosicao] = useState('Meio-Campo');
  const [peDominante, setPeDominante] = useState('Destro');
  const [tamanhoUniforme, setTamanhoUniforme] = useState('Tam 10');
  const [alergias, setAlergias] = useState('');
  const [contatoEmergencia, setContatoEmergencia] = useState('');
  const [telefoneEmergencia, setTelefoneEmergencia] = useState('');
  const [endereco, setEndereco] = useState('');
  const [autorizacaoImagem, setAutorizacaoImagem] = useState(true);

  useEffect(() => {
    const lista = loadCadastrosResponsaveis();
    let alvo: CadastroResponsavel | undefined;
    try {
      const authRaw = localStorage.getItem('escolinha_auth_user_v1');
      if (authRaw) {
        const auth = JSON.parse(authRaw);
        if (auth.cadastroId) alvo = lista.find((c) => c.id === auth.cadastroId);
        if (!alvo && auth.email) alvo = lista.find((c) => c.responsavelEmail === auth.email);
      }
    } catch {
      // ignore
    }
    if (!alvo) alvo = lista.find((c) => c.status === 'aprovado');
    if (alvo) {
      setCadastro(alvo);
      if (alvo.fichaCompleta) {
        const f = alvo.fichaCompleta;
        setDataNascimento(f.dataNascimento);
        setCpf(f.cpf || '');
        setRg(f.rg || '');
        setGenero(f.genero);
        setPosicao(f.posicao);
        setPeDominante(f.peDominante);
        setTamanhoUniforme(f.tamanhoUniforme);
        setAlergias(f.alergiasMedicamentos || '');
        setContatoEmergencia(f.contatoEmergencia);
        setTelefoneEmergencia(f.telefoneEmergencia);
        setEndereco(f.endereco);
        setAutorizacaoImagem(f.autorizacaoImagem);
      } else {
        setContatoEmergencia(alvo.responsavelNome);
        setTelefoneEmergencia(alvo.responsavelTelefone);
        setAberto(true);
      }
    }
  }, []);

  if (!cadastro) return null;

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!cadastro) return;
    const next = salvarFichaCompletaCrianca(cadastro.id, {
      dataNascimento,
      cpf,
      rg,
      genero,
      posicao,
      peDominante,
      tamanhoUniforme,
      alergiasMedicamentos: alergias,
      contatoEmergencia,
      telefoneEmergencia,
      endereco,
      autorizacaoImagem,
    });
    const atualizado = next.find((c) => c.id === cadastro.id) || null;
    setCadastro(atualizado);
    setAberto(false);
    setSalvoMsg('Ficha completa da criança salva e enviada para a secretaria!');
    setTimeout(() => setSalvoMsg(''), 4000);
  }

  const inputCls =
    'w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none';

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-slate-950 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/15 p-2.5 text-emerald-400">
            <ClipboardEdit className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Cadastro da Criança: {cadastro.criancaNome} ({cadastro.categoria})
              </h2>
              {cadastro.fichaCompleta ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="size-3" /> Ficha Completa
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
                  Aprovado — Complete a Ficha
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Seu pré-cadastro foi aprovado! Preencha ou atualize abaixo os dados completos do atleta.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAberto(!aberto)}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:opacity-90"
        >
          {aberto ? 'Ocultar Formulário' : cadastro.fichaCompleta ? 'Editar Ficha Completa' : 'Completar Cadastro Agora'}
        </button>
      </div>

      {salvoMsg && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400">
          {salvoMsg}
        </div>
      )}

      {aberto && (
        <form onSubmit={salvar} className="grid sm:grid-cols-3 gap-3 border-t border-slate-800 pt-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Data de Nascimento *</label>
            <input type="date" required value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">CPF do Atleta (opcional)</label>
            <input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">RG (opcional)</label>
            <input value={rg} onChange={(e) => setRg(e.target.value)} placeholder="00.000.000-0" className={inputCls} />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Posição Preferida</label>
            <select value={posicao} onChange={(e) => setPosicao(e.target.value)} className={inputCls}>
              {['Goleiro', 'Zagueiro', 'Lateral', 'Meio-Campo', 'Atacante', 'Fixo', 'Ala', 'Pivô'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Pé Dominante</label>
            <select value={peDominante} onChange={(e) => setPeDominante(e.target.value)} className={inputCls}>
              <option value="Destro">Destro</option>
              <option value="Canhoto">Canhoto</option>
              <option value="Ambidestro">Ambidestro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Tamanho do Uniforme</label>
            <select value={tamanhoUniforme} onChange={(e) => setTamanhoUniforme(e.target.value)} className={inputCls}>
              {['Tam 6', 'Tam 8', 'Tam 10', 'Tam 12', 'Tam 14', 'P', 'M', 'G'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Contato de Emergência *</label>
            <input required value={contatoEmergencia} onChange={(e) => setContatoEmergencia(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Telefone de Emergência *</label>
            <input required value={telefoneEmergencia} onChange={(e) => setTelefoneEmergencia(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Alergias / Observações Médicas</label>
            <input value={alergias} onChange={(e) => setAlergias(e.target.value)} placeholder="Ex: Nenhuma ou descrever" className={inputCls} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-400 mb-1">Endereço Residencial Completo *</label>
            <input required value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, número, bairro, Concórdia - SC" className={inputCls} />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autorizacaoImagem}
                onChange={(e) => setAutorizacaoImagem(e.target.checked)}
                className="accent-emerald-500"
              />
              Autorizo uso de imagem em fotos da escolinha
            </label>
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:opacity-90"
            >
              <Save className="size-4" /> Salvar Ficha Completa da Criança
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
