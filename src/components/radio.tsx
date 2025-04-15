import React from 'react'

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  name?: string
  id?: string
  label?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  checked?: boolean
  error?: string
  disabled?: boolean
  classNameLabel?: string
  title?: string
  required?: boolean
  value?: any
}

export default function Radio({
  className,
  name,
  id,
  label,
  onChange,
  onBlur,
  checked,
  disabled,
  classNameLabel,
  title,
  error,
  required,
  value
}: RadioProps) {
  return (
    <div className='form-group'>
      {label && (
        <label
          htmlFor={id}
          className={`block mb-1.5 text-[#0a2e52] text-sm font-medium ${classNameLabel}`}
        >
          {label} {required && <span className='text-[#e74c3c]'>*</span>}
        </label>
      )}
      <div className='radio-group'>
        <div className='radio-container'>
          <input
            id={id}
            type='radio'
            name={name}
            className={`mr-1.5 ${className}`}
            onChange={onChange}
            onBlur={onBlur}
            checked={checked}
            disabled={disabled}
            aria-invalid={!!error}
            value={value}
          />
          {title && (
            <label htmlFor={id} className='text-sm cursor-pointer'>
              {title}
            </label>
          )}
        </div>
      </div>
      {error && (
        <span className='block mt-1 text-sm text-[#e74c3c]'>{error}</span>
      )}
    </div>
  )
}
