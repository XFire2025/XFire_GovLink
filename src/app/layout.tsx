// app/layout.tsx
import type { Metadata } from 'next';
// 1. Import all three font packages
import { Noto_Sans, Noto_Sans_Sinhala, Noto_Sans_Tamil } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

// 2. Configure Noto Sans for Latin characters (English)
const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans', // Define CSS Variable
});

// 3. Configure Noto Sans for Sinhala characters
const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sinhala', // Define CSS Variable
});

// 4. Configure Noto Sans for Tamil characters
const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-tamil', // Define CSS Variable
});

export const metadata: Metadata = {
  title: 'GovLink Sri Lanka',
  description: 'Simplifying Government for Every Sri Lankan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 5. Combine all font variables into the className */}
      <body
        className={`${notoSans.variable} ${notoSansSinhala.variable} ${notoSansTamil.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}