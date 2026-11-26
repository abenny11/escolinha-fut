'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function instalar() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const res = await deferredPrompt.userChoice;
    if (res.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }

  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2 rounded-2xl border border-[#009fe3]/50 bg-[#050912]/95 px-3.5 py-2.5 text-white shadow-2xl backdrop-blur">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icones/icon-192.png" alt="App Grêmio Concórdia" className="size-8 rounded-lg" />
      <div className="text-xs">
        <p className="font-bold leading-tight">App Grêmio Concórdia</p>
        <p className="text-[10px] text-slate-300">Instale sem barra do navegador</p>
      </div>
      <button
        type="button"
        onClick={instalar}
        className="ml-1 inline-flex items-center gap-1 rounded-lg bg-[#009fe3] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#0086c3]"
      >
        <Download className="size-3.5" /> Instalar
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="p-1 text-slate-400 hover:text-white"
        aria-label="Fechar aviso de instalação"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
