"use client";

import { useState, useEffect } from "react";

export type Theme = "dark" | "light";

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("horizon-theme") as Theme | null;
    const resolved: Theme = stored === "light" ? "light" : "dark";
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("horizon-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  };

  return [theme, toggle];
}
