import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  placeholder?: string
  type?: string
  name?: string
  id?: string
  label?: string
  onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onblur?: (e: React.FocusEvent<HTMLInputElement>) => void
  value?: any
  error?: string
  disabled?: boolean
  classNameLabel?: string
  required?: boolean
}

export default function Input({
  className,
  placeholder,
  type,
  name,
  id,
  label,
  onchange,
  onblur,
  value,
  error,
  disabled,
  classNameLabel,
  required,
}: InputProps) {
  return (
    <div className='form-group w-full relative'>
      {label && (
        <label
          htmlFor={id}
          className={`block mb-1.5 text-[#0a2e52] text-sm font-medium ${classNameLabel}`}
        >
          {label} {required && <span className='text-[#e74c3c]'>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        className={`w-full px-4 py-3 border border-[#e0e0e0] rounded text-[15px] text-[#333] bg-white focus:border-[#0a2e52] focus:outline-none focus:shadow-[0_0_0_2px_rgba(10,46,82,0.1)] ${className}`}
        placeholder={placeholder}
        onChange={onchange}
        onBlur={onblur}
        value={value}
        disabled={disabled}
      />
      {error && (
        <span className='block mt-1 text-sm text-[#e74c3c]'>{error}</span>
      )}
    </div>
  )
}
