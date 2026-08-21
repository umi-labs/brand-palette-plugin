'use client'
import { FieldError, FieldLabel, useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'
import type React from 'react'
import { HexColorPicker } from 'react-colorful'

export const HexColourInput: React.FC<TextFieldClientProps> = ({ field, path, readOnly }) => {
  const { label, required } = field
  const { value, setValue, showError } = useField<string>({ path })
  const hex = value || '#000000'

  return (
    <div
      className={['field-type', 'text', showError && 'error', readOnly && 'read-only']
        .filter(Boolean)
        .join(' ')}
    >
      <FieldLabel label={label} path={path} required={required} />
      <FieldError path={path} showError={showError} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <HexColorPicker color={hex} onChange={(newHex) => { if (!readOnly) setValue(newHex) }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '2rem', height: '2rem', borderRadius: '0.25rem',
              backgroundColor: hex, border: '1px solid var(--theme-elevation-200)', flexShrink: 0,
            }}
          />
          <input
            disabled={readOnly}
            id={`field-${path?.replace(/\./g, '__')}`}
            name={path}
            onChange={(e) => {
              const raw = e.target.value
              if (/^#[0-9a-fA-F]{0,6}$/.test(raw)) setValue(raw)
            }}
            type="text"
            value={hex}
          />
        </div>
      </div>
    </div>
  )
}
