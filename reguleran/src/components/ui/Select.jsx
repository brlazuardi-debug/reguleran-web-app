import { forwardRef } from 'react'

const Select = forwardRef(function Select({
  label,
  error,
  options = [],
  placeholder,
  className = '',
  id,
  ...props
}, ref) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-mono font-medium text-neutral-700 dark:text-[#c4c7ca] uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={`
          w-full rounded-lg border bg-white px-3.5 py-2 text-sm
          text-neutral-900
          transition-all duration-200
          focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30
          dark:bg-[#13161B] dark:text-white
          ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
            : 'border-neutral-300 dark:border-white/[0.08]'
          }
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options.map(opt => {
          const value = typeof opt === 'string' ? opt : opt.value
          const label = typeof opt === 'string' ? opt : opt.label
          return <option key={value} value={value}>{label}</option>
        })}
      </select>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-mono">{error}</p>
      )}
    </div>
  )
})

export { Select }
