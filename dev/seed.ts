import type { Payload } from 'payload'
import { devUser } from './helpers/credentials.js'

export const seed = async (payload: Payload) => {
  const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: devUser.email } } })
  if (!totalDocs) await payload.create({ collection: 'users', data: devUser })

  await payload.updateGlobal({
    slug: 'brand-palette',
    data: {
      palette: [
        { name: 'Turquoise', value: '#00a9c4' },
        { name: 'Sky', value: '#95d3e6' },
        { name: 'Sand', value: '#e6dcc8' },
        { name: 'Ink', value: '#1f2937' },
        { name: 'Coral', value: '#ff6f61' },
      ],
    } as never,
  })

  const { totalDocs: catCount } = await payload.count({ collection: 'categories' })
  if (!catCount) {
    await payload.create({ collection: 'categories', data: { title: 'Beaches', colour: '#00a9c4' } as never })
  }
}
