import type { Theme } from './types.js'

export const themeLocalStorageKey = 'payload-theme'
export const defaultTheme: Theme = 'light'

export const getImplicitPreference = (): Theme | null => {
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  if (typeof mql.matches === 'boolean') return mql.matches ? 'dark' : 'light'
  return null
}
