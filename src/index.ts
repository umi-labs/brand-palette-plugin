import type { Config } from 'payload'
import { paletteGlobal } from './globals/paletteGlobal.js'

export type BrandPaletteConfig = {
  /** Global slug for the palette. Default `brand-palette`. */
  globalSlug?: string
  /** Admin sidebar group. Default `Settings`. */
  adminGroup?: string
  /** Array field name within the global. Default `palette`. */
  paletteFieldName?: string
  /** Register the palette global. Default true (set false if you add it yourself). */
  addGlobal?: boolean
  disabled?: boolean
}

export type { BrandPaletteConfig as PluginConfig }
export { colourField } from './fields/colour.js'
export { paletteGlobal } from './globals/paletteGlobal.js'

/**
 * Adds an editor-managed brand palette to the admin. Register the plugin, add
 * `colourField()` wherever you want a brand-colour picker, and editors choose
 * from the palette they defined — no more hardcoded hex.
 */
export const brandPalettePlugin =
  (options: BrandPaletteConfig = {}) =>
  (config: Config): Config => {
    if (options.addGlobal !== false && !options.disabled) {
      config.globals = [
        ...(config.globals ?? []),
        paletteGlobal({
          slug: options.globalSlug,
          adminGroup: options.adminGroup,
          paletteFieldName: options.paletteFieldName,
        }),
      ]
    }
    return config
  }

export default brandPalettePlugin
