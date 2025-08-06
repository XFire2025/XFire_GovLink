// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers'; // Import the new provider

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}