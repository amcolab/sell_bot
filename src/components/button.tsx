import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string
  className?: string
  title?: string
  children?: React.ReactNode
  styleBtn?: 'primary' | 'danger'
}

const buttonStyle = {
  primary:
    'bg-[#0a2e52] hover:bg-[#1a4980] hover:shadow-[0_5px_15px_rgba(10,46,82,0.2)]',
  danger: 'bg-red-600 hover:bg-red-700',
}
export default function Button({
  className,
  children,
  styleBtn = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-full py-3.5 px-0 rounded text-base font-medium text-white border-none cursor-pointer transition-all duration-300 ${buttonStyle[styleBtn]} ${className}`}
    >
      {children}
    </button>
  )
}
