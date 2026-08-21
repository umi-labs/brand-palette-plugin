'use client'
import { type RowLabelProps, useRowLabel } from '@payloadcms/ui'

type PaletteRow = { name?: string; value?: string }

export const PaletteRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<PaletteRow>()
  const label = data?.data?.name
    ? `Colour ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.name}`
    : 'Row'
  return <div>{label}</div>
}
