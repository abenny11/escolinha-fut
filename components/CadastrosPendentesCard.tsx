'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, FileCheck2, UserCheck, XCircle } from 'lucide-react';
import {
  atualizarStatusCadastro,
  loadCadastrosResponsaveis,
  type CadastroResponsavel,
} from '@/lib/cadastros-responsaveis';

export function CadastrosPendentesCard() {
  const [lista, setLista] = useState<CadastroResponsavel[]>([]);

  useEffect(() => {
    setLista(loadCadastrosResponsaveis());
  }, []);

  const pendentes = lista.filter((c) => c.status === 'pendente');
  const aprovados = lista.filter((c) => c.status === 'aprovado');

  if (lista.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="size-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white">
              Pré-Cadastros de Responsáveis ({pendentes.length} pendente{pendentes.length === 1 ? '' : 's'})
            </h2>
            <p className="text-xs text-slate-400">
              Após sua aprovação, o responsável acessa o Portal dos Pais para preencher a ficha completa da criança.
            </p>
          </div>
        </div>
      </div>

      {pendentes.length > 0 && (
        <div className="space-y-2">
          {pendentes.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-amber-400" />
                  <span className="font-bold text-sm text-white">{c.criancaNome}</span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {c.criancaIdade} anos · {c.categoria}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Responsável: <strong className="text-slate-200">{c.responsavelNome}</strong> · {c.responsavelTelefone} · {c.responsavelEmail}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLista(atualizarStatusCadastro(c.id, 'aprovado'))}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:opacity-90"
                >
                  <CheckCircle2 className="size-3.5" /> Aprovar
                </button>
                <button
                  type="button"
                  onClick={() => setLista(atualizarStatusCadastro(c.id, 'recusado'))}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
                >
                  <XCircle className="size-3.5" /> Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {aprovados.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Responsáveis Aprovados ({aprovados.length})
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {aprovados.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{c.criancaNome} ({c.categoria})</p>
                  <p className="text-slate-400 truncate">Resp: {c.responsavelNome}</p>
                </div>
                {c.fichaCompleta ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 shrink-0">
                    <FileCheck2 className="size-3" /> Ficha Completa
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400 shrink-0">
                    Aguardando Ficha
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
