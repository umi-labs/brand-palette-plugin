'use client'
import { FieldError, FieldLabel, useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'
import type React from 'react'
import { useEffect, useState } from 'react'

type PaletteEntry = { name?: string; value?: string }

type ColourSwatchFieldProps = TextFieldClientProps & {
  /** Global slug holding the palette (via clientProps). */
  globalSlug?: string
  /** Dot-path to the palette array within the global (via clientProps). */
  palettePath?: string
}

const readPath = (obj: unknown, dotPath: string): PaletteEntry[] => {
  const out = dotPath.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj)
  return Array.isArray(out) ? (out as PaletteEntry[]) : []
}

export const ColourSwatchField: React.FC<ColourSwatchFieldProps> = ({
  field,
  path,
  readOnly,
  globalSlug = 'brand-palette',
  palettePath = 'palette',
}) => {
  const { label, required } = field
  const { value, setValue, showError } = useField<string>({ path })
  const [palette, setPalette] = useState<PaletteEntry[]>([])

  useEffect(() => {
    fetch(`/api/globals/${globalSlug}?depth=0`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setPalette(readPath(data, palettePath)))
      .catch(() => {})
  }, [globalSlug, palettePath])

  return (
    <div
      className={['field-type', 'text', showError && 'error', readOnly && 'read-only']
        .filter(Boolean)
        .join(' ')}
    >
      <FieldLabel label={label} path={path} required={required} />
      <FieldError path={path} showError={showError} />
      {palette.length === 0 ? (
        <p style={{ color: 'var(--theme-elevation-400)', fontSize: '0.875rem' }}>
          No colours in the palette yet. Add some in your Brand Palette global.
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
          {palette.map((entry, i) => {
            const hex = entry.value || '#000000'
            const isSelected = value === hex
            return (
              <button
                key={i}
                disabled={readOnly}
                onClick={(e) => {
                  e.preventDefault()
                  if (!readOnly) setValue(hex)
                }}
                title={entry.name ?? hex}
                type="button"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.375rem',
                  borderRadius: '0.375rem',
                  border: isSelected
                    ? '2px solid var(--theme-text)'
                    : '2px solid var(--theme-elevation-200)',
                  background: 'none',
                  cursor: readOnly ? 'default' : 'pointer',
                }}
              >
                <div
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: hex,
                    border: '1px solid var(--theme-elevation-150)',
                  }}
                />
                {entry.name && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--theme-elevation-600)' }}>
                    {entry.name}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
