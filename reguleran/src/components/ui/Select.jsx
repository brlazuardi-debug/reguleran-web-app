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
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={`
          w-full rounded-xl border bg-white px-4 py-2.5 text-sm
          text-neutral-900
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-neutral-500/30 focus:border-neutral-500
          dark:bg-neutral-900 dark:text-neutral-100
          dark:focus:ring-neutral-400/20
          ${error
            ? 'border-neutral-400 focus:border-neutral-600 focus:ring-neutral-600/30 dark:border-neutral-600'
            : 'border-neutral-300 dark:border-neutral-700'
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
        <p className="text-xs text-neutral-600 dark:text-neutral-400">{error}</p>
      )}
    </div>
  )
})

export { Select }
