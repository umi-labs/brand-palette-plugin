import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { brandPalettePlugin, colourField } from '@foundrykit/brand-palette-plugin'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
if (!process.env.ROOT_DIR) process.env.ROOT_DIR = dirname

export default buildConfig({
  admin: {
    importMap: { baseDir: path.resolve(dirname) },
    autoLogin: { email: 'dev@payloadcms.com', password: 'test', prefillOnly: true },
  },
  collections: [
    {
      slug: 'categories',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true },
        colourField({ name: 'colour', required: false }),
      ],
    },
    { slug: 'media', fields: [], upload: { staticDir: path.resolve(dirname, 'media') } },
  ],
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI || `file:${path.resolve(dirname, 'dev.db')}` },
    push: true,
  }),
  editor: lexicalEditor(),
  onInit: async (payload) => { await seed(payload) },
  plugins: [brandPalettePlugin()],
  secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
