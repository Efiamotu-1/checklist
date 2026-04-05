"use client";

import * as React from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-surface/50 border border-border animate-pulse" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <HiOutlineSun
          className={`absolute inset-0 transition-all duration-500 transform ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
            }`}
        />
        <HiOutlineMoon
          className={`absolute inset-0 transition-all duration-500 transform ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
            }`}
        />
      </div>
    </button>
  );
}
