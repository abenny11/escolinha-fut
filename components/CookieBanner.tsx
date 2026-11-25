'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

const COOKIE_KEY = 'gremio_concordia_cookie_consent_v1';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) {
        setVisible(true);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!visible) return null;

  function responder(aceito: boolean) {
    try {
      localStorage.setItem(COOKIE_KEY, aceito ? 'accepted' : 'essential');
    } catch {
      // ignore
    }
    setVisible(false);
  }

  return (
    <div className="fixed bottom-16 md:bottom-4 right-4 left-4 md:left-auto md:max-w-md z-50 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-slate-100 shadow-2xl">
      <div className="flex items-start gap-3">
        <Cookie className="size-5 text-[#009fe3] shrink-0 mt-0.5" />
        <div className="space-y-2 text-xs">
          <p className="font-bold text-sm text-white">Privacidade &amp; Cookies</p>
          <p className="text-slate-300 leading-relaxed">
            Utilizamos cookies essenciais e métricas de acesso para melhorar sua experiência. Leia nossa{' '}
            <Link href="/privacidade" className="text-[#38bdf8] underline">Política de Privacidade</Link> e{' '}
            <Link href="/termos" className="text-[#38bdf8] underline">Termos de Uso</Link>.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => responder(true)}
              className="rounded-lg bg-[#009fe3] px-3 py-1.5 font-bold text-white hover:bg-[#0086c3] transition"
            >
              Aceitar Todos
            </button>
            <button
              type="button"
              onClick={() => responder(false)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-semibold text-slate-300 hover:text-white transition"
            >
              Apenas Essenciais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
