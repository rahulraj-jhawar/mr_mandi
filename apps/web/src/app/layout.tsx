import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mr. Mandi // Source verified construction labour on a beautiful map of India.',
  description:
    'Find verified labour brokers to source skilled, semi-skilled & unskilled construction workers — on a beautiful map of India. 1,200+ verified brokers. Predicted labour flows updated weekly. Filter by trade & skill level. Day-rate ranges, ratings & worker pools. Connect builders with the right sourcing partners.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
