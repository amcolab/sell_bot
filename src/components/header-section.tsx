import React from 'react'

interface HeaderSectionProps {
  title: string
  stepNumber: number
  children?: React.ReactNode
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ title, stepNumber, children }) => {
  return (
    <div className="mt-2 border rounded-lg">
      <div className='border-b px-4 pt-4 bg-gray-200 rounded-t-lg'>
        <h3 className="text-lg font-semibold mb-3">
          <span className="inline-block w-8 h-8 leading-8 text-center text-white bg-[#0a2e52] rounded-full mr-2">
            {stepNumber}
          </span>
          {title}
        </h3>
      </div>
      <div className='p-4'>
        {children}
      </div>
    </div>
  )
}

export default HeaderSection 