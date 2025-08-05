"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Determine effective theme (avoid hydration mismatch)
  const effective = mounted ? (theme === "system" ? systemTheme : theme) : undefined;
  const isDark = effective === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: "var(--bg)",
        color: "var(--fg)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 18,
          height: 18,
          display: "inline-block",
          borderRadius: "50%",
          background: isDark ? "#fde68a" : "#111827",
          boxShadow: isDark ? "0 0 10px rgba(253, 230, 138, 0.7)" : "none",
          transition: "all 0.2s ease",
        }}
      />
      <span style={{ fontSize: 12 }}>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
