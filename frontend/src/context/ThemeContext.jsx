import { createContext, useContext, useEffect, useState } from "react";

const KEY = "tuneshed:theme";
const ThemeContext = createContext(null);

const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

function readTheme() {
  try {
    return localStorage.getItem(KEY) || "light";
  } catch {
    return "system";
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme); // "light" | "dark" | "system"
  const [isDark, setIsDark] = useState(() => theme === "dark" || (theme === "system" && systemDark()));

  useEffect(() => {
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && systemDark());
      document.documentElement.classList.toggle("dark", dark);
      setIsDark(dark);
    };
    apply();
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  return <ThemeContext value={{ theme, setTheme, isDark }}>{children}</ThemeContext>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
