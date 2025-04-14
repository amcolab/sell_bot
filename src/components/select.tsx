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
    <div className={`form-group ${parentClass}`}>
      {label && (
        <label
          htmlFor={id}
          className='block mb-1.5 text-[#0a2e52] text-sm font-medium'
        >
          {label} {required && <span className='text-[#e74c3c]'>*</span>}
        </label>
      )}
      <div className='relative'>
        <select
          id={id}
          value={value}
          name={name}
          className={`w-full px-4 py-3 border border-[#e0e0e0] rounded text-[15px] text-[#333] bg-white focus:border-[#0a2e52] focus:outline-none focus:shadow-[0_0_0_2px_rgba(10,46,82,0.1)] pr-10 bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")] bg-no-repeat bg-[right_15px_center] ${className}`}
          onChange={onchange}
        >
          {placeholder && (
            <option className='text-[#6b7280]' value=''>
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
        <span className='block mt-1 text-sm text-[#e74c3c]'>{error}</span>
      )}
    </div>
  )
}

export default Select
