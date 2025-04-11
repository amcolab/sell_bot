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
    <div className='flex flex-col'>
      {label && (
        <label htmlFor={id} className={`text-[12px] ${classNameLabel}`}>
          {label} {required && <span className='text-red-500'>※</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        className={`mt-1 block w-full rounded-md border boder-2 px-2 py-1 border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
        placeholder={placeholder}
        onChange={onchange}
        onBlur={onblur}
        value={value}
        disabled={disabled}
      />
      {error && <span className='text-red-500 text-[12px]'>{error}</span>}
    </div>
  )
}
