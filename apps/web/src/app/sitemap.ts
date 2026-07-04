import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mistrimandi.com';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/labour-chowk`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/insights`, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
