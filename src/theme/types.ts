export type Theme = 'dark' | 'light'

export interface ThemeContextType {
  setTheme: (theme: Theme | null) => void
  theme?: Theme | null
}

export function themeIsValid(str: null | string): str is Theme {
  return str ? ['dark', 'light'].includes(str) : false
}
