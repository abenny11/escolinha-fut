import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://escolinha-fut.vercel.app';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/gremio-concordia`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/torneios`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/alunos`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/turmas`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/privacidade`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/termos`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
