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
}: RadioProps) {
  return (
    <div className='flex flex-col justify-center'>
      {label && (
        <label htmlFor={id} className={`text-[12px] pt-3 ${classNameLabel}`}>
          {label} {required && <span className='text-red-500'>※</span>}
        </label>
      )}
      <div className='flex items-center'>
        <input
          id={id}
          type='radio'
          name={name}
          className={className}
          onChange={onChange}
          onBlur={onBlur}
          checked={checked}
          disabled={disabled}
          aria-invalid={!!error}
        />
        {title && (
          <label htmlFor={id} className='ml-2 text-[12px] pt-1 cursor-pointer'>
            {title}
          </label>
        )}
      </div>
      {error && <span className='text-red-500 text-[12px] mt-1'>{error}</span>}
    </div>
  )
}
