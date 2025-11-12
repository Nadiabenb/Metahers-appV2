import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply dark mode class to document root (dark mode only)
    document.documentElement.classList.add("dark");
  }, []);

  return <>{children}</>;
}

// Stub export for backward compatibility (dark mode only)
export function useTheme() {
  return {
    theme: "dark" as const,
    toggleTheme: () => {
      // No-op: dark mode only
    },
  };
}
