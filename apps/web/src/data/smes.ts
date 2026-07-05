import fs from 'fs';
import path from 'path';

export type SmePartner = {
  id: string;
  name: string;
  logo: string;
};

// Approved builder / SME partners only — no third-party brands.
export const SME_PARTNERS: SmePartner[] = [
  { id: 'bits-ssms', name: 'Bits SSMS', logo: '/sme-logos/bits-ssms.svg' },
  { id: 'aditya-food-fsp', name: 'Aditya Food FSP', logo: '/sme-logos/aditya-food-fsp.png' },
  { id: 'rupa-builders', name: 'Rupa Builders', logo: '/sme-logos/rupa-builders.svg' },
  { id: 'shelton-builders', name: 'Shelton Builders', logo: '/sme-logos/shelton-builders.png' },
  { id: 'ezee', name: 'Ezee', logo: '/sme-logos/ezee.svg' },
  { id: 'frostar-agric', name: 'Frostar Agric', logo: '/sme-logos/frostar-agric.svg' },
  { id: 'heuristic-infra', name: 'Heuristic Infra', logo: '/sme-logos/heuristic-infra.svg' },
  // { id: 'bk-consultants', name: 'B&K Consultants', logo: '/sme-logos/bk-consultants.svg' },
  { id: 'native-sutra', name: 'Native Sutra', logo: '/sme-logos/native-sutra.webp' },
  { id: 'gravita', name: 'Gravita', logo: '/sme-logos/gravita.webp' },
  { id: 'sattva', name: 'Sattva', logo: '/sme-logos/sattva.png' },
  { id: 'kisaan-bahadur', name: 'Kisaan Bahadur', logo: '/sme-logos/kisaan-bahadur.png' },
  { id: 'shanti-greentech', name: 'Shanti Greentech', logo: '/sme-logos/shanti-greentech.svg' },
  { id: 'deema-tea-estate', name: 'Deema Tea Estate', logo: '/sme-logos/deema-tea-estate.svg' },
  { id: 'sr-money-grow', name: 'SR Money Grow', logo: '/sme-logos/sr-money-grow.svg' },
  { id: 'sr-builders', name: 'SR Builders', logo: '/sme-logos/sr-builders.svg' },
  // { id: 'faith-builders', name: 'Faith Builders & Realty', logo: '/sme-logos/faith-builders.svg' },
  { id: 'primus', name: 'Primus', logo: '/sme-logos/primus.jpg' },
  { id: 'rashtriya-metal', name: 'Rashtriya Metal', logo: '/sme-logos/rashtriya-metal.svg' },
  { id: 'protech', name: 'Protech', logo: '/sme-logos/protech.jpeg' },
];

/** Only partners whose logo file exists under /public (skip missing assets). */
export function getAvailableSmePartners(): SmePartner[] {
  return SME_PARTNERS.filter((sme) => {
    const rel = sme.logo.replace(/^\//, '');
    return fs.existsSync(path.join(process.cwd(), 'public', rel));
  });
}
