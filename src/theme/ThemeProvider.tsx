'use client'
import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import canUseDOM from './canUseDOM.js'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared.js'
import { type Theme, type ThemeContextType, themeIsValid } from './types.js'

const initialContext: ThemeContextType = { setTheme: () => null, theme: undefined }
const ThemeContext = createContext(initialContext)

/**
 * Frontend light/dark theme provider. Sets `data-theme` on <html>, respects the
 * OS preference, and persists the user's choice. Pair with CSS that keys off
 * `[data-theme="dark"]`.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
      const implicit = getImplicitPreference()
      document.documentElement.setAttribute('data-theme', implicit || '')
      if (implicit) setThemeState(implicit)
    } else {
      setThemeState(themeToSet)
      window.localStorage.setItem(themeLocalStorageKey, themeToSet)
      document.documentElement.setAttribute('data-theme', themeToSet)
    }
  }, [])

  useEffect(() => {
    let themeToSet: Theme = defaultTheme
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    if (themeIsValid(preference)) themeToSet = preference
    else {
      const implicit = getImplicitPreference()
      if (implicit) themeToSet = implicit
    }
    document.documentElement.setAttribute('data-theme', themeToSet)
    setThemeState(themeToSet)
  }, [])

  return <ThemeContext.Provider value={{ setTheme, theme }}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)
