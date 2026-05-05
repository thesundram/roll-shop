"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  collapsed?: boolean;
}

export default function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150",
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group relative",
        collapsed && "justify-center px-2"
      )}
    >
      {/* Animated icon swap */}
      <div className="relative shrink-0 w-[18px] h-[18px]">
        <Sun
          size={18}
          className={cn(
            "absolute inset-0 transition-all duration-300 text-muted-foreground group-hover:text-sidebar-accent-foreground",
            isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
          )}
        />
        <Moon
          size={18}
          className={cn(
            "absolute inset-0 transition-all duration-300 text-muted-foreground group-hover:text-sidebar-accent-foreground",
            isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
          )}
        />
      </div>

      {!collapsed && (
        <span className="truncate">{isDark ? "Night Mode" : "Day Mode"}</span>
      )}

      {/* Collapsed tooltip */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-card border border-border rounded-md text-xs text-foreground whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
          {isDark ? "Night Mode" : "Day Mode"}
        </div>
      )}

      {!collapsed && (
        /* Pill track indicator */
        <div
          className={cn(
            "ml-auto relative flex items-center w-9 h-5 rounded-full border transition-colors duration-300 shrink-0",
            isDark
              ? "bg-primary/20 border-primary/40"
              : "bg-amber-100 border-amber-300"
          )}
        >
          <span
            className={cn(
              "absolute w-3.5 h-3.5 rounded-full shadow-sm transition-all duration-300",
              isDark
                ? "translate-x-[18px] bg-primary"
                : "translate-x-[2px] bg-amber-400"
            )}
          />
        </div>
      )}
    </button>
  );
}
