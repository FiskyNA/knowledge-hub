import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) || 'system'
  )

  useEffect(() => {
    const root = document.documentElement
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const applyTheme = (t: Theme) => {
      if (t === 'dark' || (t === 'system' && systemPrefersDark)) {
        root.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        root.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
      }
    }

    applyTheme(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const setTheme = (t: Theme) => setThemeState(t)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
