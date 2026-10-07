import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}>
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
