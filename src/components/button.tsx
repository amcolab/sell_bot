import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string
  className?: string
  title?: string
  children?: React.ReactNode
  styleBtn?: 'primary' | 'danger'
}

const buttonStyle = {
  primary: 'btn btn-primary',
  danger: 'btn btn-outline-danger',
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
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${buttonStyle[styleBtn]} ${className}`}
    >
      {children}
    </button>
  )
}
