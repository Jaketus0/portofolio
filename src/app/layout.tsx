import type { Metadata } from 'next';
import { Press_Start_2P, VT323 } from 'next/font/google';
import './globals.css';
import { Providers } from '../providers';

// Pixel fonts are kept loaded so the Admin panel / auth screens keep their styling.
const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'VIA — Software Engineer',
    template: '%s | VIA',
  },
  description:
    'Portfolio of VIA — a professional software engineer focused on clean, calm, and durable digital products.',
  keywords: [
    'software engineer',
    'full stack',
    'portfolio',
    'via',
    'next.js',
    'react',
    'developer',
  ],
  openGraph: {
    title: 'VIA — Software Engineer',
    description:
      'Portfolio of VIA — a professional software engineer focused on clean, calm, and durable digital products.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart.variable} ${vt323.variable}`}>
      <body className="min-h-screen overflow-x-hidden antialiased selection:bg-primary/30 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
