import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Create a context object to share theme information across the app.
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize dark mode from saved localStorage value or system preference.
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply the dark class and save the chosen theme when it changes.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Memoize the context value to avoid unnecessary rerenders.
  const value = useMemo(() => ({ isDarkMode, setIsDarkMode }), [isDarkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Custom hook to consume the theme context from any component.
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}