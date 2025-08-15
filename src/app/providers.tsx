// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { TranslationProvider } from "@/components/TranslationProvider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "@/lib/i18n/config"; // Initialize i18n

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TranslationProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}