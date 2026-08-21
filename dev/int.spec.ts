import type { Payload } from 'payload'
import config from '@payload-config'
import { getPayload } from 'payload'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

let payload: Payload
beforeAll(async () => { payload = await getPayload({ config }) })
afterAll(async () => { await payload.destroy() })

describe('brandPalettePlugin', () => {
  test('registers the brand-palette global', () => {
    expect(payload.config.globals.some((g) => g.slug === 'brand-palette')).toBe(true)
  })

  test('the palette global stores named colours', async () => {
    const g = await payload.findGlobal({ slug: 'brand-palette' })
    const palette = (g as { palette?: { name: string; value: string }[] }).palette ?? []
    expect(palette.length).toBeGreaterThanOrEqual(3)
    expect(palette[0]).toHaveProperty('value')
  })

  test('colourField stores a hex value on a document', async () => {
    const doc = await payload.create({ collection: 'categories', data: { title: 'Reefs', colour: '#95d3e6' } as never })
    expect((doc as { colour?: string }).colour).toBe('#95d3e6')
  })
})
