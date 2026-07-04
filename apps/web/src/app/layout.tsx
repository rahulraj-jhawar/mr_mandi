import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import AppNav from '../components/AppNav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = 'https://mistrimandi.com';
const SITE_NAME = 'Mistri Mandi';
const DESCRIPTION =
  'Mistri Mandi connects construction builders with verified labour brokers (thekedars) across India. Explore Labour Chowk — a live map of vetted labour sourcing partners with ratings, reviews, worker pools and predicted seasonal labour flows.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mistri Mandi — Source verified construction labour across India',
    template: '%s · Mistri Mandi',
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  category: 'business',
  keywords: [
    'labour chowk',
    'mistri mandi',
    'labour brokers India',
    'construction labour sourcing',
    'thekedar',
    'mazdoor',
    'contractor labour',
    'construction workers India',
    'skilled labour supply',
    'labour contractor near me',
    'mason carpenter bar bender supply',
    'inter-state migrant labour',
    'labour on demand construction',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
    url: SITE_URL,
    title: 'Mistri Mandi — Source verified construction labour across India',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mistri Mandi — verified construction labour, on a map',
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  // GEO / local targeting
  other: {
    'geo.region': 'IN',
    'geo.placename': 'India',
    'geo.position': '22.5937;78.9629',
    ICBM: '22.5937, 78.9629',
    'distribution': 'global',
    'coverage': 'India',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

// Structured data for search + generative engines.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: SITE_NAME,
      url: SITE_URL,
      description: DESCRIPTION,
      areaServed: { '@type': 'Country', name: 'India' },
      knowsAbout: [
        'construction labour sourcing',
        'labour brokers',
        'inter-state migrant labour',
        'seasonal labour flows',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { '@id': `${SITE_URL}/#org` },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'Service',
      name: 'Labour Chowk — verified labour broker sourcing',
      serviceType: 'Construction labour sourcing',
      provider: { '@id': `${SITE_URL}/#org` },
      areaServed: { '@type': 'Country', name: 'India' },
      description:
        'A live map of verified labour brokers across India for builders to source skilled, semi-skilled and unskilled construction workers, with ratings, reviews and sourcing metrics.',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <AppNav />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </body>
    </html>
  );
}
