// app/layout.tsx
import type { Metadata } from 'next';
// Import multiple font options for better compatibility
import { Inter, Noto_Sans_Sinhala, Noto_Sans_Tamil } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

// Configure Inter for Latin characters (better web compatibility than Noto Sans)
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

// Configure Noto Sans Sinhala with extended character support
const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sinhala',
  display: 'swap',
  // Add font-feature-settings for better Sinhala rendering
  adjustFontFallback: false,
});

// Configure Noto Sans Tamil
const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-tamil',
  display: 'swap',
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
    <html lang="si" suppressHydrationWarning>
      <head>
        {/* Preload fonts for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Additional Sinhala font fallbacks for Figma compatibility */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Add Iskoola Pota as fallback for better local support */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Sinhala Fallback';
              src: local('Iskoola Pota'), local('Noto Sans Sinhala'), local('DL-Expresso');
              font-display: swap;
            }
          `
        }} />
      </head>
      <body
        className={`${inter.variable} ${notoSansSinhala.variable} ${notoSansTamil.variable} antialiased`}
        style={{
          fontFeatureSettings: '"liga" 1, "calt" 1, "kern" 1',
          fontVariantLigatures: 'common-ligatures',
          textRendering: 'optimizeLegibility',
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}