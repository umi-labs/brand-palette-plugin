import type { GlobalConfig } from 'payload'

type PaletteGlobalOptions = {
  slug?: string
  adminGroup?: string
  paletteFieldName?: string
}

/**
 * A global holding the brand palette — a list of named colours edited with the
 * hex picker. `colourField` reads its swatches from here.
 */
export const paletteGlobal = ({
  slug = 'brand-palette',
  adminGroup = 'Settings',
  paletteFieldName = 'palette',
}: PaletteGlobalOptions = {}): GlobalConfig => ({
  slug,
  label: 'Brand Palette',
  access: { read: () => true },
  admin: { group: adminGroup },
  fields: [
    {
      name: paletteFieldName,
      type: 'array',
      labels: { singular: 'Colour', plural: 'Colours' },
      admin: {
        initCollapsed: false,
        components: { RowLabel: '@foundrykit/brand-palette-plugin/client#PaletteRowLabel' },
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            components: { Field: '@foundrykit/brand-palette-plugin/client#HexColourInput' },
          },
        },
      ],
    },
  ],
})
