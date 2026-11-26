import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { CookieBanner } from '@/components/CookieBanner';
import { AnalyticsScript } from '@/components/AnalyticsScript';
import { PwaInstaller } from '@/components/PwaInstaller';
import { RoleProvider } from '@/contexts/RoleContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#050912',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://escolinha-fut.vercel.app'),
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Grêmio Concórdia',
  },
  icons: {
    icon: [
      { url: '/icones/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icones/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icones/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  title: {
    default: 'Escola de Futebol Grêmio Concórdia — Gestão, Torneios & Súmulas',
    template: '%s | Grêmio Concórdia',
  },
  description:
    'Sistema completo da Escola de Futebol Grêmio Concórdia (Unidade Conveniada Grêmio FBPA em Concórdia-SC): gestão de alunos, torneios, marcação ao vivo e súmula oficial.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://escolinha-fut.vercel.app',
    siteName: 'Escola de Futebol Grêmio Concórdia',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-slate-900 text-slate-100 min-h-screen antialiased`}>
        <ThemeProvider>
          <RoleProvider>
            <AppShell>{children}</AppShell>
            <PwaInstaller />
            <CookieBanner />
            <AnalyticsScript />
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
