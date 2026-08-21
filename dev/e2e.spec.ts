import { expect, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const shot = (name: string) => path.resolve(dirname, 'screenshots', name)

test('capture admin screenshots', async ({ page }) => {
  test.setTimeout(180_000)

  // The sandbox proxy occasionally stalls a webfont request, which makes
  // Playwright's screenshot hang on "waiting for fonts to load". Resolve
  // fonts.ready immediately so screenshots never block on it.
  await page.addInitScript(() => {
    try {
      Object.defineProperty(document, 'fonts', {
        configurable: true,
        get: () => ({
          ready: Promise.resolve(),
          status: 'loaded',
          check: () => true,
          addEventListener() {},
          removeEventListener() {},
        }),
      })
    } catch {
      /* noop */
    }
  })

  const res = await page.request.post('/api/users/login', {
    data: { email: 'dev@payloadcms.com', password: 'test' },
  })
  expect(res.ok(), `login failed: ${res.status()}`).toBeTruthy()

  // 1. Brand palette global (hex pickers)
  await page.goto('/admin/globals/brand-palette')
  await page.waitForSelector('.react-colorful, input#field-palette__0__value', { timeout: 90_000 })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: shot('01-brand-palette.png'), fullPage: true })

  // 2. A category doc showing the swatch picker (wait for swatches to render)
  const list = await page.request.get('/api/categories?limit=1')
  const id = (await list.json()).docs[0].id
  await page.goto(`/admin/collections/categories/${id}`)
  await page.waitForSelector('#field-title', { timeout: 90_000 })
  await page.waitForSelector('.field-type button[title]', { timeout: 30_000 }).catch(() => {})
  await page.waitForTimeout(1500)
  await page.screenshot({ path: shot('02-colour-swatch.png'), fullPage: true })
})
