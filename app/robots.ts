import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/gremio-concordia', '/torneios', '/privacidade', '/termos'],
        disallow: ['/configuracoes', '/financeiro'],
      },
    ],
    sitemap: 'https://escolinha-fut.vercel.app/sitemap.xml',
  };
}
