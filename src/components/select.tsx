export interface SelectOption {
  value: any
  label: string
  className?: string
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  className?: string
  label?: string
  placeholder?: string
  id?: string
  name?: string
  parentClass?: string
  onchange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  error?: string
  required?: boolean
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  className = '',
  label,
  placeholder,
  id,
  name,
  parentClass,
  onchange,
  error,
  required,
}) => {
  return (
    <div className={`flex flex-col ${parentClass}`}>
      {label && (
        <label htmlFor={id} className='text-[12px]'>
          {label} {required && <span className='text-red-500'>※</span>}
        </label>
      )}
      <div className='relative'>
        <select
          id={id}
          value={value}
          name={name}
          className={`mt-1 block w-full bg-white rounded-md border boder-2 px-2 py-1 border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
          onChange={onchange}
        >
          {placeholder && (
            <option className={'text-[#6b7280]'} value=''>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option
              className={`!w-full ${option.className}`}
              key={index}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span className='text-red-500 text-[12px] text-sm'>{error}</span>
      )}
    </div>
  )
}

export default Select
