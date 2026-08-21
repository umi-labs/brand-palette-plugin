import type { Field } from 'payload'
import deepMerge from '../utilities/deepMerge.js'

type ColourFieldOptions = {
  /** Field name. Default `colour`. */
  name?: string
  /** Global slug holding the palette. Default `brand-palette`. */
  globalSlug?: string
  /** Dot-path to the palette array within the global. Default `palette`. */
  palettePath?: string
  required?: boolean
  overrides?: Partial<Field>
}

/**
 * A text field that stores a hex colour, rendered as a row of swatches read
 * from your brand palette global. Editors pick a brand colour rather than
 * typing arbitrary hex.
 */
export const colourField = ({
  name = 'colour',
  globalSlug = 'brand-palette',
  palettePath = 'palette',
  required = false,
  overrides = {},
}: ColourFieldOptions = {}): Field => {
  const result: Field = {
    name,
    type: 'text',
    required,
    admin: {
      description: 'Pick a colour from your brand palette.',
      components: {
        Field: {
          path: '@foundrykit/brand-palette-plugin/client#ColourSwatchField',
          clientProps: { globalSlug, palettePath },
        },
      },
    },
  }
  return deepMerge(result, overrides)
}
