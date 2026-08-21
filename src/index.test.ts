import { describe, expect, it } from 'vitest'
import { brandPalettePlugin, colourField, paletteGlobal } from './index.js'

describe('paletteGlobal', () => {
  it('builds a global with a palette array (name + value)', () => {
    const g = paletteGlobal()
    expect(g.slug).toBe('brand-palette')
    const arr = g.fields[0] as { name: string; fields: { name: string }[] }
    expect(arr.name).toBe('palette')
    expect(arr.fields.map((f) => f.name)).toEqual(['name', 'value'])
  })
  it('honours a custom slug + field name', () => {
    const g = paletteGlobal({ slug: 'branding', paletteFieldName: 'colours' })
    expect(g.slug).toBe('branding')
    expect((g.fields[0] as { name: string }).name).toBe('colours')
  })
})

describe('colourField', () => {
  it('is a text field wired to the swatch component with source clientProps', () => {
    const f = colourField({ globalSlug: 'branding', palettePath: 'colours' }) as {
      type: string
      admin: { components: { Field: { path: string; clientProps: Record<string, string> } } }
    }
    expect(f.type).toBe('text')
    expect(f.admin.components.Field.path).toBe('@foundrykit/brand-palette-plugin/client#ColourSwatchField')
    expect(f.admin.components.Field.clientProps).toEqual({ globalSlug: 'branding', palettePath: 'colours' })
  })
})

describe('brandPalettePlugin', () => {
  it('registers the palette global by default', () => {
    const cfg = brandPalettePlugin()({ globals: [] } as never)
    expect((cfg.globals ?? []).some((g) => g.slug === 'brand-palette')).toBe(true)
  })
  it('can skip registering the global', () => {
    const cfg = brandPalettePlugin({ addGlobal: false })({ globals: [] } as never)
    expect(cfg.globals).toEqual([])
  })
})
